Ti.include('../p.js');

P.UI.requirements();

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
  categoryPicker = P.UI.createColorPicker(categories, 40, 10);
  categoryView.add(categoryPicker);
  categoryPicker.addEventListener('change', function (e) {
    params.category_id = categories[e.rowIndex].id;
  });
};

var createMunicipalityPicker = function () {
  municipalityPicker = P.UI.createColorPicker(municipalities, 40, 10);
  municipalityView.add(municipalityPicker);
  municipalityPicker.addEventListener('change', function (e) {
    params.municipality_id = municipalities[e.rowIndex].id;
  });
};

var scrollView = Ti.UI.createScrollView({
  top: 0,
  contentWidth: "auto", contentHeight: "auto",
  showVerticalScrollIndicator: true
});


// description
var descriptionView = Ti.UI.createView({
  top: 10, left: 10,
  width: 300, height: 100,
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
  height: 55, width: 280,
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
  top: 120, left: 10,
  width: 300, height: 70,
  backgroundColor: '#1B1C1E',
  borderRadius: 6
});
var mediaView = Ti.UI.createView({
  top: 10, left: 10,
  width: 50, height: 50,
  backgroundColor: '#222',
  borderRadius: 6
});
var mediaButtonBackground = Ti.UI.createView({
  top: 2, left: ((mediaView.width - 46)/2),
  width: 46, height: 46,
  backgroundColor: '#000',
  borderRadius: 5
});
var mediaLabel = Ti.UI.createLabel({
  top: 20, left: 80,
  width: 280, height: 30,
  text: 'Додај слика',
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
  top: 200, left: 10,
  width: 300, height: 75,
  backgroundColor: '#333',
  borderRadius: 6
});
var weightTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: "Тежина? (5)",
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
  weightTitleLabel.text = "Тежина? (" + Math.round(weightSlider.value) + ")";
});
weightView.add(weightTitleLabel);
weightView.add(weightSlider);
scrollView.add(weightView);


// category select
var categoryView = Ti.UI.createView({
  top: 285, left: 10,
  width: 300, height: 90,
  backgroundColor: '#333',
  borderRadius: 6
});
var categoryTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: "Категорија?",
  color: '#FFF',
  font: {fontSize: 18, fontWeight: 'bold'}
});
categoryView.add(categoryTitleLabel);
createCategoryPicker()
scrollView.add(categoryView);

// municipality select
var municipalityView = Ti.UI.createView({
  top: 385, left: 10,
  width: 300, height: 90,
  backgroundColor: '#333',
  borderRadius: 6
});
var municipalityTitleLabel = Ti.UI.createLabel({
  top: 5, left: 10,
  width: 300, height: 30,
  text: "Општина?",
  color: '#FFF',
  font: {fontSize: 18, fontWeight: 'bold'}
});
municipalityView.add(municipalityTitleLabel);
createMunicipalityPicker();
scrollView.add(municipalityView);

// Form buttons
var buttonsView = Ti.UI.createView({
  top: 480, left: 10,
  width: 300, height: 50
});
var resetButton = Titanium.UI.createButton({
  left: 5, top: 5,
  width: 90, height: 35,
  title: "Избриши",
  backgroundImage: '../../images/buttons/button-off.png',
  backgroundSelectedImage: '../../images/buttons/button-on.png',
  color: "#FFFFFF",
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

var problemSaveCallback = function () {
  clearAllValues();
  P.UI.flash("Проблемот е успешно сочуван локално, не заборавајте да направите синхронизација со серверот.");
}


var saveButton = Titanium.UI.createButton({
  left: 105, top: 5,
  width: 90, height: 35,
  title: "Сочувај",
  backgroundImage: '../../images/buttons/button-off.png',
  backgroundSelectedImage: '../../images/buttons/button-on.png',
  color: "#FFFFFF",
  font: {fontSize: 14, fontWeight: 'bold'}
});
saveButton.addEventListener("click", function (e) {
  params.description = descriptionField.value;
  params.weight      = weightSlider.value;

  if (!descriptionField.value) {
    P.UI.fieldsError();
  } else {
    if (P.config.virtualDevice) {
      // for virtual device submit event with fake latitude and longitude
      params.latitude = 0; params.longitude = 0;
      P.db.createProblem(params);
      problemSaveCallback();
    } else {
      Titanium.Geolocation.getCurrentPosition(function (e) {
        if (e.error) {
          P.UI.locationError();
        } else {
          params.latitude = e.coords.latitude; params.longitude = e.coords.longitude;
          P.db.createProblem(params);
          problemSaveCallback();
        }
      });
    }
  }


});

var sendButton = Titanium.UI.createButton({
  left: 205, top: 5,
  width: 90, height: 35,
  title: "Испрати",
  backgroundImage: '../../images/buttons/button-off.png',
  backgroundSelectedImage: '../../images/buttons/button-on.png',
  color: "#FFFFFF",
  font: {fontSize: 14, fontWeight: 'bold'}
});
sendButton.addEventListener("click", function (e) {
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

var sendProblemClicked = function () {
  params.description = descriptionField.value;
  params.weight      = weightSlider.value;

  if (!descriptionField.value) {
    P.UI.fieldsError();
  } else if (Titanium.Network.online == false) {
    P.UI.connectionError();
  } else {
    if (P.config.virtualDevice) {
      // for virtual device submit event with fake latitude and longitude
      params.latitude = 0; params.longitude = 0;
      P.http.createProblem(params, successCallback, errorCallback, errorHandler);
    } else {
      Titanium.Geolocation.getCurrentPosition(function (e) {
        if (e.error) {
          P.UI.locationError();
        } else {
          params.latitude = e.coords.latitude; params.longitude = e.coords.longitude;
          P.http.createProblem(params, successCallback, errorCallback, errorHandler);
        }
      });
    }
  }
};

var successCallback = function () {
  P.UI.flash('Проблемот е успешно пријавен. Ви благодариме!');
  clearAllValues();
}

var errorCallback = function (json) {
  var message;
  if (json.type === "photo") {
    message = "Сликата не е во валиден формат.";
  } else if (json.type === "token") {
    message = "Не можете да додадете слика бидејќи е испратен невалиден токен.";
  } else {
    message = "Се појави технички проблем при испраќање на сликата.";
  }

  P.UI.flash(message);
  clearAllValues();
}

var errorHandler = function (actions) {
  var messageSync = []
  var categorySync = false;
  var municipalitySync = false;

  if (actions.category === "sync") {
    categorySync = true;
    messageSync.push("категории");
  }

  if (actions.municipality === "sync") {
    municipalitySync = true;
    messageSync.push("општини");
  }

  var syncAlert = Titanium.UI.createAlertDialog({
    title: 'Синхронизација', 
    message: 'Потребно е да направите синхронизација со серверот за да ја превземете изменетата листа на ' + messageSync.join(" и ") + '. Дали сакате синхронизацијата да започне?', 
    buttonNames: ['Да', 'Не']
  });

  syncAlert.addEventListener("click", function (e) {
    if (e.index == 0) {
      var callback = function () {
        P.UI.flash("Успешно се синхронизирани категориите и општините со серверот.");
        categories     = P.db.categories();
        municipalities = P.db.municipalities();

        categoryView.remove(categoryPicker);
        createCategoryPicker();

        municipalityView.remove(municipalityPicker);
        createMunicipalityPicker();
      };

      P.http.sync(callback);
    }
  });
  syncAlert.show();
};





P.UI.createOptionsMenu();
