var hideIndicator = function (indicator) {
  setTimeout(function () {
    if (indicator) {
      indicator.hide();      
    }
  }, 500);
};

var checkRequirements = function () {
  var errors = []
  
  if (!Titanium.Network.online) {
    errors.push("интернет конекција")
  }
  
  if (!Titanium.Geolocation.locationServicesEnabled) {
    errors.push("гео лоцирање");
  }
  
  if (errors.length) {
    Titanium.UI.createAlertDialog({title: 'Информација', message: 'За користење на PopraviMK потребно е да вклучите: ' + errors.join(', ')}).show();    
  }
  
  if (!Titanium.App.Properties.getString("email") && !Titanium.App.Properties.getString("anonymous")) {
    var settingsWindow = Titanium.UI.createWindow({title: 'Поставки', url: '../windows/welcome.js'});
    settingsWindow.open()
  } 
};

var problemsLoadingIndicator = Titanium.UI.createActivityIndicator({message: 'Вчитувам'});

var getJSON = function (url, callback) {
  if (Titanium.Network.online == false) {
    Titanium.UI.createAlertDialog({title: "Интернет конекција", message: "Не е пронајдена интернет конекција. Ве молиме проверете дали уредот е врзан на интернет."}).show();
  } else {
    //refreshImageView.visible = true;
    problemsLoadingIndicator.show();
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onload = function () {
      //refreshImageView.visible = false;
      hideIndicator(problemsLoadingIndicator);
      var json = JSON.parse(this.responseText);
      callback(json);
    };
    xhr.onerror = function () {
      //refreshImageView.visible = false;
      hideIndicator(problemsLoadingIndicator);
      Ti.UI.createAlertDialog({title: 'Неуспешна конекција до серверот', message: 'Се јави проблем при поврзување со серверот. Ве молиме обидете се подоцна.'}).show();
    };
    xhr.open('GET', url);
    xhr.send();
  }
};

var flash = function (message) {
  var messageWin = Titanium.UI.createWindow({height: 40, width: 250, bottom: 70, borderRadius: 10, touchEnabled: false});
  var messageView = Titanium.UI.createView({height: 40, width: 250, borderRadius: 10, backgroundColor: '#1B1C1E', opacity: 0.9, touchEnabled: false});
  var messageLabel = Titanium.UI.createLabel({text: message, color: '#fff', width: 250, height: 'auto', font:{fontFamily: 'Helvetica Neue', fontSize: 13}, textAlign: 'center'});
  messageWin.add(messageView);
  messageWin.add(messageLabel);
  
  messageWin.open();
  setTimeout(function () { messageWin.close({opacity: 0,duration: 500});}, 3000);
};

/*
 * Builds down menu for main tabs in the application
 */
var buildDownMenu = function () {
  
  if(Ti.Platform.name == "android") {
    var menu = Ti.UI.Android.OptionMenu.createMenu();
    var settingsMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({title: 'Поставки'});
    settingsMenuItem.addEventListener('click', function () {
      var settingsWindow = Titanium.UI.createWindow({title: 'Поставки за PopraviMK', url: '../windows/settings.js', modal: true});
      settingsWindow.open()
    });
    
    var disclaimerMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({title: 'Услови'});
    disclaimerMenuItem.addEventListener('click', function () {
      var disclaimerWindow = Titanium.UI.createWindow({title: 'Услови за користење на PopraviMK', url: '../windows/terms.js', modal: true});
      disclaimerWindow.open()
    });
    
    var aboutMenuItem = Ti.UI.Android.OptionMenu.createMenuItem({title: 'Инфо'});
    aboutMenuItem.addEventListener('click', function () {
      var disclaimerWindow = Titanium.UI.createWindow({title: 'За PopraviMK', url: '../windows/about.js', modal: true});
      disclaimerWindow.open()
    });
    
    menu.add(settingsMenuItem);
    menu.add(disclaimerMenuItem);
    menu.add(aboutMenuItem);
    Ti.UI.Android.OptionMenu.setMenu(menu); 
  }
};

/*
 * Merges hashes
 */
var merge_hash = function (destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

var DateHelper = {
  // Takes the format of "Jan 15, 2007 15:45:00 GMT" and converts it to a relative time
  // Ruby strftime: %b %d, %Y %H:%M:%S GMT
  time_ago_in_words_with_parsing: function (from) {
    var date = new Date; 
    date.setTime(Date.parse(from));
    return this.time_ago_in_words(date);
  },
  
  time_ago_in_words: function (from) {
    return this.distance_of_time_in_words(new Date, from);
  },
 
  distance_of_time_in_words: function (to, from) {
    var distance_in_seconds = ((to - from) / 1000);
    var distance_in_minutes = Math.floor(distance_in_seconds / 60);
 
    if (distance_in_minutes == 0) { return 'пред помалку од минута'; }
    if (distance_in_minutes == 1) { return 'пред минута'; }
    if (distance_in_minutes < 45) { return 'пред ' + distance_in_minutes + ' минути'; }
    if (distance_in_minutes < 90) { return 'пред 1 час'; }
    if (distance_in_minutes < 1440) { return 'пред ' + Math.floor(distance_in_minutes / 60) + ' часа'; }
    if (distance_in_minutes < 2880) { return 'пред 1 ден'; }
    if (distance_in_minutes < 43200) { return 'пред ' + Math.floor(distance_in_minutes / 1440) + ' дена'; }
    if (distance_in_minutes < 86400) { return 'пред 1 месец'; }
    if (distance_in_minutes < 525960) { return 'пред ' + Math.floor(distance_in_minutes / 43200) + ' месеци'; }
    if (distance_in_minutes < 1051199) { return 'пред 1 година'; }

    return 'пред ' + (distance_in_minutes / 525960).floor() + ' години';
  }
};

/**
 * Synchronizes categories with the server
 * 
 * @param {Function} callback
 */
var syncCategories = function (callback) {
  getJSON(apiEndpoint + '/categories.json', function (categories) {
    if (categories.length) {
      db.execute('DELETE FROM categories;') // remove old categories
      
      // insert new categories
      for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        db.execute('INSERT INTO "categories" ("web_id", "name") VALUES (' + category.id + ',"' + category.name + '");')
      }
      
      callback();             
    }
  });           
}

/**
 * Synchronizes municipalities with the server
 * 
 * @param {Object} callback
 */
var syncMunicipalities = function (callback) {
  getJSON(apiEndpoint + '/municipalities.json', function (municipalities) {
    if (municipalities.length) {
      db.execute('DELETE FROM municipalities;') // remove old municipalities
      
      // insert new municipalities
      for (var i = 0; i < municipalities.length; i++) {
        var municipality = municipalities[i];
        db.execute('INSERT INTO "municipalities" ("web_id", "name") VALUES (' + municipality.id + ',"' + municipality.name + '");')
      }
      
      callback();
    }
  });           
}
