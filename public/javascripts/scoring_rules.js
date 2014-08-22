(function($){


  $("#inputNumScores").keypress(function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();

      createScoringRows($(this).val());
    }
  })

})(jQuery);

  function createScoringRows(numRows) {
      $("#scoringRulesBox").html('');
      var html = '';
      var iType = '';

      for(var x =1; x <= numRows; x++) {
        html += '<div><span class="score_label scoring scoring'+x+'" id="score_label'+x+'" data-row="'+x+'">Scoring Item '+x+':</span>';

        html += '<span class="scoring'+x+' scoring score_title span"><input tabIndex="'+(5+x)+'" type="text" class="score_title" name="score_title" id="score_title'+x+'" data-row="'+x+'"></span>';
        html += '<span class="scoring'+x+' scoring score_rule span"><input tabIndex="'+(5+x+parseFloat(numRows) ) +'" type="text" class="score_rule" name="score_rule" id="score_rule'+x+'" data-row="'+x+'"></span>';
        html += '<span class="scoring'+x+' scoring score_points span"><input tabIndex="'+(5+x+2*parseFloat(numRows) ) +'" type="text" class="score_points" name="score_points" id="score_points'+x+'" data-row="'+x+'"></span>';

        html += "</div>";
      }
      $("#scoringRulesBox").html(html);
      $("#score_title1").focus();
      
      $(".score_title").on({
          keypress: function(e) {
            if (e.keyCode == 13) {
              e.preventDefault();
            }
            $("#score_label"+$(this).data("row")).html($(this).val()+':');
          }
      });
      $(".score_rule").on({
          keypress: function(e) {
            if (e.keyCode == 13) {
              e.preventDefault();
            }
          }
      });

      $("#btnSubmit").attr("tabIndex", 1+5+3*parseFloat(numRows) );
  }

  function populateScoringRows(slug,numRows) {
    var request = $.ajax({
      url: "/games/"+slug+'.json',
      type: "GET",
      dataType: "json"
    });
     
    request.done(function( data ) {
      if(data.slug != undefined) {
        $.each(data.scoring, function(i, row) {
          var curr_row = i+1;
          if(row.title != '' && row.title != undefined) {
            $("#score_label"+curr_row).html(row.title+':');
            $("#score_title"+curr_row).val(row.title);
          }
          if(row.rules != undefined) {
            $("#score_rule"+curr_row).val(row.rules.join(';'));
          }
          if(row.points != undefined) {
            $("#score_points"+curr_row).val(row.points.join(';'));
          }
        });
      }
    });
  }