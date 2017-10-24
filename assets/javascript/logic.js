$(document).ready(function(){

//Global Var
var keyWord = '';
var trashValue;
var inputFirstClear = false;
var inputLastClear = false;
var inputSubjectClear = false;

// Page transitions
function fadingOut () {
    $('#dump').fadeOut();
    $('#human-contact').fadeOut();
    $('#animal-overlays').fadeOut();
    $('#band-search').fadeIn();
}
  $('#band-search-button').click(function() {

    if ($('#band-bio').is(':empty')) {
      $('#empty-bandsearch').show();
      $('#band-data').hide();
    } else {
      $('#empty-bandsearch').hide();
      $('#band-data').show();
    }
    fadingOut();
  });

$('#home').click(function() {
  $('#human-contact').fadeOut();
  $('#band-search').fadeOut();
  $('#animal-overlays').fadeIn();
  $('#dump').fadeIn();
});
$('#contact-human').click(function() {
  $('#band-search').fadeOut();
  $('#animal-overlays').fadeOut();
  $('#dump').fadeOut();
  $('#human-contact').fadeIn();
});

$('.slick-slide').imagesLoaded(function() {
  $('#footer').show();
});

//Hitting Enter changes display and runs the search
$(document).on('keydown', function(event){
  if (event.which === 13){
    event.preventDefault();
    keyWord = $('.submit').val().trim();

    if(keyWord.length > 0){
      fadingOut();
      drawArtist();
      $('.submit').val('')
    };
  };
});

//Click function that opens new info when similar artist is clicked
$(document).on('click', '.sim-div', function(event){
  event.preventDefault();
  keyWord = $(this).attr('data-name');
  drawArtist();
});

// Function to hit both APIs that will pull info on bands
  function drawArtist(){
    // console.log(keyWord);
    $('#events-table').empty();
    $('#similar').empty();

    var lastURL = 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&autocorrect=1&artist=' + keyWord + '&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json';
    var bandsURL = 'https://rest.bandsintown.com/artists/' + keyWord + '/events?app_id=lost&ffound';

    //last.fm call
    $.ajax({
      url: lastURL,
      method: 'GET'
    }).done(function(result){
      // console.log(result);

      // hide panda
      $('#empty-bandsearch').hide();
      $('#band-data').show();

      //handle error from ajax
      if (result.error) {
        console.log ('this is the error: ', result.message);
        $('#band-data').hide();
        $('#error').text(result.message);
        $('#empty-bandsearch').show();
      }

      // populate page with last.fm info
      $('#band-name').text(result.artist.name);
      $('#band-bio').html(result.artist.bio.summary)
      $('#band-img').attr('src', result.artist.image[4]['#text'])
      $('#band-img').css('visibility', 'visible');

      //iterate over 5 most similar artists to create similar artist table
      for(var i = 0; i < result.artist.similar.artist.length; i++){
        var simName = $('<span class="sim-artist">');
        var simImg = $('<img class="sim-img">');
        var simDiv = $('<div class="sim-div">');
          var newName = result.artist.similar.artist[i].name;
          var newImg = result.artist.similar.artist[i].image[1]['#text'];
          simName.html(newName);
          simImg.attr('src', newImg);
          simDiv.attr('data-name', newName);
        simDiv.append(simImg);
        simDiv.append(simName);

        $('#similar').append(simDiv);
        $('#similar').append('<br>');

      }

      //Bandsintown call
      $.ajax({
        url: bandsURL,
        method: 'GET',
      }).done(function(result){

        // console.log(result);

        //what happens when there are no upcoming events
        if(!result.length) {
          $('thead').css('visibility','hidden');
          $('#events-table').append('<p>No upcoming events.</p>')
        }

        //limits table to 5 events
        else if(result.length > 5){

          for(var i = 0; i < result.length; i++){
            $('#events-table').append(
              '<tr><td>' + moment(result[i].datetime).format('MMM Do, YYYY h:mma') +
              '</td><td>' + result[i].venue.name +
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.region + ', ' + result[i].venue.country +
              '</td><td><a target="_blank" href=' + result[i].offers[0].url + '>' + "Get Tickets!" + '</a></td></tr>'
              );
          }
        }

        else {

          for(var i = 0; i < result.length; i++){

            $('#events-table').append(
              '<tr><td>' + moment(result[i].datetime).format('MMM Do, YYYY h:mma') +
              '</td><td>' + result[i].venue.name +
              '</td><td>' + result[i].venue.city + ', ' + result[i].venue.region + ', ' + result[i].venue.country +
              '</td><td><a target="_blank" href=' + result[i].offers[0].url + '>' + "Get Tickets!" + '</a></td></tr>'
              );
          }
        }
      })
    })
  };

  // generates image for homepage image slideshow
  function scrollerApi(){
    var queryURL = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=97c0416057f9950af85f7d0fdd9991bd&format=json&limit=5';

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).done(function(res){

      console.log(res)

      for(var i = 0; i < res.artists.artist.length; i++){
        var trending = $('<div>')
        var artistImg = $('<img>');
        var artistName = $('<p>')

        artistName.text(res.artists.artist[i].name)
        artistImg.addClass('trending')
        artistImg.attr('src',res.artists.artist[i].image[4]['#text']);
        trending.append(artistImg, artistName);
        $('#trending-dump').append(trending);
      }

    // //slick settings 
    // $('#dump').slick({
    //   dots: false,
    //   infinite: true,
    //   speed: 700,
    //   autoplay: true,
    //   autoplaySpeed: 2000,
    //   arrows: false,
    //   slidesToShow: 1,
    //   slidesToScroll: 1
    // });

    });
  };

  scrollerApi();


// Firebase Initializations
  var config = {
    apiKey: "AIzaSyDRpGzVh43wHxEAiH-I6commqUWlJe_Cb8",
    authDomain: "lostnfffound.firebaseapp.com",
    databaseURL: "https://lostnfffound.firebaseio.com",
    projectId: "lostnfffound",
    storageBucket: "lostnfffound.appspot.com",
    messagingSenderId: "375907715461"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#contact-form-button").on('click', function (){
    event.preventDefault();
    var inputFirst = $('#firstname');
    var inputLast = $('#lastname');
    var inputSubject = $('#subject');
    var firstName = inputFirst.val().trim();
    var lastName = inputLast.val().trim();
    var comment = inputSubject.val().trim();
    var inputFirstClear = inputFirst.hasClass('error-show');

    console.log(inputFirstClear)

    if(firstName.length < 2){
      inputFirst.addClass('error-show');
      inputFirst.closest('div').children('.error').css('display','block');
      inputFirstClear = false
    }
    else {
      inputFirst.removeClass('error-show');
      inputFirst.closest('div').children('.error').css('display','none');
      inputFirstClear = true;
    }

    if(lastName.length < 2){
      inputLast.addClass('error-show');
      inputLast.closest('div').children('.error').css('display','block');
      inputLastClear = false;
    }
    else {
      inputLast.removeClass('error-show');
      inputLast.closest('div').children('.error').css('display','none');
      inputLastClear = true;
    }

    if(comment.length < 5){
      inputSubject.addClass('error-show');
      inputSubject.closest('div').children('.error').css('display','block');
      inputSubjectClear = false;
    }
    else {
      inputSubject.removeClass('error-show');
      inputSubject.closest('div').children('.error').css('display','none');
      inputSubjectClear = true;
    }


    if(inputFirstClear && inputLastClear && inputSubjectClear) {
      database.ref().push({
        FirstName: firstName,
        LastName: lastName,
        CommentBody: comment
      });

      $('.error').css('display','none');

      inputFirst.val('');
      inputLast.val('');
      inputSubject.val('')
    }

  });

  database.ref().on('value', function(snapshot){
    trashValue = snapshot.numChildren();
    $('#trashcan').text(trashValue);
  });
});
