Ti.include('../p.js');

var colorMenuActive = '#FFFFFF';
var colorMenu = '#8C8C8C';
var windowBackgroundColor = '#3F3F3F';
var win = Titanium.UI.currentWindow;
win.setBackgroundColor(windowBackgroundColor);

// FUNCTIONS BEGIN
var createMapView = function (data, options) {
  Titanium.UI.createWindow({
    url: '/js/windows/map.js',
    navBarHidden: true,
    params: P.utility.mergeHashes(data, options)
  }).open();
};

var showMap = function (data) {
  P.geolocation.detect(function (coords) {
    createMapView(data, {myLatitude: coords.latitude, myLongitude: coords.longitude})
  });
};

var buildProblemsTableData = function (problems) {
  var tableData = [];

  for (var i = 0; i < problems.length; i++) {
    var problem = problems[i];

    var row = Titanium.UI.createTableViewRow({
      height: 'auto',
      leftImage: P.config.hostname + problem.photo_small,
      className: 'problem',
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
      showMap(e.source.data);
    });
    showButton.addEventListener("click", function (e) {
      var showWindow = Titanium.UI.createWindow({
        url: '/js/windows/problems_show.js',
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

    tableData.push(row);
  }

  return tableData;
};
// FUNCTIONS END


// BODY BEGIN
var nearestProblemsTable = Titanium.UI.createTableView({
  data: [],
  backgroundColor: windowBackgroundColor,
  visible: false,
});
win.add(nearestProblemsTable);

var latestProblemsTable = Titanium.UI.createTableView({
  data: [],
  backgroundColor: windowBackgroundColor,
  visible: false,
});
win.add(latestProblemsTable);

var myProblemsTable = Titanium.UI.createTableView({
  data: [],
  backgroundColor: windowBackgroundColor,
  visible: false,
});
win.add(myProblemsTable);

var noProblemsLabel = Ti.UI.createLabel({
  text: "Нема проблеми",
  color: '#AEAEB0',
  font: {fontSize: 14, fontWeight: 'normal'},
  visible: false
});
win.add(noProblemsLabel);
// BODY END

var resetViews = function () {
  noProblemsLabel.hide();
  nearestProblemsTable.hide();
  latestProblemsTable.hide();
  myProblemsTable.hide();

  // remove Data from tables
  nearestProblemsTable.setData([]);
  latestProblemsTable.setData([]);
  myProblemsTable.setData([]);
};

// EVENTS BEGIN
Ti.App.addEventListener('show_latest_problems', function (data) {
  resetViews();
  P.http.getLatestProblems(function (problems) {
    if (problems.length) {
      latestProblemsTable.setData(buildProblemsTableData(problems));
      latestProblemsTable.show();
    } else {
      latestProblemsTable.show();
    }
  });
});

Ti.App.addEventListener('show_nearest_problems', function (data) {
  resetViews();
  P.http.getNearestProblems(function (problems) {
    if (problems.length) {
      nearestProblemsTable.setData(buildProblemsTableData(problems));
      nearestProblemsTable.show();
    } else {
      noProblemsLabel.show();
    }
  });
});

Ti.App.addEventListener('show_my_problems', function (data) {
  resetViews();
  if (!Titanium.App.Properties.getString('email')) {
    Ti.UI.createWindow({
      title: 'Поставки',
      url: '/js/windows/settings.js',
      modal: true
    }).open();
    P.UI.flash('Ве молиме внесете ја вашата email адреса за листање на вашите пријавени проблеми');
  } else {
    P.http.getMyProblems(function (problems) {
      if (problems.length) {
        myProblemsTable.setData(buildProblemsTableData(problems));
        myProblemsTable.show();
      } else {
        noProblemsLabel.show();
      }
    });
  }
});
// EVENTS END


Ti.App.fireEvent('show_latest_problems');


// OPTIONS MENU BEGIN
var activity = Ti.Android.currentActivity;
var LOGIN = 1, LOGOUT = 2;

activity.onCreateOptionsMenu = function (e) {
  var menu = e.menu;

  var latestProblemsMenuItem = menu.add({title: 'Последни'});
  latestProblemsMenuItem.addEventListener('click', function () {
    Ti.App.fireEvent('show_latest_problems');
  });

  var nearestProblemsMenuItem = menu.add({title: 'Најблиски'});
  nearestProblemsMenuItem.addEventListener('click', function () {
    Ti.App.fireEvent('show_nearest_problems');
  });

  var myProblemsMenuItem = menu.add({title: 'Мои'});
  myProblemsMenuItem.addEventListener('click', function () {
    Ti.App.fireEvent('show_my_problems');
  });

  // login menu item
  var loginMenuItem = menu.add({title: 'Најава', itemId: LOGIN});
  loginMenuItem.addEventListener('click', function () {
    P.UI.openLoginWindow();
  });

  // logout menu item
  var logoutMenuItem = menu.add({title: 'Одјава', itemId: LOGOUT});
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
// OPTIONS MENU END
