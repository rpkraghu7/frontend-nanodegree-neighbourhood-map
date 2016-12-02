//initialising map object
var map;

//creating the markers array to store the markers created
var markers=[];

//timeout function for map if it fails to load
var mapFail = function(){
  alert("Sorry unable to load Google Map");
  $("#map").append('Hey sorry Failed to load the map');
}

//intialisation of the callback initMap() function
 function initMap() {
  map= new google.maps.Map(document.getElementById('map'),{
  center: {lat:13.0827 ,lng:80.2707 },
  zoom: 12});

// a location array to store the places to be displayed in the map
 var locations =[];

//iterating over the favPlace json object to get the location and titleof the places
 for ( var i=0 ; i< favPlace.length ;i++){
     var loc= {
      title : favPlace[i].name,
      location: {
       lat: favPlace[i].lat, lng: favPlace[i].lng
     }
   };
   locations.push(loc);
 }

 clearTimeout(mapFail);
//iterating over the loactions array to create markers on map
  for (var i=0 ; i<locations.length;i++){
   var position = locations[i].location;
   var title = locations[i].title;

   //marker object to set the marker in map
   var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
      markers.push(marker);

      //creating a object for the infowindow to popup on the marker
    var Infowindow = new google.maps.InfoWindow();

      //adding eventListener to marker to popup
    marker.addListener('click', function() {
            populateInfoWindow(this, Infowindow,contents[0]);
            toggleBounce(this);
          });

 }

//bounce animation function for markers to toggle the bounce
 function toggleBounce(marker) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){
            marker.setAnimation(null);
          },450);
      }

 //function to display particular info window when a list item is clicked
 displayInfo= function(name,content){
   for (var i=0;i<markers.length;i++){
     if(name === markers[i].title){
       var mark = markers[i];
       populateInfoWindow(markers[i],Infowindow,content);
       toggleBounce(mark);
     }
   }
 }

  //function to display the markers of shopping places and areas respectively
  filterMarker =function(num){
  for(var i=0;i<favPlace.length;i++){
    if(favPlace[i].filter === num){
      markers[i].setMap(map);
    }else{
      markers[i].setMap(null);
    }
  }
  }

  //function to display all markers on map
  filterAllMarker = function(){
    for(var i=0; i<favPlace.length;i++){
      markers[i].setMap(map);
    }
  }

} //end of initMap()


 // This function populates the infowindow when the marker is clicked. Which will only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker,infowindow,content) {
      // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>'+'<div>'+ content + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
          infowindow.setMarker(null);
          });
        }
     }
