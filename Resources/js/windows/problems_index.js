Ti.include('../p.js');

var colorMenuActive = '#FFFFFF';
var colorMenu = '#8C8C8C';
var windowBackgroundColor = '#3F3F3F';
var win = Titanium.UI.currentWindow;
win.setBackgroundColor(windowBackgroundColor);

var openMapView = function (data, options) {
  var mapWindow = Titanium.UI.createWindow({url: 'map.js', navBarHidden: true});
  var params = P.utility.mergeHashes(data, options)
  //Titanium.UI.createAlertDialog({title: "Локација", message: JSON.stringify(params)}).show();
  mapWindow.params = params;
  mapWindow.open();
}

var prepareMapView = function (data) {
  if (P.config.virtualDevice) {
    openMapView(data, {myLatitude: 42.038034, myLongitude: 21.46386})
  } else {
    Titanium.Geolocation.getCurrentPosition(function (e) {
      if (e.error) {
        Titanium.UI.createAlertDialog({title: "Локација", message: "Се појави проблем при детектирање на локација. Ве молиме обидете се повторно."}).show();
      } else {
        openMapView(data, {myLatitude: e.coords.latitude, myLongitude: e.coords.longitude})
      }
    });
  }
}

var buildProblemsTableData = function (problems) {
  var rowData = [];
  var timestamp = Date.now();
  
  for (var i = 0; i < problems.length; i++) {
    var problem = problems[i];
    
    var row = Titanium.UI.createTableViewRow({height: 'auto'});
    var post_view = Titanium.UI.createView({height: 'auto', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#1B1C1E"});
    
    var photoView = Titanium.UI.createImageView({url: hostname + problem.photo_small, top: 4, left: 4, width: 60, height: 60});
    post_view.add(photoView);

    var contentView = Ti.UI.createView({height: 'auto', layout: 'vertical', top: 0, left: 70});

    var municipalityLabel = Ti.UI.createLabel({color: '#FFF', font: {fontSize: 14, fontWeight: 'bold'}, height: 'auto', left: 0, text: problem.municipality});
    contentView.add(municipalityLabel);
    
    var categoryLabel = Ti.UI.createLabel({color: '#AEAEB0', font: {fontSize: 14,fontWeight: 'bold'}, height: 'auto', left: 0, text: problem.category});
    contentView.add(categoryLabel);
    
    var date = Ti.UI.createLabel({color: '#999', font: {fontSize: 13,fontWeight: 'normal'}, height: 'auto', left: 0, text: P.time.time_ago_in_words_with_parsing(problem.created_at+"")});
    contentView.add(date);
    
    var buttonsView = Ti.UI.createView({height: 'auto', top: 5, right: 10, width: 200, height: 30});

    var mapButton = Titanium.UI.createButton({color: '#FFF', backgroundColor: "#3C3F46", title: "мапа", 
      font: {fontSize: 18, fontWeight: 'bold'}, right: 95, width: 70, bottom: 5, height: 25,
      data: {id: problem.id, url: problem.url, longitude: problem.longitude, latitude: problem.latitude, title: problem.category + " (" + problem.municipality + ")", subtitle: problem.description, photo: hostname + problem.photo_small}
    });
    mapButton.addEventListener("click", function (e) {
      prepareMapView(e.source.data);
    });
    buttonsView.add(mapButton);

    var showButton = Titanium.UI.createButton({color: '#3C3F46', backgroundColor: "#FEB300", title: "повеќе", 
      font: {fontSize: 18, fontWeight: 'bold'}, right: 5, width: 85, bottom: 5, height: 25,
      data: {id: problem.id, url: problem.url, longitude: problem.longitude, latitude: problem.latitude, title: problem.category + " (" + problem.municipality + ")", subtitle: problem.description, photo: hostname + problem.photo_medium}
    });
    showButton.addEventListener("click", function (e) {
      var showWindow = Titanium.UI.createWindow({url: 'problems_show.js', navBarHidden: true});
      showWindow.params = e.source.data
      showWindow.open()
    });
    buttonsView.add(showButton);
    
    contentView.add(buttonsView);
    
    post_view.add(contentView)
    row.add(post_view);

    row.className = "item_" + timestamp + "_" + i;

    rowData[i] = row;
  }
  
  return rowData
}


/*
 * Gets latest problems from the API
 */
var getLatestProblems = function () {
  P.http.getJSON(P.config.apiEndpoint + '/problems.json?type=latest', function (json) {
    latestProblemsTable.initialized = true;
    var data = buildProblemsTableData(json);
    latestProblemsTable.setData = data;
    latestProblemsTable.data = data;
  });
}

/*
 * Gets nearest problems from the API
 */
var getNearestProblems = function () {
  if (P.config.virtualDevice) {
    P.http.getJSON(P.config.apiEndpoint + '/problems.json?type=nearest&longitude=' + 21.46385 + "&latitude=" + 42.038033, function (json) {
      nearestProblemsTable.initialized = true;
      var data = buildProblemsTableData(json);
      nearestProblemsTable.setData = data;
      nearestProblemsTable.data = data;
    });  
  }
  else {
    Titanium.Geolocation.getCurrentPosition(function (e) {
      if (e.error) {
        Titanium.UI.createAlertDialog({title: "Локација", message: "Се појави проблем при детектирање на локација. Ве молиме обидете се повторно."}).show();
      } else {
        var latitude = e.coords.latitude;
        var longitude = e.coords.longitude;
        P.http.getJSON(P.config.apiEndpoint + '/problems.json?type=nearest&longitude=' + longitude + "&latitude=" + latitude, function (json) {
          nearestProblemsTable.initialized = true;
          var data = buildProblemsTableData(json);
          nearestProblemsTable.setData = data;
          nearestProblemsTable.data = data;
        });       
      }
    });
  }
}

/*
 * Gets my problems from the API
 */
var getMyProblems = function () {
  P.http.getJSON(P.config.apiEndpoint + '/problems.json?type=my&device_id=' + Ti.Platform.id, function (json) {
    myProblemsTable.initialized = true;
    var data = buildProblemsTableData(json);
    myProblemsTable.setData = data;
    myProblemsTable.data = data;
  });
}

/*
 * Show latest problems tab
 */
var showLatestProblems = function () {
  nearestProblemsTable.visible = false;
  myProblemsTable.visible = false;
  latestProblemsTable.visible = true;
  nearestProblemsLabel.color = colorMenu;
  myProblemsLabel.color = colorMenu;
  latestProblemsLabel.color = colorMenuActive;
  
  if (!latestProblemsTable.initialized) {
    getLatestProblems();
  }
}

/*
 * Show nearest problems tab
 */
var showNearestProblems = function () {
  nearestProblemsTable.visible = true;
  myProblemsTable.visible = false;
  latestProblemsTable.visible = false;
  nearestProblemsLabel.color = colorMenuActive;
  myProblemsLabel.color = colorMenu;
  latestProblemsLabel.color = colorMenu;
  
  if (!nearestProblemsTable.initialized) {
    getNearestProblems()
  }
}

/*
 * Show problems tab
 */
var showMyProblems = function () {
  nearestProblemsTable.visible = false;
  myProblemsTable.visible = true;
  latestProblemsTable.visible = false;
  nearestProblemsLabel.color = colorMenu;
  myProblemsLabel.color = colorMenuActive;
  latestProblemsLabel.color = colorMenu;
  
  if (!myProblemsTable.initialized) {
    getMyProblems();
  }
}

var refreshProblems = function () {
  if (latestProblemsTable.visible) {
    getLatestProblems();
    return;
  }
  if (nearestProblemsTable.visible) {
    getNearestProblems();
    return;
  }
  if (myProblemsTable.visible) {
    getMyProblems();
    return;
  }
}

// Build header
var header = Ti.UI.createView({height: 30, top: 0}); 

var nearestProblemsLabel = Titanium.UI.createLabel({textAlign: 'center', text: 'НАЈБЛИСКИ', color: colorMenuActive, font: {fontSize: 14}, left: 5, top: 5, height: 20, width: 80 });
nearestProblemsLabel.addEventListener("click", function (e) {
  showNearestProblems();
});
header.add(nearestProblemsLabel);

var myProblemsLabel = Titanium.UI.createLabel({textAlign: 'center', text: 'МОИ', color: colorMenu, font: {fontSize: 14}, left: 90, top: 5, height: 20, width: 80 });
myProblemsLabel.addEventListener("click", function (e) {
  showMyProblems();
});
header.add(myProblemsLabel);

var latestProblemsLabel = Titanium.UI.createLabel({textAlign: 'center', text: 'ПОСЛЕДНИ', color: colorMenu, font: {fontSize: 14}, left: 175, top: 5, height: 20, width: 80 });
latestProblemsLabel.addEventListener("click", function (e) {
  showLatestProblems();
});
header.add(latestProblemsLabel);

var refreshImageView = Titanium.UI.createImageView({url: '../../images/icons/refresh.png', width: 16, height: 16, top: 8, right: 10});
refreshImageView.addEventListener("click", function (e) {
  refreshProblems();
});
header.add(refreshImageView);

win.add(header);  

nearestProblemsTable = Titanium.UI.createTableView({data: [], backgroundColor: windowBackgroundColor, top: 30, visible: true, initialized: false});
win.add(nearestProblemsTable);

myProblemsTable = Titanium.UI.createTableView({data: [], backgroundColor: windowBackgroundColor, top: 30, visible: false, initialized: false});
win.add(myProblemsTable);

latestProblemsTable = Titanium.UI.createTableView({data: [], backgroundColor: windowBackgroundColor, top: 30, visible: false, initialized: false});
win.add(latestProblemsTable);

getNearestProblems();

P.UI.buildMenu();
