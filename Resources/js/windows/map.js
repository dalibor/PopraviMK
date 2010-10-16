Titanium.include('../helpers/shared.js');

var win = Titanium.UI.currentWindow;

var problemLocationAnnotation = Titanium.Map.createAnnotation({
  latitude: win.params.latitude,
  longitude: win.params.longitude,
  title: win.params.title,
  subtitle: win.params.subtitle,
  leftButton: win.params.photo,
  //rightButton: win.params.photo,
  //pincolor: Titanium.Map.ANNOTATION_RED,
  pinImage: "../../images/map/marker-red.png",
  animate: true,
  url: win.params.url   
});

var myLocationAnnotation = Titanium.Map.createAnnotation({latitude: win.params.myLatitude, longitude: win.params.myLongitude, 
  title: "Моја локација", pinImage: "../../images/map/marker-green.png", animate: true
});

var mapview = Titanium.Map.createView({mapType: Titanium.Map.SATELLITE_TYPE, animate: true, location: {}, regionFit: true, 
  annotations: [myLocationAnnotation, problemLocationAnnotation], userLocation: true
});
  
mapview.addEventListener('click', function (e) {
  if (e.clicksource == 'leftButton'){
    Ti.Platform.openURL(e.annotation.url);
  }
});

win.add(mapview);

mapview.location = {latitude: win.params.latitude, longitude: win.params.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02}

// Down menu
if(Ti.Platform.name == "android") {
  var menu = Ti.UI.Android.OptionMenu.createMenu();
  
  var myLocationItem = Ti.UI.Android.OptionMenu.createMenuItem({title : 'Моја локација'});
  myLocationItem.addEventListener('click', function () {
    mapview.location = {}; // hack to notice change on the location in the next step
    mapview.location = {latitude: win.params.myLatitude, longitude: win.params.myLongitude, latitudeDelta: 0.02, longitudeDelta: 0.02}
  });
  
  var problemLocationItem = Ti.UI.Android.OptionMenu.createMenuItem({title : 'Проблем лок.'});
  problemLocationItem.addEventListener('click', function () {
    mapview.location = {}; // hack to notice change on the location in the next step
    mapview.location = {latitude: win.params.latitude, longitude: win.params.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02}
  });
  
  var openRouteItem = Ti.UI.Android.OptionMenu.createMenuItem({title: 'Насоки'});
  openRouteItem.addEventListener('click', function () {
    Ti.Platform.openURL("http://maps.google.com/maps?saddr=" + win.params.myLatitude + "," + win.params.myLongitude + "&daddr=" + win.params.latitude + "," + win.params.longitude);
  });
  
  menu.add(myLocationItem);
  menu.add(problemLocationItem);
  menu.add(openRouteItem);
  Ti.UI.Android.OptionMenu.setMenu(menu); 
}
