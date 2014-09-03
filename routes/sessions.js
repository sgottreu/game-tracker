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
  var expGames = require('./games.js');
  
console.log(expGames.getPoints);

  gameCollection.find({ 'slug' : req.params.slug }, {},function(e,games){
      res.render('sessions-new', {
          game: games[0],
          getPoints: expGames.getPoints
      });
  });
});

router.post('/new/:slug', function(req, res) {
  var slug = '', _id = '', players = {}, total = 0;
  var gameCollection = req.db.get('games');

  var expGames = require('./games.js');

  gameCollection.find({ 'slug' : req.params.slug }, {},function(e,games){
    var collection = req.db.get('sessions');
    for( var x=0;x<req.body.player.length;x++) {
      _id = req.body.player[x];
      players[_id] = { info: {}, points: {}, score: 0 };
      total = 0;

      for( var y=0;y<games[0].scoring.length;y++) {
        slug = games[0].scoring[y].slug;
        players[_id].points[slug] = {};
        players[_id].points[slug].count = req.body[slug][x];
        players[_id].points[slug].points = expGames.getPoints(req.body[slug][x], games[0].scoring[y]);
        total += players[_id].points[slug].points;
      }    
      players[_id].score = total;  
    }

    collection.insert(
    {
        "game_id" : req.body.game_id,
        "num_players" : req.body.num_players,
        "session_date" : req.body.session_date,
        players: players
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
});


router.get('/:id', function(req, res) {
  var collection = req.db.get('sessions');

  collection.findOne({ '_id' : req.params.id }, {},function(e,session){
    var gameCollection = req.db.get('games');

    gameCollection.findOne({ '_id' : session.game_id }, {},function(e,game){
      if(req.isJson) {
        var json = { session: session, game: game };
        res.send(JSON.stringify( json ));
      } else {
        res.render('sessions-show', {
            session : session,
            game: game
        });
      }
    });
  });
});

module.exports = router;

