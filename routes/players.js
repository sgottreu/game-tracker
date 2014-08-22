var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
  var collection = req.db.get('players');

  collection.find({}, {},function(e,players){
    if(req.isJson) {
      res.send(JSON.stringify( players ));
    } else {
      res.render('players', {
          players : players,
          title: 'Player List'
      });
    }
  });
});




router.get('/new', function(req, res) {
  res.render('players-new', { title: 'Add a Player' });
});

router.post('/new', function(req, res) {
  var collection = req.db.get('players');

  collection.insert(
  {
      "first_name" : req.body.first_name,
      "last_name" : req.body.last_name,
      "username" : req.body.username
  },
  function (err, doc) {
    if (err) {
        // If it failed, return error
        res.send("There was a problem adding the information to the database.");
    }
    else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location("players");
        // And forward to success page
        res.redirect("/players");
    }
  });
});

router.get('/update/:username', function(req, res) {
  var collection = req.db.get('players');

  collection.find({ 'username' : req.params.username }, {},function(e,players){
      res.render('players-update', {
        player : players[0]
      });
  });
});

router.post('/update/:username', function(req, res) {
  var collection = req.db.get('players');

  collection.updateById( req.body._id,
  {
      "first_name" : req.body.first_name,
      "last_name" : req.body.last_name,
      "username" : req.body.username
  },
  function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // If it worked, set the header so the address bar doesn't still say /adduser
          res.location("players");
          // And forward to success page
          res.redirect("/players");
      }
  });
});

router.get('/:username', function(req, res) {
  var collection = req.db.get('players');

  collection.find({ 'username' : req.params.username }, {},function(e,players){

  	if(req.isJson) {
  		res.send(JSON.stringify( players[0] ));
  	} else {
      res.render('players-show', {
          player : players[0]
      });
    }
  });
});

module.exports = router;

