$(document).ready(function() {

  $('#search').on('click', function(event) {
    event.preventDefault();

    var keyword = $('#search-word').val().trim();

    if(keyword){
      $('#default-page').fadeOut();
      $('#band-info').fadeIn();
      drawArtist(keyword);
      // drawEvents(keyword);
    }
  })

  function drawArtist(artist) {
    var lastURL = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&autocorrect=1&artist=' + artist + '&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json';

    $.ajax({
      url: lastURL,
      method: 'GET'
    }).done(function(response) {

      console.log(response);
      $('#band-name').append('<h1>' + response.artist.name + '</h1>');
      $('#bio-dump').append('<p>' + response.artist.bio.summary + '</p>')
      $('#artist-image').attr('src', response.artist.image[4]['#text']);

      for(var i = 0; i < response.artist.similar.artist.length; i++){
        var simName = $('<span class="sim-artist">');
        var simImg = $('<img class="sim-img">');
        var simDiv = $('<div class="sim-div">');
          var newName = response.artist.similar.artist[i].name;
          var newImg = response.artist.similar.artist[i].image[1]['#text'];
          simName.html(newName);
          simImg.attr('src', newImg);
          simDiv.attr('data-name', newName);
        simDiv.append(simImg);
        simDiv.append(simName);
        $('#sim-artist-dump').append(simDiv)
      }
    })
  }

  function drawEvents(artist) {
    var bandsURL = 'https://rest.bandsintown.com/artists/' + artist + '/events?app_id=lost&ffound';

    $.ajax({
      url: bandsURL,
      method: 'GET'
    }).done(function(response) {
      
    })
  }

})