const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./config/db"); // pastikan config/db.js sudah bener

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // untuk css/js

// ================== ROUTES =====================

// Dashboard
app.get("/", (req, res) => {
  res.render("index");
});

// List produk
app.get("/produk", (req, res) => {
  db.query("SELECT * FROM produk", (err, rows) => {
    if (err) return res.send("Database error: " + err.message);
    res.render("produk", { data: rows });
  });
});

// Form tambah pembelian
app.get("/pembelian", (req, res) => {
  db.query("SELECT * FROM produk", (err, rows) => {
    if (err) return res.send("Database error: " + err.message);
    res.render("pembelian", { produk: rows });
  });
});

// Simpan pembelian
app.post("/pembelian", (req, res) => {
  const { produk_id, qty } = req.body;

  db.query(
    "INSERT INTO pembelian (produk_id, qty, status) VALUES (?, ?, 'success')",
    [produk_id, qty],
    (err, result) => {
      if (err) return res.send("Database error: " + err.message);

      // update stok jika ada tabel stok_produk
      db.query(
        "UPDATE produk SET stok = stok - ? WHERE id = ?",
        [qty, produk_id],
        (err2) => {
          if (err2) console.log("Stok update error:", err2.message);
          res.redirect("/riwayat");
        }
      );
    }
  );
});

// Riwayat pembelian
app.get("/riwayat", (req, res) => {
  db.query(
    `SELECT pembelian.id, produk.nama AS nama, pembelian.qty, produk.harga, 
            (produk.harga * pembelian.qty) AS total, pembelian.status
     FROM pembelian 
     JOIN produk ON produk.id = pembelian.produk_id`,
    (err, rows) => {
      if (err) return res.send("Database error: " + err.message);
      res.render("riwayat", { data: rows });
    }
  );
});

// Cancel pembelian
app.get("/cancel/:id", (req, res) => {
  const id = req.params.id;

  db.query("UPDATE pembelian SET status='cancel' WHERE id=?", [id], (err) => {
    if (err) return res.send("Database error: " + err.message);
    res.redirect("/riwayat");
  });
});

// ================================================

app.listen(3000, () => console.log("Server running http://localhost:3000"));
