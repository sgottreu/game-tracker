
function session_listing(session, game)
{
    var html = '';

    html += '<div class="left scoring_labels">';
    html += '<span class="player_label scoring_label">Player</span>';
    $.each(game.scoring, function(i, value) {
        html += '<span class="'+value.slug+'_label scoring_label">'+value.title+'</span>';
    });
    html += '<span class="scoring_label">Score</span></div>';

    //Loop through each player and then though each scoring option.

    var x = 0;
    for (var player in session.players) {
      if(session.players.hasOwnProperty(player)){
        var obj = session.players[player];

        html += '<div class="left playercol player'+x+'">';

        html += '<span class="player player_score_wrapper" >';
          html += '<span class="no-show player_label">Player #'+(x+1)+'</span>';
console.log(Players);
          $.each(Players, function(i, plr) {
            if(plr._id == player) {
              html += '<span class="player'+x+' txt_field">'+ plr.first_name+' '+plr.last_name+'</span>';
            }
          });

        html += '</span>';

        $.each(session.players[player].points, function(i, value) {

          html += '<span class="player_score_wrapper">';
          html += '<span class="txt_field">'+value.count+'</span>';
          html += '</span>';
        });
        html += '<span class="instance point_totals player_score_wrapper" id="points'+x+'">'+session.players[player].score+'</span>';

        html += "</div>";
        x++;
      }
    }

    
    $("#points").html(html);

}  