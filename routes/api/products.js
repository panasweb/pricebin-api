const express = require("express");
const router = express.Router();
const product = require("../../controllers/productsController");

/* `/products/` PREFIX */
router.post("/", product.create);

router.post("/delete/:id", product.delete);

router.get("/:id", product.getOne);

router.get("/", product.getAll);

module.exports = router;
