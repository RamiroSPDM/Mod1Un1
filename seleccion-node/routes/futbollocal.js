var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('futbollocal', { title: 'Futbol Local' });
});

module.exports = router;