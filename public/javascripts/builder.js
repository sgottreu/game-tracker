(function($){


  var rows = ['Player', 'City', 'Military', 'Treasury', 'Wonder', 'Civic', 'Commerce', 'Guilds', 'Science', 'Total'];

  $("#games").change(function() {
    var request = $.ajax({
      url: "/games/"+this.value,
      type: "GET",
      dataType: "json"
    });
     
    request.done(function( data ) {
      if(data.slug != undefined) {
        var html = '<option>Players</option>';
        for(var x = parseFloat(data.minPlayers); x <= parseFloat(data.maxPlayers);x++) {
          html += '<option value="'+x+'">'+x+'</option>';
        }
        $("#numPlayers").html(html);
      }
    });
  });

  $("#numPlayers").change(function() {
    $("#points").html('');
    var html = '';
    var iType = '';

    $.each(rows, function(i, value) {
      html += '<div><span class="'+value.toLowerCase()+'_label">'+value+'</span>';
      for(var x =0; x < $("#numPlayers").val();x++) {
        iType = (i >= 1) ? 'tel' : 'text';
        html += '<span class="'+value.toLowerCase()+x+'"><input type="'+iType+'" class="col'+x+'" id="'+value.toLowerCase()+x+'"></span>';
      }
      html += "</div>";
    });

    $("#points").html(html);
    for(x =0; x < $("#numPlayers").val();x++) {
      $(".col"+x).on({
        keyup: function() {
          var total = 0, step = 0;

          $.each($("."+$(this)[0].className), function(i, val) {
            step = (i > 1 && i < 9 && !isNaN(parseFloat( $("#"+this.id).val())) )  ? parseFloat($("#"+this.id).val()) : 0; 
            total += step;
          });

          $("."+$(this)[0].className)[9].value = total;
        }
      });
    }
  });


})(jQuery);
