(function($){

  
  $("#games").change(function() {
    getGameInfo(this.value);
  });

  $("#session_date").change(function() {
    $("#num_players").focus();
  });

  $("#num_players").change(function() {
    $("#points").html('');
    var html = '';
    var iType = '';
    var tabIndex = 3;
    var num_players = $("#num_players").val();

    html += '<div class="left scoring_labels">';
    html += '<span class="player_label scoring_label">Player</span>';
    $.each(gameData.scoring, function(i, value) {
        html += '<span class="'+value.slug+'_label scoring_label">'+value.title+'</span>';
    });
    html += '<span class="scoring_label"></span></div>';

    //Loop through each player and then though each scoring option.


    for(var x =0; x < num_players;x++) {
      html += '<div class="left playercol player'+x+'">';

        html += '<span class="player player_score_wrapper" >';
          html += '<span class="no-show player_label">Player #'+(x+1)+'</span>';

          html += '<span class="player'+x+' txt_field">';
          html += '<select class="col'+x+' player" tabIndex="'+tabIndex+'" data-cols="'+x+'" id="player'+x+'" name="player">';

          html += '<option value="">Name of Player</option>';
          $.each(Players, function(i, value) {
            html += '<option value="'+value._id+'">'+value.last_name+', '+value.first_name+'</option>';
          });

          html += '</select></span>';

        html += '</span>';

        $.each(gameData.scoring, function(i, value) {
          var xType = (value.points[0] == '') ? 'text' : 'number';
          html += '<span class="player_score_wrapper">';

          html += '<span class="no-show '+value.slug+'_label">'+value.title+'</span>';
          html += '<span class="'+value.slug+x+' txt_field">';
          html += '<input type="'+xType+'" class="col'+x+'" tabIndex="'+tabIndex+'" data-cols="'+x+'" id="'+value.slug+x+'" name="'+value.slug+'"></span>';

          html += '</span>';
          tabIndex++;
        });
        html += '<span class="instance point_totals player_score_wrapper" id="points'+x+'"></span>';

        html += '<span class="instance buttons player_score_wrapper" >';
        if(x > 0) {
          html += '<button class="prev btn btn-lg btn-primary"  tabIndex="'+tabIndex+'" data-cols="'+x+'">Prev</button>';
          tabIndex++;
        }
        if(x < num_players-1) {
          html += '<button class="next btn btn-lg btn-primary" tabIndex="'+tabIndex+'" data-cols="'+x+'">Next</button>';
          tabIndex++;
        }
        html += '</span>';

      html += "</div>";
    }

    $("#btnSubmit").attr("tabIndex", tabIndex);

    $("#points").html(html);

    $(".next").on({
      click: function(e) {
        e.preventDefault();
        var x = parseFloat($(this).data('cols'))+1;
        focusPlayer(x);
      }
    });
    $(".prev").on({
      click: function(e) {
        e.preventDefault();
        var x = parseFloat($(this).data('cols'))-1;
        focusPlayer(x);
      }
    });

    for(x =0; x < $("#num_players").val();x++) {
      $(".col"+x).on({
        keyup: function() {
          var total = 0, step = 0;

          $.each($("input."+$(this)[0].className), function(i, val) {
            step = getPoints(this.value,gameData.scoring[i]);
            total += step;
          });
          var x = $(this).data('cols');
          $("#points"+x).html(total);
        }
      });
      $(".player").on({
        change: function() {
          var ntabindex = parseFloat(this.getAttribute('tabindex'));
          $('input[tabindex='+ntabindex+']').focus();
        }
      });
    }

    focusPlayer(0);

  });


})(jQuery);


function focusPlayer(col) {
  $(".playercol").hide();
  $(".player"+col).show();
  $(".player"+col+' .player_score_wrapper .col'+col)[0].focus();
}

