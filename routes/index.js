var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

	var db = req.db;
    var collection = db.get('games');
    collection.find({},{},function(e,games){
        res.render('index', {
            "games" : games,
            title: 'Game Scoring'
        });
    });

});

module.exports = router;
