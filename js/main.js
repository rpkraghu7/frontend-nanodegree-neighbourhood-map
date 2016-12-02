//json object for my favourite locations
var favPlace=[
  {
    name: 'Marina Beach',
    wikiName: 'Marina Beach',
    lat: 13.0500,
    lng: 80.2824,
    filter:0
  },{
    name: 'Forum Vijaya Mall,Chennai',
    wikiName: 'The Forum Vijaya',
    lat: 13.0490,
    lng: 80.2080,
    filter:0
  },{
    name: 'Besant Nagar',
    wikiName: 'Besant Nagar',
    lat: 13.0002,
    lng: 80.2668,
    filter:1
  },{
    name: 'Guindy',
    wikiName: 'Guindy',
    lat: 13.0084125,
    lng: 80.2126875,
    filter:1
  },{
    name: 'Anna Salai',
    wikiName:'Anna Salai',
    lat: 13.064369,
    lng: 80.265808,
    filter:1
  }
]


//Array to store the response from wikipedia API
var contents =[];


//Place constructor for the array of favPlace
var Place = function(data){
  var self = this;
  this.name=ko.observable(data.name);
  this.wikiName=ko.observable(data.wikiName);
  this.lat=ko.observable(data.lat);
  this.lng=ko.observable(data.lng);
  this.filter=ko.observable(data.filter);

  //array to store the content of the place received from wikipedia
  this.wikiInfo=ko.observableArray([]);

  //computed function to get the response from wikipedia about the places
  this.wiki =ko.computed( function() {
    var city= self.wikiName();
    var wikiFail= setTimeout(function(){
      self.wikiInfo.push("Failed to load wikipedia links");

      // to display the alert only once
      var alert1 = localStorage.getItem('alert1') ||'';
      if(alert1 !== 'displayed'){
        alert("Failed to load wikipedia links");
        self.wikiInfo.push("Failed to load wikipedia links");
        localStorage.setItem('alert1','displayed');
      }
    },8000); //Timeout function for Wikipedia

    var wikiUrl= 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';

    //Ajax function to get the response from wikipedia
    $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
    }).done(function(response){
     var articles =response[2];
       self.wikiInfo.push(articles);
        contents.push(articles);
    clearTimeout(wikiFail);
    });
  })
}


//ViewModel function for the application
var viewModel = function(){
  var self= this;
  localStorage.removeItem('alert1');
  this.places = ko.observableArray([]);
  this.placeList=ko.observableArray([]);

  favPlace.forEach(function(fav){
    var place = new Place(fav);
    self.places.push(place);
    self.placeList.push(place);
  });

  this.filterList =ko.observableArray([]);
  //function to display the information on button click
  this.displayMarker = function(item){
    //console.log(item);
    var name=item.name();
    var content=item.wikiInfo()[0];
    displayInfo(name,content);
   }

  //variable with class of drop-down
  this.dropItem = ko.observable('dropdown-box')

  //count for displaying dropdown for filter
  this.count = ko.observable(0);

  //function for the dropdown menu to appear
  this.drop = function(item){
     if(self.count()===0){
       self.dropItem('dropdown-box'+' '+'show');
       self.count(1);
     }else{
       self.dropItem('dropdown-box');
      self.count(0);
     }
   }

  this.list=ko.observable('');
  this.count1 =ko.observable(0);

  //function to display the list in responsive window
  this.displayMenu = function(){
    if(self.count1() ===0){
      self.list('fulllist');
      self.count1(1);
    }else{
      self.list('');
      self.count1(0);
    }
  }

  //function to display shop locations when selected on the site
  this.displayShoopingLocations = function(item){
    var place = item.places();
    self.placeList(['']);

    for(var i=0;i<place.length;i++){
      if(place[i].filter()===0){
        self.placeList.push(place[i]);
          var num =place[i].filter();
        filterMarker(num);
      }
    }
  }

    //function to display Area name when selected on the site
  this.displayArea = function(item){
    var place = item.places();
    self.placeList(['']);

    for(var i=0;i<place.length;i++){
        if(place[i].filter()===1){
          self.placeList.push(place[i]);
          var num =place[i].filter();
          filterMarker(num);
        }
      }
    }

    //function to display all places when selected on site
    this.displayAll= function(item){
      var place = item.places();
      self.placeList(['']);

      for(var i=0;i<place.length;i++){
        self.placeList.push(place[i]);
          var num =place[i].filter();
          filterAllMarker(num);
        }
    }

} //end of viewModel

//initialising the bindings function
ko.applyBindings(new viewModel);
