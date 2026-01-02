const express = require("express");
const router = express.Router();
const pembelian = require("../controllers/pembelianController");

router.get("/pembelian", pembelian.formPembelian);
router.post("/pembelian", pembelian.simpanPembelian);
router.get("/riwayat", pembelian.listPembelian);
router.get("/cancel/:id", pembelian.cancelPembelian);

module.exports = router;
