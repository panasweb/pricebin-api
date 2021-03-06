const express = require("express");
const router = express.Router();
const product = require("../../controllers/productsController");
const {adminRequired} = require('../../controllers/authorization')

/* `/products/` PREFIX */
router.post("/", product.create);

router.post("/update-price", product.updatePrice);

router.post("/by-name", product.findProductsByName); // may have 'type' filter

router.post("/query/name-and-brand", product.findProductsByNameAndBrand);

router.post("/add-price", product.addPrice);

router.post("/delete-price", adminRequired, product.removePrice);

router.post("/delete/:id", adminRequired, product.delete);

router.get("/:id", product.getOne);

router.get("/", product.getAll);

module.exports = router;
