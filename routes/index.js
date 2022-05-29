var express = require('express');
var router = express.Router();
const converter = require('./api/converter');
const mailer = require('../controllers/mailer');

/* GET home page. */
router.post('/convert', converter.getCurrencyRate);  // params in req.body

// Params
router.post('/mail/test', mailer.testMail);
router.post('/mail/send', mailer.send2FAMail);

router.get('/', function(req, res, next) {
  res.redirect("/doc");
});


module.exports = router;