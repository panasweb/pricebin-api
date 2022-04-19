var express = require('express');
var router = express.Router();
const converter = require('./api/converter');

/* GET home page. */
router.post('/convert', converter.getCurrencyRate);  // params in req.body

router.get('/', function(req, res, next) {
  
  res.redirect("/doc");

});


module.exports = router;