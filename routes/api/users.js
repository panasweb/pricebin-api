var express = require('express');
var router = express.Router();
const user = require('../../controllers/usersController');

/* `/users/` prefix */
router.get('/', function(req, res, next) {
  res.send('Pricebin users API');
});

router.post("/", user.create);

router.post("/delete/:id", user.delete);

router.get("/:id", user.getOne);

router.get("/", user.getAll);

module.exports = router;
