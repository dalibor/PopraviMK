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
P.UI.createOptionsMenu = function () {
  if (Ti.Platform.name == "android") {

    var activity = Ti.Android.currentActivity;
    var LOGIN = 1, LOGOUT = 2;

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

      // login menu item
      var loginMenuItem = menu.add({title: 'Најава', itemId: LOGIN});
      //loginMenuItem.setIcon("login.png"); // TODO: make icon
      loginMenuItem.addEventListener('click', function () {
        P.UI.openLoginWindow();
      });

      // logout menu item
      var logoutMenuItem = menu.add({title: 'Одјава', itemId: LOGOUT});
      //logoutMenuItem.setIcon("logout.png"); // TODO: make icon
      logoutMenuItem.addEventListener('click', function () {
        Ti.App.Properties.setString('cookie', '');
      });
    };

    activity.onPrepareOptionsMenu = function (e) {
      var menu = e.menu;
      var loggedIn = P.user.loggedIn();

      menu.findItem(LOGIN).setVisible(!loggedIn);
      menu.findItem(LOGOUT).setVisible(loggedIn);
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
};


P.UI.createMapView = function (data, options) {
  Titanium.UI.createWindow({
    url: '../windows/map.js',
    navBarHidden: true,
    params: P.utility.mergeHashes(data, options)
  }).open();
};

P.UI.geolocationProblem = function () {
  Titanium.UI.createAlertDialog({
    title: "Локација",
    message: "Се појави проблем при детектирање на локација. Ве молиме обидете се повторно."
  }).show();
};

P.UI.showMap = function (data) {
  if (P.config.virtualDevice) {
    P.UI.createMapView(data, {myLatitude: 42.038034, myLongitude: 21.46386})
  } else {
    Titanium.Geolocation.getCurrentPosition(function (e) {
      if (e.error) {
        P.UI.geolocationProblem();
      } else {
        P.UI.createMapView(data,
          {myLatitude: e.coords.latitude, myLongitude: e.coords.longitude})
      }
    });
  }
};

P.UI.buildProblemsTableData = function (problems) {
  var tableData = [];
  var timestamp = Date.now();

  for (var i = 0; i < problems.length; i++) {
    var problem = problems[i];

    var row = Titanium.UI.createTableViewRow({
      height: 'auto',
      leftImage: P.config.hostname + problem.photo_small,
      //layout: "vertical",
      backgroundColor: "#1B1C1E"
    });

    var municipalityLabel = Ti.UI.createLabel({
      top: 5, left: 70,
      height: 20,
      text: problem.municipality,
      color: '#FFF',
      font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'bold'}
    });

    var categoryLabel = Ti.UI.createLabel({
      top: 30, left: 70,
      height: 20,
      text: problem.category,
      color: '#AEAEB0',
      font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'bold'}
    });

    var dateLabel = Ti.UI.createLabel({
      top: 55, left: 70, bottom: 5,
      height: 20,
      text: P.time.time_ago_in_words_with_parsing(problem.created_at + ""),
      color: '#999',
      font: {fontFamily: 'Helvetica Neue', fontSize: 13, fontWeight: 'normal'}
    });

    // BUTTONS BEGIN
    var buttonsView = Ti.UI.createView({
      top: 5, right: 5,
      width: 75,
      layout: 'vertical'
    });

    var mapButton = Titanium.UI.createButton({
      height: 25, width: 75,
      title: "мапа",
      color: '#FFF',
      backgroundColor: "#3C3F46",
      font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'},
      data: {
        id: problem.id,
        url: problem.url,
        longitude: problem.longitude,
        latitude: problem.latitude,
        title: problem.category + " (" + problem.municipality + ")",
        description: problem.description,
        status: problem.status,
        photo: P.config.hostname + problem.photo_small
      }
    });
    buttonsView.add(mapButton);

    var showButton = Titanium.UI.createButton({
      top: 10,
      height: 25, width: 75,
      title: "детали",
      color: '#3C3F46',
      backgroundColor: "#FEB300",
      font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'},
      problem: problem
    });
    buttonsView.add(showButton);

    // button events
    mapButton.addEventListener("click", function (e) {
      P.UI.showMap(e.source.data);
    });
    showButton.addEventListener("click", function (e) {
      var showWindow = Titanium.UI.createWindow({
        url: 'problems_show.js',
        navBarHidden: true
      });
      showWindow.problem = e.source.problem;
      showWindow.open();
    });
    // BUTTONS END


    row.add(municipalityLabel);
    row.add(categoryLabel);
    row.add(dateLabel);
    row.add(buttonsView);

    //row.className = "item_" + timestamp + "_" + i; // hack
    row.className = 'problem'


    tableData.push(row);
  }

  return tableData;
};


P.UI.getTwitterDataRow = function (object, i) {
  var row = Titanium.UI.createTableViewRow({
    bottom: 5,
    height: 'auto',
    leftImage: object.profile_image_url,
    layout: "vertical"
  });

  var screenNameLabel = Ti.UI.createLabel({
    left: 57,
    height: 20,
    text: object.screen_name,
    color: '#FFF',
    font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'}
  });

  var commentLabel = Ti.UI.createLabel({
    top: 5, left: 57, right: 5,
    color: '#AEAEB0',
    font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'normal'},
    text: object.text
  });

  var dateLabel = Ti.UI.createLabel({
    top: 5, left: 57,
    height: 20,
    color: '#999',
    font: {fontFamily: 'Helvetica Neue', fontSize: 13, fontWeight: 'normal'},
    text: P.time.time_ago_in_words_with_parsing(object.created_at + "")
  });

  row.add(screenNameLabel);
  row.add(commentLabel);
  row.add(dateLabel);

  row.className = "item"
  //row.className = "item" + i; // hack
  return row;
};

P.UI.createColorPicker = function (elements, top, left) {
  var picker = Titanium.UI.createPicker({top: top, left: left});
  var data = [];

  for (var i = 0; i < elements.length; i++) {
    data[i] = Titanium.UI.createPickerRow({
      title: elements[i].title, 
      id: elements[i].id
    });
  }

  picker.add(data);

  return picker;
};

P.UI.connectionError = function () {
  Titanium.UI.createAlertDialog({
    title: "Интернет конекција", 
    message: "Не е пронајдена интернет конекција. Ве молиме проверете дали уредот е врзан на интернет."
  }).show();
};

P.UI.fieldsError = function () {
  Ti.UI.createAlertDialog({
    title: 'Недостасуваат податоци', 
    message: 'Ве молиме внесете опис за проблемот.'
  }).show();
};

P.UI.cameraError = function () {
  Ti.UI.createAlertDialog({
    title: 'Проблем со камера', 
    message: 'Уредот или нема камера или се појави проблем при зачувување на сликата.'
  }).show();
};

P.UI.locationError = function () {
  Titanium.UI.createAlertDialog({
    title: "Локација", 
    message: "Се појави проблем при детектирање на локација. Ве молиме обидете се повторно."
  }).show();
};

P.UI.generalError = function () {
  Ti.UI.createAlertDialog({
    title: 'Се појави грешка', 
    message: 'Се појави грешка ве молиме обидете се повторно.'
  }).show();
};

P.UI.serverError = function () {
  Ti.UI.createAlertDialog({
    title: 'Грешна на серверот', 
    message: 'Се појави грешка на серверот ве молиме обидете се повторно.'
  }).show();
};

P.UI.loginError = function (message) {
  Ti.UI.createAlertDialog({
    title: 'Проблем со најавување', 
    message: message
  }).show();
};

P.UI.xhrError = function () {
  Ti.UI.createAlertDialog({
    title: 'Неуспешно праќање', 
    message: 'Се јавија проблеми при испраќање. Ве молиме обидете се повторно.'
  }).show();
};

P.UI.noEmail = function () {
  Ti.UI.createAlertDialog({
    title: 'Недостасува email адреса', 
    message: 'Ве молиме поставете email адреса во Поставки за да ги листате вашите пријавени проблеми'
  }).show();
};

P.UI.invalidEmail = function () {
Ti.UI.createAlertDialog({
    title: 'Невалидна email адреса', 
    message: 'Форматот на внесената email адреса не е валиден.'
  }).show();
};

P.UI.openLoginWindow = function () {
  Ti.UI.createWindow({
    title: 'Најави се',
    url: '../windows/login.js',
    modal: true
  }).open();
};

