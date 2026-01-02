const express = require("express");
const router = express.Router();
const produk = require("../controllers/produkController");

router.get("/", produk.getDashboard);

module.exports = router;
