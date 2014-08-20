var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
  var collection = req.db.get('games');

  collection.find({}, {},function(e,games){
      res.render('games', {
          games : games,
          title: 'Game List'
      });
  });
});




router.get('/new', function(req, res) {
  res.render('games-new', { title: 'Add a Game' });
});

router.post('/new', function(req, res) {
  var collection = req.db.get('games');

  collection.insert(
  {
      "title" : req.body.title,
      "slug" : req.body.title.replace(" ", "-").toLowerCase(),
      "url" : req.body.url,
      "minPlayers" : req.body.minPlayers,
      "maxPlayers" : req.body.maxPlayers
  },
  function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // If it worked, set the header so the address bar doesn't still say /adduser
          res.location("games");
          // And forward to success page
          res.redirect("/games");
      }
  });
});

router.get('/update/:slug', function(req, res) {
  var collection = req.db.get('games');

  collection.find({ 'slug' : req.params.slug }, {},function(e,games){
      res.render('games-update', {
          "games" : games,
          title: games[0].title
      });
  });
});

router.post('/update/:slug', function(req, res) {
  var collection = req.db.get('games');

  collection.updateById( req.body._id,
  {
      "title" : req.body.title,
      "slug" : req.body.title.replace(" ", "-").toLowerCase(),
      "url" : req.body.url,
      "minPlayers" : req.body.minPlayers,
      "maxPlayers" : req.body.maxPlayers
  },
  function (err, doc) {
      if (err) {
          // If it failed, return error
          res.send("There was a problem adding the information to the database.");
      }
      else {
          // If it worked, set the header so the address bar doesn't still say /adduser
          res.location("games");
          // And forward to success page
          res.redirect("/games");
      }
  });
});

router.get('/:slug', function(req, res) {
  var collection = req.db.get('games');

	var isJson = req.headers.accept.indexOf('application/json') >=0 ? true : false;

  collection.find({ 'slug' : req.params.slug }, {},function(e,games){

  	if(isJson) {
  		res.send(JSON.stringify( games[0] ));
  	} else {

      res.render('games-show', {
          game : games[0],
          title: games[0].title
      });
    }
  });
});

module.exports = router;


