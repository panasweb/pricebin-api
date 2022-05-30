var express = require('express');
var router = express.Router();
const user = require('../../controllers/usersController');
const list = require('../../controllers/listsController');
const superUserRequired = require('../../controllers/authorization').superUserRequired;

/* `/users/` prefix */
router.get("/", user.getAll);

router.post("/", user.create);

router.post("/delete/:id", superUserRequired, user.delete);

router.post("/by-username", user.findUserByUsername);

router.post("/by-email", user.findUserByEmail);

router.get("/:id", user.getOne);

router.post("/product/add", user.addProduct);

router.post("/product/delete", user.deleteProduct);

router.post("/product/clear", user.clearCurrentList);

router.post("/product/update", user.updateCurrentList);

router.post("/stats/recalculate", user.recalculateUserStats);

router.post("/stats/cool", user.getCoolStats);  // fav product, fav store

router.post('/mail/resend', user.resendMail);  // UserKey

module.exports = router;
