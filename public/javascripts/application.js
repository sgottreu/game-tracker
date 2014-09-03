
var gameData;
var Players;

function getGameInfo(slug) {
    var request = $.ajax({
      url: "/games/"+slug+'.json',
      type: "GET",
      dataType: "json",
      async: false
    });
     
    request.done(function( data ) {
      if(data.slug != undefined) {
        gameData = data;
        var html = '<option># of Players</option>';
        for(var x = parseFloat(data.minPlayers); x <= parseFloat(data.maxPlayers);x++) {
          html += '<option value="'+x+'">'+x+'</option>';
        }
        $("#num_players").html(html);
      }
    });
}

function getPlayers() {
    var request = $.ajax({
      url: '/players.json',
      type: "GET",
      dataType: "json",
      async: false
    });
    
    request.done(function( data ) {   
      Players = data;

    });
    
}

