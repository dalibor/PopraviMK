P.UI = {};

P.UI.flash = function (message) {
  var messageWin = Ti.UI.createWindow({
    bottom: 70,
    height: 40, width: 250,
    borderRadius: 10,
    touchEnabled: false
  });

  var messageView = Ti.UI.createView({
    height: 40, width: 250,
    borderRadius: 10,
    backgroundColor: '#1B1C1E',
    opacity: 0.9,
    touchEnabled: false
  });

  var messageLabel = Ti.UI.createLabel({
    width: 250, height: 'auto', 
    text: message, 
    color: '#fff', 
    font: {fontFamily: 'Helvetica Neue', fontSize: 13}, 
    textAlign: 'center'
  });

  messageWin.add(messageView);
  messageWin.add(messageLabel);
  messageWin.open();

  setTimeout(function () { 
    messageWin.close({
      opacity: 0,
      duration: 500
    });
  }, 3000);
};

/*
 * Builds down menu for main tabs in the application
 */
P.UI.buildMenu = function () {
  if (Ti.Platform.name == "android") {

    var activity = Ti.Android.currentActivity;

    activity.onCreateOptionsMenu = function (e) {
      var menu = e.menu;

      // setting menu item
      var settingsMenuItem = menu.add({title: 'Поставки'});
      settingsMenuItem.addEventListener('click', function () {
        Ti.UI.createWindow({
          title: 'Поставки за PopraviMK', 
          url: '../windows/settings.js', 
          modal: true
        }).open();
      });

      // disclaimer menu item
      var disclaimerMenuItem = menu.add({title: 'Услови'});
      disclaimerMenuItem.addEventListener('click', function () {
        Ti.UI.createWindow({
          title: 'Услови за користење на PopraviMK', 
          url: '../windows/terms.js', 
          modal: true
        }).open();
      });
      
      // about menu item
      var aboutMenuItem = menu.add({title: 'Инфо'});
      aboutMenuItem.addEventListener('click', function () {
        Ti.UI.createWindow({
          title: 'За PopraviMK', 
          url: '../windows/about.js', 
          modal: true
        }).open();
      });
    };
  };
};

P.UI.requirements = function () {
  var errors = [];
  
  if (!Ti.Network.online) {
    errors.push("интернет конекција");
  }
  
  if (!Ti.Geolocation.locationServicesEnabled) {
    errors.push("гео лоцирање");
  }
  
  if (errors.length) {
    Ti.UI.createAlertDialog({
      title: 'Информација', 
      message: 'За користење на PopraviMK потребно е да вклучите: ' + errors.join(', ')
    }).show();
  }
  
  if (!Ti.App.Properties.getString("email") && !Ti.App.Properties.getString("anonymous")) {
    Ti.UI.createWindow({
      title: 'Поставки', 
      url: '../windows/welcome.js'
    }).open();
  } 
};
