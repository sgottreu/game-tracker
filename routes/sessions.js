var express = require('express');
var router = express.Router();



router.get('/', function(req, res) {
  var collection = req.db.get('sessions');

  collection.find({}, {},function(e,sessions){
    req.db.get('games').find({}, {},function(e,games){
      for( var x=0;x<sessions.length;x++) {
        for( var y=0;y<games.length;y++) {
          if(games[y]._id == sessions[x].game_id) {
            sessions[x].game = games[y];
            break;
          }
        }
      }

      if(req.isJson) {
        res.send(JSON.stringify( sessions ));
      } else {
        res.render('sessions', {
          sessions : sessions
        });
      }
    });
  });
});





router.get('/new/:slug', function(req, res) {

  var gameCollection = req.db.get('games');

  var collection = req.db.get('sessions');

  gameCollection.find({ 'slug' : req.params.slug }, {},function(e,games){
      res.render('sessions-new', {
          game: games[0]
      });
  });
});

router.post('/new/:slug', function(req, res) {
  var collection = req.db.get('sessions');

  collection.insert(
  {
      "game_id" : req.body.game_id,
      "num_players" : req.body.num_players,
      "session_date" : req.body.session_date,
      players: req.body.player 
  },
  function (err, doc) {
    if (err) {
        // If it failed, return error
        res.send("There was a problem adding the information to the database.");
    }
    else {
        // If it worked, set the header so the address bar doesn't still say /adduser
        res.location("sessions");
        // And forward to success page
        res.redirect("/sessions");
    }
  });
});

module.exports = router;

