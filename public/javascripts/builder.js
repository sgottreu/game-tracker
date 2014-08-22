(function($){

  
  $("#games").change(function() {
    getGameInfo(this.value);
  });

  $("#numPlayers").change(function() {
    $("#points").html('');
    var html = '';
    var iType = '';
    var tabIndex = 0;
    var numPlayers = $("#numPlayers").val();

    html += '<div class="left scoring_labels">';
    $.each(gameData.scoring, function(i, value) {
        html += '<span class="'+value.slug+'_label scoring_label">'+value.title+'</span>';
    });
    html += '<span class="scoring_label"></span></div>';

    for(var x =0; x < numPlayers;x++) {
      html += '<div class="left playercol player'+x+'">';

      $.each(gameData.scoring, function(i, value) {
        html += '<span class="player_score_wrapper">';

        html += '<span class="hidden '+value.slug+'_label">'+value.title+'</span>';

        //for(var x =0; x < numPlayers;x++) {
          iType = (i >= 1) ? 'tel' : 'text';
          tabIndex = parseFloat(numPlayers)+4+(parseFloat(numPlayers) *x);
          
          html += '<span class="'+value.slug+x+' txt_field">';
          html += '<input type="'+iType+'" class="col'+x+'" tabIndex="'+tabIndex+'" data-cols="'+x+'" id="'+value.slug+x+'" name="'+value.slug+'"></span>';
          html
          
          html += '</span>';
        
      });
      html += '<span class="instance point_totals player_score_wrapper" id="points'+x+'"></span>';

      html += '<span class="instance buttons player_score_wrapper" >';
      if(x > 0) {
        html += '<button class="prev" data-cols="'+x+'">Prev</button>';
      }
      if(x < numPlayers-1) {
        html += '<button class="next" data-cols="'+x+'">Next</button>';
      }
      html += '</span>';
      html += "</div>";
    }

    // html += '<div>';
    // for(var x =0; x < $("#numPlayers").val();x++) {
    //   html += '<span class="instance point_totals" id="points'+x+'"></span>';
    // }
    // html += "</div>";

    $("#points").html(html);

    $(".next").on({
      click: function() {
        var x = parseFloat($(this).data('cols'))+1;
        $(".playercol").hide();
        $(".player"+x).show();
      }
    });
    $(".prev").on({
      click: function() {
        var x = parseFloat($(this).data('cols'))-1;
        $(".playercol").hide();
        $(".player"+x).show();
      }
    });

    for(x =0; x < $("#numPlayers").val();x++) {
      $(".col"+x).on({
        keyup: function() {
          var total = 0, step = 0;

          $.each($("."+$(this)[0].className), function(i, val) {
            step = getPoints(this.value,i);
            total += step;
          });
          var x = $(this).data('cols');
          $("#points"+x).html(total);
        },
        focus: function() {
          $(".playercol").hide();
          var x = $(this).data('cols');
          $(".player"+x).show();
        }
      });
    }
  });


})(jQuery);

var gameData;

function getGameInfo(slug) {
    var request = $.ajax({
      url: "/games/"+slug+'.json',
      type: "GET",
      dataType: "json"
    });
     
    request.done(function( data ) {
      if(data.slug != undefined) {
        gameData = data;
        var html = '<option>Players</option>';
        for(var x = parseFloat(data.minPlayers); x <= parseFloat(data.maxPlayers);x++) {
          html += '<option value="'+x+'">'+x+'</option>';
        }
        $("#numPlayers").html(html);
      }
    });
}

function getPoints(value, row)
{
  var rules = gameData.scoring[row].rules;
  var points = gameData.scoring[row].points;

  for(var x =0; x < rules.length;x++) {
    if( !isNaN(parseFloat( rules[x] )) && parseFloat( rules[x] ) == parseFloat(value) ) {
      return parseFloat(points[x]);
    }
    if(rules[x].substring(rules[x].length-1, rules[x].length) == '+') {
      if(rules[x]=='+' && value != '') {
        var eq = value+' '+points[0];
        return eval(eq);
      }

      var incr = parseFloat(rules[x].replace("+",""));
      if(parseFloat(value) >= incr) {
        return parseFloat(points[x]);
      }
    }
    if(rules[x].indexOf('..') >= 0) {
      var range = rules[x].split("..");
      for(var i = parseFloat(range[0]); i <= parseFloat(range[1]);i++) {
        if(i.toString() == value) {
          return parseFloat(points[x]);
        }
      }
    }
    if(rules[x]=='*' && value != '') {
      var eq = value+' '+points[0];
      return eval(eq);
    }
  }

  return 0;
}