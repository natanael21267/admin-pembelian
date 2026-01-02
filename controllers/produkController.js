const db = require("../config/db");

exports.getDashboard = (req, res) => {
  db.query(
    "SELECT p.id, p.nama, p.harga, s.stock FROM produk p JOIN stock_produk s ON p.id=s.produk_id",
    (err, data) => res.render("index", { produk: data })
  );
};

exports.getProduk = (callback) => {
  db.query("SELECT * FROM produk", callback);
};
