const db = require("../config/db");
const produkController = require("./produkController");

exports.formPembelian = (req, res) => {
  produkController.getProduk((err, produk) =>
    res.render("pembelian", { produk })
  );
};

exports.simpanPembelian = (req, res) => {
  const { produk_id, qty } = req.body;

  db.query("SELECT harga FROM produk WHERE id=?", [produk_id], (e, r) => {
    const total = r[0].harga * qty;

    db.query(
      "INSERT INTO pembelian (produk_id,qty,total) VALUES (?,?,?)",
      [produk_id, qty, total]
    );

    db.query(
      "UPDATE stock_produk SET stock = stock - ? WHERE produk_id=?",
      [qty, produk_id]
    );

    res.redirect("/riwayat");
  });
};

exports.listPembelian = (req, res) => {
  db.query(
    `SELECT pb.*, pr.nama 
     FROM pembelian pb 
     JOIN produk pr ON pb.produk_id = pr.id 
     ORDER BY pb.id DESC`,
    (err, data) => res.render("riwayat", { data })
  );
};

exports.cancelPembelian = (req, res) => {
  const id = req.params.id;

  db.query("SELECT produk_id, qty FROM pembelian WHERE id=?", [id], (e, r) => {
    const { produk_id, qty } = r[0];

    db.query("UPDATE pembelian SET status='CANCEL' WHERE id=?", [id]);
    db.query(
      "UPDATE stock_produk SET stock = stock + ? WHERE produk_id=?",
      [qty, produk_id]
    );

    res.redirect("/riwayat");
  });
};
