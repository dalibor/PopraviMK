Ti.include('../p.js');

var colorMenuActive = '#FFFFFF';
var colorMenu = '#8C8C8C';
var windowBackgroundColor = '#3F3F3F';
var win = Titanium.UI.currentWindow;
win.setBackgroundColor(windowBackgroundColor);

// FUNCTIONS BEGIN

var buildProblemsTableData = function () {
  var tableData = [];
  var i = 0;


  var dbProblems = P.db.connection.execute('SELECT * FROM problems;');

  while (dbProblems.isValidRow()) {
    var params = P.db.getProblemParams(dbProblems);

    if (params.imagePath !== 'undefined') {
      var imagePath = params.imagePath;
    } else {
      var imagePath = '../../images/icons/camera.png';
    }

    var row = Titanium.UI.createTableViewRow({
      height: 'auto',
      className: 'problem',
      backgroundColor: "#1B1C1E"
    });

    var leftImage = Ti.UI.createImageView({
      left: 5, top: 5,
      height: 48, width: 48,
      url: imagePath
    })

    var municipalityLabel = Ti.UI.createLabel({
      top: 5, left: 70,
      height: 20,
      text: P.db.getMunicipalityName(params.municipality_id),
      color: '#FFF',
      font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'bold'}
    });

    var categoryLabel = Ti.UI.createLabel({
      top: 30, left: 70,
      height: 20,
      text: P.db.getCategoryName(params.category_id),
      color: '#AEAEB0',
      font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'bold'}
    });

    var descriptionLabel = Ti.UI.createLabel({
      top: 55, left: 70,
      height: 20,
      text: params.description,
      color: '#AEAEB0',
      font: {fontFamily: 'Helvetica Neue', fontSize: 14}
    });

    // BUTTONS BEGIN
    var buttonsView = Ti.UI.createView({
      top: 80, left: 10, bottom: 5,
      width: 300
    });

    var deleteButton = Titanium.UI.createButton({
      rowId: i,
      problemId: params.problemId,
      left: 60,
      height: 25, width: 90,
      title: "избриши",
      color: '#3C3F46',
      backgroundColor: "#FEB300",
      backgroundImage: '../../images/buttons/red_off.png',
      backgroundSelectedImage: '../../images/buttons/red_on.png',
      font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'},
    });
    deleteButton.addEventListener("click", function (e) {
      var problemId = this.problemId;
      var rowId     = this.rowId;

      var alert = Titanium.UI.createAlertDialog({
        title: 'Бришење проблем',
        message: 'Дали сакате да го избришете овој проблем?',
        buttonNames: ['Да', 'Не']
      });
      alert.addEventListener("click", function (e) {
        if (e.index == 0) {
          P.db.deleteProblem(problemId);
          localProblemsTable.updateRow(rowId, {visible: false, height: 0});
          P.UI.flash('Проблемот е успешно избришан');
          Ti.App.fireEvent('refresh_sync_view');
          if (P.db.countLocalProblems() === 0) {
            win.close();
          };
        }
      });
      alert.show();
    });
    buttonsView.add(deleteButton);

    var syncButton = Titanium.UI.createButton({
      rowId: i,
      problemId: params.problemId,
      left: 155,
      height: 25, width: 90,
      title: "пријави",
      color: '#FFF',
      backgroundColor: "#3C3F46",
      backgroundImage: '../../images/buttons/green_off.png',
      backgroundSelectedImage: '../../images/buttons/green_off.png',
      font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'}
    });
    syncButton.addEventListener("click", function (e) {
      var problemId = this.problemId;
      var rowId     = this.rowId;

      var alert = Titanium.UI.createAlertDialog({
        title: 'Праќање проблем',
        message: 'Дали сте сигурни дека сакате да го испратите овој проблем?',
        buttonNames: ['Да', 'Не']
      });
      alert.addEventListener("click", function (e) {
        if (e.index == 0) {
          var params = P.db.getProblemParamsById(problemId);

          var successCallback = function () {
            P.db.deleteProblem(problemId);
            localProblemsTable.updateRow(rowId, {visible: false, height: 0});
            P.UI.flash('Проблемот е успешно пријавен. Ви благодариме!');
            Ti.App.fireEvent('refresh_sync_view');
            if (P.db.countLocalProblems() === 0) {
              win.close();
            };
          }

          P.http.createProblem(params, successCallback, P.UI.problemErrorCallback, P.db.problemErrorHandler);
        }
      });
      alert.show();
    });
    buttonsView.add(syncButton);


    // BUTTONS END


    row.add(leftImage);
    row.add(municipalityLabel);
    row.add(categoryLabel);
    row.add(descriptionLabel);
    row.add(buttonsView);

    tableData.push(row);

    i++;
    dbProblems.next();
  };

  return tableData;
};
// FUNCTIONS END

// BODY BEGIN

var headerView = Titanium.UI.createView({height: 30});
var headerTitleLabel = Ti.UI.createLabel({
  top: 5,
  text: 'Проблеми за пријавување',
  color: '#FFF',
  font: {fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: 'bold'}
});
headerView.add(headerTitleLabel);
var localProblemsTable = Titanium.UI.createTableView({
  headerView: headerView,
  data: buildProblemsTableData(),
  backgroundColor: windowBackgroundColor
});
win.add(localProblemsTable);
// BODY END




// OPTIONS MENU BEGIN
var activity = Ti.Android.currentActivity;
var LOGIN = 1, LOGOUT = 2, SYNC = 3, DELETE = 4;

activity.onCreateOptionsMenu = function (e) {
  var menu = e.menu;

  var deleteLocalProblemsMenuItem = menu.add({title: 'Избриши', itemId: DELETE});
  deleteLocalProblemsMenuItem.addEventListener('click', function () {
    P.db.deleteLocalProblems(function () {
      Ti.App.fireEvent('refresh_sync_view');
      win.close();
    });
  });

  var syncMenuItem = menu.add({title: 'Испрати', itemId: SYNC});
  syncMenuItem.addEventListener('click', function () {
    P.UI.syncProblems(function () {
      Ti.App.fireEvent('refresh_sync_view');
      win.close();
    });
  });

  var loginMenuItem = menu.add({title: 'Најава', itemId: LOGIN});
  loginMenuItem.addEventListener('click', function () {
    P.UI.openLoginWindow();
  });

  var logoutMenuItem = menu.add({title: 'Одјава', itemId: LOGOUT});
  logoutMenuItem.addEventListener('click', function () {
    Ti.App.Properties.setString('cookie', '');
  });
};

activity.onPrepareOptionsMenu = function (e) {
  var menu = e.menu;
  var loggedIn = P.user.loggedIn();
  var problemsCount = P.db.countLocalProblems();

  if (problemsCount > 0) {
    menu.findItem(DELETE).setTitle('Избриши (' + problemsCount + ')');
    menu.findItem(DELETE).setVisible(true);
    menu.findItem(SYNC).setTitle('Испрати (' + problemsCount + ')');
    menu.findItem(SYNC).setVisible(true);
  } else {
    menu.findItem(DELETE).setVisible(false);
    menu.findItem(SYNC).setVisible(false);
  }

  menu.findItem(LOGIN).setVisible(!loggedIn);
  menu.findItem(LOGOUT).setVisible(loggedIn);
};
// OPTIONS MENU END
