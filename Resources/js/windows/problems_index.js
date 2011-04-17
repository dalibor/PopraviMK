Ti.include('../p.js');

var colorMenuActive = '#FFFFFF';
var colorMenu = '#8C8C8C';
var windowBackgroundColor = '#3F3F3F';
var win = Titanium.UI.currentWindow;
win.setBackgroundColor(windowBackgroundColor);


var showNearestProblemsTable = function () {
  P.http.getNearestProblems(function (problems) {
    nearestProblemsTable.setData(P.UI.buildProblemsTableData(problems));
    nearestProblemsTable.initialized = true;
  });
};
var showLatestProblemsTable = function () {
  P.http.getLatestProblems(function (problems) {
    latestProblemsTable.setData(P.UI.buildProblemsTableData(problems));
    latestProblemsTable.initialized = true;
  });
};
var showMyProblemsTable = function () {

  if (!P.user.email()) {
    P.UI.noEmail();
  } else {
    P.http.getMyProblems(function (problems) {
      myProblemsTable.setData(P.UI.buildProblemsTableData(problems));
      myProblemsTable.initialized = true;
    });
  }
};



// BODY BEGIN
var nearestProblemsTable = Titanium.UI.createTableView({
  top: 30,
  data: [],
  backgroundColor: windowBackgroundColor,
  visible: false,
  initialized: false
});
win.add(nearestProblemsTable);

var myProblemsTable = Titanium.UI.createTableView({
  top: 30,
  data: [],
  backgroundColor: windowBackgroundColor,
  visible: false,
  initialized: false
});
win.add(myProblemsTable);

var latestProblemsTable = Titanium.UI.createTableView({
  top: 30,
  data: [],
  backgroundColor: windowBackgroundColor,
  visible: false,
  initialized: false
});
win.add(latestProblemsTable);
// BODY END


// HEADER BEGIN
var header = Ti.UI.createView({
  top: 0,
  height: 30
});

var latestProblemsLabel = Titanium.UI.createLabel({
  left: 5, top: 5,
  height: 20, width: 80,
  text: 'ПОСЛЕДНИ',
  textAlign: 'center',
  color: colorMenu,
  font: {fontSize: 14}
});
header.add(latestProblemsLabel);
var nearestProblemsLabel = Titanium.UI.createLabel({
  left: 120, top: 5,
  height: 20, width: 80,
  text: 'НАЈБЛИСКИ',
  textAlign: 'center',
  color: colorMenuActive,
  font: {fontSize: 14}
});
header.add(nearestProblemsLabel);
var myProblemsLabel = Titanium.UI.createLabel({
  left: 210, top: 5,
  height: 20, width: 80,
  text: 'МОИ',
  textAlign: 'center',
  color: colorMenu,
  font: {fontSize: 14}
});
header.add(myProblemsLabel);
var refreshImageView = Titanium.UI.createImageView({
  top: 8, right: 10,
  width: 16, height: 16,
  url: '../../images/icons/refresh.png'
});
header.add(refreshImageView);

// header events
nearestProblemsLabel.addEventListener("click", function (e) {
  nearestProblemsTable.visible = true;
  myProblemsTable.visible = false;
  latestProblemsTable.visible = false;
  nearestProblemsLabel.color = colorMenuActive;
  myProblemsLabel.color = colorMenu;
  latestProblemsLabel.color = colorMenu;

  if (!nearestProblemsTable.initialized) {
    showNearestProblemsTable();
  }
});
myProblemsLabel.addEventListener("click", function (e) {
  nearestProblemsTable.visible = false;
  myProblemsTable.visible = true;
  latestProblemsTable.visible = false;
  nearestProblemsLabel.color = colorMenu;
  myProblemsLabel.color = colorMenuActive;
  latestProblemsLabel.color = colorMenu;

  if (!myProblemsTable.initialized) {
    showMyProblemsTable();
  }
});
latestProblemsLabel.addEventListener("click", function (e) {
  nearestProblemsTable.visible = false;
  myProblemsTable.visible = false;
  latestProblemsTable.visible = true;
  nearestProblemsLabel.color = colorMenu;
  myProblemsLabel.color = colorMenu;
  latestProblemsLabel.color = colorMenuActive;

  if (!latestProblemsTable.initialized) {
    showLatestProblemsTable();
  }
});
refreshImageView.addEventListener("click", function (e) {
  if (latestProblemsTable.visible) {
    showLatestProblemsTable();
  } else if (nearestProblemsTable.visible) {
    showNearestProblemsTable();
  } else if (myProblemsTable.visible) {
    showMyProblemsTable();
  }
});

win.add(header);
// HEADER END

latestProblemsLabel.fireEvent("click");
P.UI.createOptionsMenu();
