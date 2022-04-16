var express = require('express');
var router = express.Router();
const user = require('../../controllers/usersController');

/* `/users/` prefix */
router.get("/", user.getAll);

router.post("/", user.create);

router.post("/delete/:id", user.delete);

router.get("/by-username", user.findUserByUsername);

router.get("/by-email", user.findUserByEmail);

router.get("/:id", user.getOne);


module.exports = router;
