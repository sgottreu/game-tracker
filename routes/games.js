var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/new', function(req, res) {
  //res.send('respond with a resource');
  res.render('games-new', { title: 'Add a Game' });
});

router.get('/', function(req, res) {
  //res.send('respond with a resource');
  res.render('games', { title: 'Add a Game' });
});

module.exports = router;
