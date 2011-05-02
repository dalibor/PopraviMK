P.UI = {};

P.UI.flash = function (message) {
  var toast = Titanium.UI.createNotification({
    // Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
    duration: Ti.UI.NOTIFICATION_DURATION_LONG,
    //duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
    message: message,
    textAlign: 'center'
  })
  toast.show();

  // a way to extend duration of the toats notification
  //setTimeout ( function () { toast.show() }, 4000 );
};

P.UI.createPicker = function (elements, top, left) {
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
  //P.UI.flash("Не е пронајдена интернет конекција. Ве молиме проверете дали уредот е врзан на интернет.");

  var alertDialog = Titanium.UI.createAlertDialog({
    title: 'Интернет конекција',
    message: 'Не е пронајдена интернет конекција. Дали сакате да изберете интернет конекција?',
    buttonNames: ['Да', 'Не']
  });
  alertDialog.addEventListener("click", function (e) {
    if (e.index == 0) {
      var intent = Ti.Android.createIntent({action: "android.settings.WIRELESS_SETTINGS"});
      Ti.Android.currentActivity.startActivity(intent);
    }
  });
  alertDialog.show();
};

P.UI.syncError = function () {
  P.UI.flash('Се појави проблем при испраќањето на проблемите. Ве молиме обидете се повторно.');
};

P.UI.fieldsError = function () {
  P.UI.flash('Недостасува Опис за проблемот.');
};

P.UI.cameraError = function () {
  Ti.UI.createAlertDialog({
    title: 'Проблем со камера', 
    message: 'Уредот или нема камера или се појави проблем при зачувување на сликата.'
  }).show();
};

P.UI.locationError = function (error) {
  var errorMessage = error ? ' (' + error + ')' : '';

  P.UI.flash('Се појави проблем при детектирање на локација' + errorMessage + '. Ве молиме обидете се повторно.');
};

P.UI.openLocationSettings = function (error) {
  var errorMessage = error ? ' (' + error + ')' : '';

  var alertDialog = Titanium.UI.createAlertDialog({
    title: 'Локација',
    message: 'Се појави проблем при детектирање на локација' + errorMessage + '. Дали сакате да изберете детектирање на локација?',
    buttonNames: ['Да', 'Не']
  });
  alertDialog.addEventListener("click", function (e) {
    if (e.index == 0) {
      var intent = Ti.Android.createIntent({action: "android.settings.LOCATION_SOURCE_SETTINGS"});
      Ti.Android.currentActivity.startActivity(intent);
    }
  });
  alertDialog.show();
}

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

P.UI.xhrError = function () {
  P.UI.flash('Се јавија проблеми при испраќање. Ве молиме обидете се повторно.');
};

P.UI.commentError = function () {
  Ti.UI.createAlertDialog({
    title: 'Грешка при коментирање', 
    message: 'Се појави грешка при креирање на коментар, ве молиме обидете се повторно.'
  }).show();
};

P.UI.apiKeyError = function () {
  Ti.UI.createAlertDialog({
    title: 'Грешен API клуч', 
    message: 'Се појави грешка при идентификација на API клучот.'
  }).show();
};

P.UI.loggedInError = function () {
  P.UI.flash('Не сте најавени! Ве молиме најавете се.');
};

P.UI.emptyCommentError = function () {
  Ti.UI.createAlertDialog({
    title: 'Празен коментар', 
    message: 'Ве молиме внесете коментар.'
  }).show();
};

P.UI.openLoginWindow = function () {
  Ti.UI.createWindow({
    title: 'Најави се',
    url: '/js/windows/login.js',
    modal: true
  }).open();
};

P.UI.getCommentsRowData = function (comment) {
  var row = Titanium.UI.createView({
    top: 5, bottom: 0,
    height: 'auto',
    layout: "vertical"
  });

  var screenNameLabel = Ti.UI.createLabel({
    left: 5,
    height: 20,
    text: comment.user,
    color: '#FFF',
    font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'}
  });

  var commentLabel = Ti.UI.createLabel({
    top: 5, left: 5, right: 5,
    color: '#AEAEB0',
    font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'normal'},
    text: comment.content
  });

  var dateLabel = Ti.UI.createLabel({
    top: 5, left: 5,
    height: 20,
    color: '#999',
    font: {fontFamily: 'Helvetica Neue', fontSize: 13, fontWeight: 'normal'},
    text: P.time.time_ago_in_words_with_parsing(comment.created_at + "")
  });

  row.add(screenNameLabel);
  row.add(commentLabel);
  row.add(dateLabel);

  row.className = "comment";

  return row;
};
