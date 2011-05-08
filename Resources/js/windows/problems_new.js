Ti.include('../p.js');

var win = Titanium.UI.currentWindow;
win.setBackgroundColor('#3F3F3F');
var categoryPicker, municipalityPicker;

var categories     = P.db.categories();
var municipalities = P.db.municipalities();

var currentImageAdded = false;
var currentImageView  = null;

var params = {
  category_id: null,
  municipality_id: null,
  image: null
};


var createCategoryPicker = function () {
  categoryPicker = P.UI.createPicker(categories, 40, 10);
  categoryView.add(categoryPicker);
  categoryPicker.addEventListener('change', function (e) {
    params.category_id = categories[e.rowIndex].id;
  });
};

var createMunicipalityPicker = function () {
  municipalityPicker = P.UI.createPicker(municipalities, 40, 10);
  municipalityView.add(municipalityPicker);
  municipalityPicker.addEventListener('change', function (e) {
    params.municipality_id = municipalities[e.rowIndex].id;
  });
};

var getSyncLabel = function (problemsCount) {
  if (problemsCount === 0) {
    return 'Локално немате сочувано ниту еден проблем.'
  } else if (problemsCount === 1) {
    return 'Локално имате сочувано ' + problemsCount + ' проблем.'
  } else {
    return 'Локално имате сочувано ' + problemsCount + ' проблеми.'
  }
};

var getSyncButton = function (problemsCount) {
  return 'Пријави (' + problemsCount + ')';
};

// EVENTS BEGIN
Ti.App.addEventListener('refresh_sync_view', function (data) {
  var problemsCount = P.db.countLocalProblems();
  syncButton.title  = getSyncButton(problemsCount);
  syncLabel.text    = getSyncLabel(problemsCount)

  if (problemsCount > 0) {
    syncButtonsView.visible  = true;
  } else {
    syncButtonsView.visible  = false;
  }
});
// EVENTS EBD

var scrollView = Ti.UI.createScrollView({
  top: 0,
  contentWidth: "auto", contentHeight: "auto",
  showVerticalScrollIndicator: true,
  layout: 'vertical'
});


// description
var descriptionView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 110,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var descriptionTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: 'Опис',
  color: '#FFF',
  font:{fontSize: 18, fontWeight: 'bold'}
});
var descriptionField = Ti.UI.createTextArea({
  top: 35, left: 10,
  height: 65, width: 280,
  value: '',
  keyboardType: Ti.UI.KEYBOARD_ASCII,
  color: '#222',
  font: {fontSize: 14, fontWeight: "normal"},
  borderWidth: 2,
  borderColor: '#303030',
  borderRadius: 6
});
descriptionView.add(descriptionTitleLabel);
descriptionView.add(descriptionField);
scrollView.add(descriptionView);


// photo
var photoView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 60,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var mediaView = Ti.UI.createView({
  top: 5, left: 10,
  width: 50, height: 50,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var mediaButtonBackground = Ti.UI.createView({
  top: 2, left: 2,
  width: 46, height: 46,
  backgroundColor: '#000',
  borderRadius: 5
});
var mediaLabel = Ti.UI.createLabel({
  top: 15, left: 70,
  width: 280, height: 30,
  text: 'Слика',
  color: '#FFF',
  font: {fontSize: 16, fontWeight: 'bold'}
});
var mediaAddButton = Ti.UI.createButton({
  top: 1, left: 1,
  width: 44, height: 44,
  backgroundImage: '../../images/icons/camera.png',
  backgroundSelectedImage: '../../images/icons/camera.png',
  backgroundDisabledImage: '../../images/icons/camera.png'
});
mediaButtonBackground.add(mediaAddButton);
mediaView.add(mediaButtonBackground);
photoView.add(mediaView);
photoView.add(mediaLabel);
scrollView.add(photoView);
mediaAddButton.addEventListener('click', function () {
  displayMediaChooser();
});


// weight slider
var weightView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 75,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var weightTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: "Тежина (5)",
  color: '#FFF',
  font: {fontSize: 18, fontWeight: 'bold'}
});
var weightSlider = Ti.UI.createSlider({
  top: 40, left: 10,
  width: 280, height: "auto",
  min: 1, max: 10,
  value: 5,
  enabled: true
});
weightSlider.addEventListener('change', function (e) {
  weightTitleLabel.text = "Тежина (" + Math.round(weightSlider.value) + ")";
});
weightView.add(weightTitleLabel);
weightView.add(weightSlider);
scrollView.add(weightView);


// category select
var categoryView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 90,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var categoryTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: "Категорија",
  color: '#FFF',
  font: {fontSize: 18, fontWeight: 'bold'}
});
categoryView.add(categoryTitleLabel);
createCategoryPicker()
scrollView.add(categoryView);

// municipality select
var municipalityView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 90,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var municipalityTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: "Општина",
  color: '#FFF',
  font: {fontSize: 18, fontWeight: 'bold'}
});
municipalityView.add(municipalityTitleLabel);
createMunicipalityPicker();
scrollView.add(municipalityView);

// Form buttons
var buttonsView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 50
});
var resetButton = Titanium.UI.createButton({
  left: 5, top: 5,
  width: 90, height: 35,
  title: "Избриши",
  backgroundImage: '../../images/buttons/red_off.png',
  backgroundSelectedImage: '../../images/buttons/red_on.png',
  font: {fontSize: 14, fontWeight: 'bold'}
});
var clearAlert = Titanium.UI.createAlertDialog({
  title: 'Враќање на почеток',
  message: 'Дали сакате сите вредности да бидат вратени на почеток?',
  buttonNames: ['Да', 'Не']
});
clearAlert.addEventListener("click", function (e) {
  if (e.index == 0) {
    clearAllValues();
  }
});
resetButton.addEventListener("click", function (e) {
  clearAlert.show();
});

var saveButton = Titanium.UI.createButton({
  left: 105, top: 5,
  width: 90, height: 35,
  title: "Сочувај",
  backgroundImage: '../../images/buttons/yellow_off.png',
  backgroundSelectedImage: '../../images/buttons/yellow_on.png',
  font: {fontSize: 14, fontWeight: 'bold'}
});
saveButton.addEventListener("click", function (e) {
  descriptionField.blur();
  params.description = descriptionField.value;
  params.weight      = weightSlider.value;

  if (!descriptionField.value) {
    P.UI.fieldsError();
  } else {
    P.geolocation.detect(function (coords) {
      params.latitude = coords.latitude; params.longitude = coords.longitude;
      P.db.createProblem(params);
      Ti.App.fireEvent('refresh_sync_view');
      clearAllValues();
      P.UI.flash("Проблемот е успешно сочуван локално, не заборавајте да направите синхронизација со серверот.");
    });
  }
});

var sendButton = Titanium.UI.createButton({
  left: 205, top: 5,
  width: 90, height: 35,
  title: "Пријави",
  backgroundImage: '../../images/buttons/green_off.png',
  backgroundSelectedImage: '../../images/buttons/green_on.png',
  font: {fontSize: 14, fontWeight: 'bold'}
});
sendButton.addEventListener("click", function (e) {
  descriptionField.blur();
  sendProblemClicked();
});

buttonsView.add(resetButton);
buttonsView.add(saveButton);
buttonsView.add(sendButton);
scrollView.add(buttonsView);
win.add(scrollView);



var removePhoto = function () {
  if (currentImageAdded) {
    mediaButtonBackground.remove(currentImageView);
    currentImageAdded = false;
    params.image      = null;
  }
};

var createPhoto = function (image) {
  removePhoto();
  params.image = image;

  currentImageView = Ti.UI.createImageView({
    top: 1, left: 1,
    height: 44, width: 44,
    image: image,
    borderRadius: 2
  });

  currentImageView.addEventListener('click', function (event) {
    displayMediaChooser();
  });

  currentImageAdded = true;
  mediaButtonBackground.add(currentImageView);
};

var newPhoto = function () {
  Ti.Media.showCamera({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    success: function (event) {
      var cropRect = event.cropRect;
      createPhoto(event.media);
    },
    error: function (error) {
      P.UI.cameraError();
    },
    allowImageEditing: true,
    saveToPhotoGallery: false
  });
};

var chooseFromGallery = function () {
  Ti.Media.openPhotoGallery({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    success: function (event) {
      var cropRect = event.cropRect;
      createPhoto(event.media);
    }
  });
};

var chooseMediaSource = function (event) {
  switch (event.index) {
    case 0:
      newPhoto();
      break;
    case 1:
      chooseFromGallery();
      break;
    case 2:
      if (event.source.options.length === 4)  {
        removePhoto();
      }
      break;
    default:
  };
};

var displayMediaChooser = function () {
  var chooseMedia = Ti.UI.createOptionDialog({title: 'Изберете слика'});
  chooseMedia.addEventListener('click', chooseMediaSource);

  if(currentImageAdded) {
    chooseMedia.options = ['Нова', 'Постоечка', 'Избриши', 'Откажи'];
  } else {
    chooseMedia.options = ['Нова', 'Постоечка','Откажи'];
  }
  chooseMedia.show();
}

var clearAllValues = function () {
  weightSlider.value = 5;
  descriptionField.value = '';
  categoryPicker.setSelectedRow(0, 0, true);
  municipalityPicker.setSelectedRow(0, 0, true);
  removePhoto();
};

var successCallback = function () {
  P.UI.flash('Проблемот е успешно пријавен. Ви благодариме!');
  clearAllValues();
}

var errorCallback = function (json) {
  P.UI.problemErrorCallback(json);
  clearAllValues();
}

var refreshPickersCallback = function (json) {
  categoryView.remove(categoryPicker);
  createCategoryPicker();

  municipalityView.remove(municipalityPicker);
  createMunicipalityPicker();
}

var errorHandler = function (json) {
  P.db.problemErrorHandler(json, refreshPickersCallback);
}

var sendProblemClicked = function () {
  params.description = descriptionField.value;
  params.weight      = weightSlider.value;

  if (!descriptionField.value) {
    P.UI.fieldsError();
  } else {
    P.geolocation.detect(function (coords) {
      params.longitude = coords.longitude; params.latitude  = coords.latitude; 
      P.http.createProblem(params, successCallback, errorCallback, errorHandler);
    });
  }
};




// Sync buttons

var problemsCount = P.db.countLocalProblems();

var syncView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 100,
  layout: 'vertical'
});
var syncLabel = Ti.UI.createLabel({
  top: 0, left: 10,
  width: 300, height: 40,
  color: '#FFF',
  text: getSyncLabel(problemsCount)
});

syncButtonsView = Ti.UI.createView({
  top: 5, left: 35,
  width: 300, height: 40,
  visible: (problemsCount > 0)
});

var previewButton = Titanium.UI.createButton({
  left: 0, top: 5,
  width: 110, height: 35,
  title: "Прегледај",
  backgroundImage: '../../images/buttons/dark_off.png',
  backgroundSelectedImage: '../../images/buttons/dark_on.png',
  font: {fontSize: 14, fontWeight: 'bold'}
});
previewButton.addEventListener("click", function (e) {
  Titanium.UI.createWindow({
    url: '/js/windows/problems_local.js',
    navBarHidden: true
  }).open();
});

var syncButton = Titanium.UI.createButton({
  left: 120, top: 5,
  width: 110, height: 35,
  title: getSyncButton(problemsCount),
  backgroundImage: '../../images/buttons/green_off.png',
  backgroundSelectedImage: '../../images/buttons/green_off.png',
  font: {fontSize: 14, fontWeight: 'bold'}
});
syncButton.addEventListener("click", function (e) {
  P.UI.syncProblems(function () {
    Ti.App.fireEvent('refresh_sync_view');
  });
});


    syncView.add(syncLabel);
      syncButtonsView.add(syncButton);
      syncButtonsView.add(previewButton);
    syncView.add(syncButtonsView);
  scrollView.add(syncView);
win.add(scrollView);








// OPTIONS MENU BEGIN
var activity = Ti.Android.currentActivity;
var LOGIN = 1, LOGOUT = 2;

activity.onCreateOptionsMenu = function (e) {
  var menu = e.menu;

  var settingsMenuItem = menu.add({title: 'Поставки'});
  settingsMenuItem.addEventListener('click', function () {
    Ti.UI.createWindow({
      title: 'Поставки',
      url: '/js/windows/settings.js',
      modal: true
    }).open();
  });

  var disclaimerMenuItem = menu.add({title: 'Услови'});
  disclaimerMenuItem.addEventListener('click', function () {
    Ti.UI.createWindow({
      title: 'Услови за користење на PopraviMK',
      url: '/js/windows/terms.js',
      modal: true
    }).open();
  });

  var aboutMenuItem = menu.add({title: 'Инфо'});
  aboutMenuItem.addEventListener('click', function () {
    Ti.UI.createWindow({
      title: 'За PopraviMK',
      url: '/js/windows/about.js',
      modal: true
    }).open();
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

  menu.findItem(LOGIN).setVisible(!loggedIn);
  menu.findItem(LOGOUT).setVisible(loggedIn);
};
// OPTIONS MENU END
