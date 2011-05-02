P.geolocation = {};

P.geolocation.translateErrorCode = function (code) {
  if (code == null) {
    return null;
  }

  switch (code) {
    case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
      return "Непозната локација";
    case Ti.Geolocation.ERROR_DENIED:
      return "Забранет пристап до локација";
    case Ti.Geolocation.ERROR_NETWORK:
      return "Грешка при одредување на локација";
    case Ti.Geolocation.ERROR_HEADING_FAILURE:
      return "Грешка при одредување на насока";
    case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
      return "Забранет пристап до локација од регионов";
    case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
      return "Грешка при детектирање на локација од регионов";
    case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
      return "Одложен пристап до локација од регионов";
  }
};

P.geolocation.detect = function (callback) {
  if (P.config.virtualDevice) {
    // mock geo location for virtual device
    callback({longitude: 21.46385, latitude: 42.038033})
  } else {
    var lastTimestamp;
    var geolocationActive = true;

    Ti.Geolocation.preferredProvider = "gps";

    //
    //  SET ACCURACY - THE FOLLOWING VALUES ARE SUPPORTED
    //
    // Ti.Geolocation.ACCURACY_BEST
    // Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS
    // Ti.Geolocation.ACCURACY_HUNDRED_METERS
    // Ti.Geolocation.ACCURACY_KILOMETER
    // Ti.Geolocation.ACCURACY_THREE_KILOMETERS
    //
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;

    //
    //  SET DISTANCE FILTER. THIS DICTATES HOW OFTEN AN EVENT FIRES BASED 
    //  ON THE DISTANCE THE DEVICE MOVES. THIS VALUE IS IN METERS
    //
    Ti.Geolocation.distanceFilter = 1;

    var stopGeolocation = function () {
      geolocationActive = false;
      Ti.Geolocation.removeEventListener('location', geoLocationCallback);
    };

    var geoLocationCallback = function (e) {
      // refresh GPS location
      Ti.Geolocation.getCurrentPosition(function (e) {
        if (!e.success || e.error) {
          stopGeolocation();
          P.UI.locationError(P.geolocation.translateErrorCode(e.code));
        } else {
          if (lastTimestamp != e.coords.timestamp && geolocationActive) {
            stopGeolocation();
            callback(e.coords)
          }
        }
      });
    };

    // get latest GPS location
    Ti.Geolocation.getCurrentPosition(function (e) {
      if (!e.success || e.error) {
        P.UI.openLocationSettings(P.geolocation.translateErrorCode(e.code));
      } else {
        lastTimestamp = e.coords.timestamp;
        P.UI.flash('Пронаоѓам локација...');
      }
    });

    Ti.Geolocation.addEventListener('location', geoLocationCallback);
  }
};
