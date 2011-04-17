Ti.include('../p.js');

var win = Titanium.UI.currentWindow;
var problem = win.problem;
var selectedStatus;
var selectedStatusRowIndex;
var STATUSES = [
  ['reported', 'пријавен'], 
  ['approved', 'одобрен'], 
  ['activated', 'активен'], 
  ['solved', 'поправен'], 
  ['invalid', 'невалиден']
];


var scrollView = Ti.UI.createScrollView({
  top: 0,
  contentWidth: 'auto',
  contentHeight: 'auto',
  showVerticalScrollIndicator: true,
  layout: 'vertical'
});
  var titleLabel = Ti.UI.createLabel({
    top: 5, left: 5,
    text: problem.category + " (" + problem.municipality + ")",
    color: '#FFF',
    font: {fontSize: 15, fontWeight: 'bold'}
  });
  scrollView.add(titleLabel);
  var imageView = Titanium.UI.createImageView({
    top: 5, left: 5,
    width: 300,
    url: P.config.hostname + problem.photo_medium
  });
  scrollView.add(imageView);
  var subtitleLabel = Ti.UI.createLabel({
    top: 10, left: 5,
    text: problem.description,
    color: '#AEAEB0',
    font: {fontSize: 14}
  });
  scrollView.add(subtitleLabel);

  var statusView = Ti.UI.createView({
    top: 10, left: 5,
    width: 300, height: 50
  });
    var statusLabel = Ti.UI.createLabel({
      top: 5, left: 5,
      height: 50, width: 60,
      text: 'Статус:',
      color: '#FFF',
      font: {fontSize: 15, fontWeight: 'bold'}
    });
    statusView.add(statusLabel);


    var loggedIn = P.user.loggedIn();

    if (loggedIn) {
      var statuses = [];
      for (var i = 0; i < STATUSES.length; i++) {
        if (STATUSES[i][0] === problem.status) {
          selectedStatusRowIndex = i;
        }
        statuses.push({
          title: STATUSES[i][1], 
          id: i
        });
      };
      statusPicker = P.UI.createColorPicker(statuses, 5, 5);
      statusPicker.setSelectedRow(0, selectedStatusRowIndex, true);

      statusPicker.addEventListener('change', function (e) {
        selectedStatus = STATUSES[e.rowIndex][0];
      });

      var statusPickerView = Ti.UI.createView({
        top: 5, left: 70,
        width: 150, height: 50
      });

      var statusButton = Titanium.UI.createButton({
        top: 12, left: 230,
        width: 70, height: 35,
        title: "Сними",
        borderRadius: 4,
        font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'bold'},
        color: '#3C3F46',
        backgroundColor: "#FEB300",
      });

      var successCallback = function () {
        Ti.UI.createAlertDialog({
          title: 'Успешна промена!', 
          message: 'Статусот е успешно изменет. Ви благодариме!'
        }).show();
        problem.status = selectedStatus;
      };

      var accessDeniedCallback = function () {
        Ti.App.Properties.setString('cookie', '');
        P.UI.openLoginWindow();
        P.UI.flash('Ве молиме најавете се за да промените статус на проблем!');
      };

      statusButton.addEventListener("click", function (e) {
        P.http.changeProblemStatus(problem.id, selectedStatus, 
          successCallback, accessDeniedCallback);
      });
      statusPickerView.add(statusPicker);
      statusView.add(statusPickerView);
      statusView.add(statusButton);
    } else {
      var statusValueLabel = Ti.UI.createLabel({
        top: 5, left: 70,
        width: 150, height: 50,
        text: problem.status,
        color: '#FFF',
        font: {fontSize: 15, fontWeight: 'bold'}
      });
      statusView.add(statusValueLabel);
    }
  scrollView.add(statusView);

  var shareTitleLabel = Ti.UI.createLabel({
    top: 15, // left: 5,
    text: "Сподели линк од проблемот:",
    color: '#FFF',
    font: {fontSize: 13}
  });
  scrollView.add(shareTitleLabel);
  var shareView = Ti.UI.createView({
    top: 5,// left: 5,
    width: 120, height: 55
  });

    var twitterButton = Titanium.UI.createButton({
      left: 0,
      width: 50, height: 50,
      backgroundImage: '../../images/buttons/twitter.png',
      backgroundSelectedImage: '../../images/buttons/twitter.png'
    });
    twitterButton.addEventListener("click", function (e) {
      var url = "http://twitter.com/home/?status=" +
        encodeURIComponent("Пријавив нов проблем на PopraviMK: " +
          problem.url + " #popravimk");
      Ti.Platform.openURL(url);
    });
    shareView.add(twitterButton)
    var facebookButton = Titanium.UI.createButton({
      left: 70,
      width: 50, height: 50,
      backgroundImage: '../../images/buttons/facebook.png',
      backgroundSelectedImage: '../../images/buttons/facebook.png'
    });
    facebookButton.addEventListener("click", function (e) {
      var url = "http://www.facebook.com/share.php?u=" +
        encodeURIComponent(problem.url) + "&t=" +
        encodeURIComponent("Пријавив нов проблем на PopraviMK");
      Ti.Platform.openURL(url);
    });
    shareView.add(facebookButton)
  scrollView.add(shareView);

win.add(scrollView);
