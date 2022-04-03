const express = require("express");
const router = express.Router();
const store = require("../../controllers/storesController");

/* `/stores/` PREFIX */
router.post("/", store.create);

router.post("/delete/:id", store.delete);

router.post("/by-name", store.findStoreByName)

router.get("/:id", store.getOne);

router.get("/", store.getAll);


module.exports = router;
