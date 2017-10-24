$(document).ready(function() {

  $('#search').on('click', function(event) {
    event.preventDefault();

    var keyword = $('#search-word').val().trim();

    if(keyword){
      $('#default-page').fadeOut();
      $('#band-info').fadeIn();
      // drawArtist(keyword);
      // drawEvents(keyword);

    }
  })

})