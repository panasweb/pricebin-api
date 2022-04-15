const express = require("express");
const router = express.Router();
const list = require("../../controllers/listsController");

/* `/lists/` PREFIX */
router.post("/", list.create);

router.post("/delete/:id", list.delete);

router.get("/of/:userId", list.getListsOfUser);

router.get("/:id", list.getOne);

router.get("/", list.getAll);

module.exports = router;
