var express = require('express');
var router = express.Router();
const converter = require('./api/converter');

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.redirect("/doc");

});

router.post('/convert', converter.getCurrencyRate);  // params in req.body

module.exports = router;