Ti.include('../p.js');

var win = Ti.UI.currentWindow;

var problemLocationAnnotation = Ti.Map.createAnnotation({
  latitude: win.params.latitude,
  longitude: win.params.longitude,
  title: win.params.title,
  subtitle: win.params.description,
  leftButton: win.params.photo,
  //rightButton: win.params.photo,
  //pincolor: Ti.Map.ANNOTATION_RED,
  pinImage: "../../images/map/marker-red.png",
  animate: true,
  image: win.params.url
});

var myLocationAnnotation = Ti.Map.createAnnotation({
  title: "Моја локација",
  pinImage: "../../images/map/marker-green.png",
  latitude: win.params.myLatitude,
  longitude: win.params.myLongitude,
  animate: true
});

var mapview = Ti.Map.createView({
  mapType: Ti.Map.SATELLITE_TYPE,
  animate: true,
  location: {},
  regionFit: true,
  annotations: [myLocationAnnotation, problemLocationAnnotation],
  userLocation: true
});
mapview.addEventListener('click', function (e) {
  if (e.clicksource == 'leftButton') {
    Ti.Platform.openURL(e.annotation.url);
  }
});
win.add(mapview);

mapview.location = {
  latitude: win.params.latitude,
  longitude: win.params.longitude,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02
}

// Down menu
if (Ti.Platform.name == "android") {
  var activity = Ti.Android.currentActivity;

  activity.onCreateOptionsMenu = function (e) {
    var menu = e.menu;

    var myLocationItem = menu.add({title: 'Моја локација'});
    myLocationItem.addEventListener('click', function () {
      mapview.location = {}; // hack to notice change on the location in the next step
      mapview.location = {
        latitude: win.params.myLatitude,
        longitude: win.params.myLongitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      };
    });

    var problemLocationItem = menu.add({title: 'Проблем лок.'});
    problemLocationItem.addEventListener('click', function () {
      mapview.location = {}; // hack to notice change on the location in the next step
      mapview.location = {
        latitude: win.params.latitude,
        longitude: win.params.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      };
    });

    var openRouteItem = menu.add({title: 'Насоки'});
    openRouteItem.addEventListener('click', function () {
      var url = "http://maps.google.com/maps?saddr=" +
                win.params.myLatitude + "," + win.params.myLongitude +
                "&daddr=" + win.params.latitude + "," + win.params.longitude;
      Ti.Platform.openURL(url);
    });
  }
}
