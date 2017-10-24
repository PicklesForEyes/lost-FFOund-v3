$(document).ready(function() {

  $('#search').on('click', function(event) {
    event.preventDefault();

    var keyword = $('#search-word').val().trim();

    if(keyword){
      $('#default-page').fadeOut();
      $('#band-info').fadeIn();
      drawArtist(keyword);
      drawEvents(keyword);
    }
  })

  $('#submit').on('click', function(event) {
    event.preventDefault();
    var keyword = $('#search-word-2').val().trim();

    if(keyword) {
      drawArtist(keyword);
      drawEvents(keyword);
      $('#search-word-2').val('')
    }
  })

  function drawArtist(artist) {
    var lastURL = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&autocorrect=1&artist=' + artist + '&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json';

    $.ajax({
      url: lastURL,
      method: 'GET'
    }).done(function(response) {

      $('#band-name').html('<h1>' + response.artist.name + '</h1>');
      $('#bio-dump').append('<p>' + response.artist.bio.summary + '</p>')
      $('#artist-image').attr('src', response.artist.image[4]['#text']);
      $('#artist-image').attr('alt', response.artist.name);

      $('#sim-artist-dump').empty();

      for(var i = 0; i < response.artist.similar.artist.length; i++){
        var simName = $('<span class="sim-artist">');
        var simImg = $('<img class="sim-img">');
        var simDiv = $('<div class="sim-div">');
          var newName = response.artist.similar.artist[i].name;
          var newImg = response.artist.similar.artist[i].image[1]['#text'];
          simName.html(newName);
          simImg.attr('src', newImg);
          simImg.attr('alt', newName);
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

      console.log(response)

      var dataArr = [];

      if(!response.length){
        $('#concert-dump').append('<p>No upcoming events</p>')
      }
      else {
        for(var i = 0; i < response.length; i++) {
          if(response[i].offers.length){
          dataArr.push({
            'Event Date' : moment(response[i].datetime).format('MMM Do, YYYY h:mma'),
            'Venue Name' : response[i].venue.name,
            'Location' : response[i].venue.city + ', ' + response[i].venue.region,
            'Offers' : '<a href="' + response[i].offers[0].url + '">Get Tickets</a>'
            })
          }
        }
      }

      $('#concert-dump').DataTable({
        destroy: true,
        responsive: true,
        bSort: false,
        data: dataArr,
        columns: [
          { data: 'Event Date' },
          { data: 'Venue Name' },
          { data: 'Location' },
          { data: 'Offers' }
        ]
      })

    })
  }

})