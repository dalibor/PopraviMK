Titanium.include('../helpers/config.js');
Titanium.include('../helpers/shared.js');

checkRequirements();

var windowBackgroundColor = '#3F3F3F';
var win = Titanium.UI.currentWindow;
win.setBackgroundColor(windowBackgroundColor);
var currentImageView;
var currentImageAdded = false;
var categoryValue;
var municipalityValue;
var androidActivityIndicator;
var resetCounter = 1;
var scrollView = Ti.UI.createScrollView({top: 0, contentWidth: "auto", contentHeight: "auto", showVerticalScrollIndicator: true});

var db = Titanium.Database.install('../../db/popravi.sqlite', 'popravi');

// Add problem description
var descriptionView = Ti.UI.createView({top: 10, left: 10, width: 300, height: 160, backgroundColor: '#1B1C1E', borderRadius: 6});

var descriptionTitleLabel = Ti.UI.createLabel({top: 5, left: 10, width: 300, height: 30, color: '#FFF', font:{fontSize: 18, fontWeight: 'bold'},text: 'Опис на проблемот'});
descriptionView.add(descriptionTitleLabel);

var descriptionField = Ti.UI.createTextArea({value: '', top: 40, left: 10, height: 54, width: 280, keyboardType: Ti.UI.KEYBOARD_ASCII, color: '#222', 
  font: {fontSize: 14, fontWeight: "normal"}, borderWidth: 2, borderColor: '#303030', borderRadius: 6});
descriptionField.addEventListener("return", function (e) {
  descriptionField.blur();
});
descriptionView.add(descriptionField);



// Add problem photo
var mediaLabel = Ti.UI.createLabel({top: 100, left: 70, width: 280, height: 30, color: '#FFF', font: {fontSize: 16, fontWeight: 'bold'}, text: 'Додај слика'});
var mediaDescLabel = Ti.UI.createLabel({ top: 128, left: 70, width: 280, height: 30, color: '#eee', 
  font: {fontSize: 12, fontWeight: 'normal'}, text: 'Сподели слика од проблемот'});
descriptionView.add(mediaDescLabel);
descriptionView.add(mediaLabel);

var mediaView = Ti.UI.createView({top: 100, left: 10, width: 50, height: 50, backgroundColor: '#222', borderRadius: 6});
var mediaButtonBg = Ti.UI.createView({top: 2, left: ((mediaView.width - 46)/2), width: 46, height: 46, backgroundColor: '#000', borderRadius: 5});
var mediaAddButton = Ti.UI.createButton({top: 1, left: 1, width: 44, height: 44, backgroundImage: '../../images/icons/camera.png',
  backgroundSelectedImage: '../../images/icons/camera.png', backgroundDisabledImage: '../../images/icons/camera.png'});
mediaAddButton.addEventListener('click', function () {
  displayMediaChooser();
});
mediaButtonBg.add(mediaAddButton);
mediaView.add(mediaButtonBg);
descriptionView.add(mediaView);
scrollView.add(descriptionView);



// Add problem weight
var weightView = Ti.UI.createView({top: 185, left: 10, width: 300, height: 90, backgroundColor: '#333', borderRadius: 6});
var weightTitleLabel = Ti.UI.createLabel({top: 5, left: 10, width: 300, height: 30, color: '#FFF',
  font: {fontSize: 18, fontWeight: 'bold'}, text: "Големина на проблемот? (5)"});
weightView.add(weightTitleLabel);

var weightDescLabel = Ti.UI.createLabel({top: (Ti.Platform.name == 'android' ? 30 : 25), left: 10, width: 300, height: 30,
  color: '#eee', font: {fontSize: 12, fontWeight: 'normal'}, text: "0 - нема проблем, 10 - паднато дрво на улица"});
weightView.add(weightDescLabel);

var weightSlider = Ti.UI.createSlider({top: 55,left: 10,width: 280, height: "auto", min: 0, max: 10, value:5, enabled: true});
weightView.add(weightSlider);

weightSlider.addEventListener('change',function (e) {
  weightTitleLabel.text = "Тежина на проблемот? (" + Math.round(weightSlider.value)+")";
});
scrollView.add(weightView);



// Add problem category
var categoryView = Ti.UI.createView({ top: 285, left: 10, width: 300, height: 90, backgroundColor: '#333', borderRadius: 6});
var categoryTitleLabel = Ti.UI.createLabel({ top: 5, left: 10, width: 300, height: 30, color: '#FFF', font:{fontSize: 18, fontWeight: 'bold'}, text: "Категорија?"});
categoryView.add(categoryTitleLabel);

var drawCategoryHtml = function () {
  var categoryHtml = '<html>';
  categoryHtml += '<head>';
  categoryHtml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
  categoryHtml += '</head>';
  categoryHtml += '<body bgcolor="#333">';
  categoryHtml += "<select id='category_select' style='width: 270px; font-size: 14px; height: 30px;'>";
  
  var categories_rows = db.execute('SELECT * FROM categories;');
  categoryValue = categories_rows.fieldByName('web_id'); // initialize categoryValue
  while (categories_rows.isValidRow()) {
    categoryHtml += '<option value="' + categories_rows.fieldByName('web_id') + '">' + categories_rows.fieldByName('name') + '</option>';
    categories_rows.next();
  }
  categories_rows.close();
  
  categoryHtml += "</select>";
  categoryHtml += "<script type='text/javascript'>";
  categoryHtml += "document.getElementById('category_select').onchange = function () { Titanium.App.fireEvent('set_category_value', {value: this.value}); };";
  categoryHtml += "</script>";
  categoryHtml +="</body></html>";
  
  return categoryHtml;
}

var categoryWebView = Ti.UI.createWebView({top: 35, left: 0, width: 300, height: 48, html: drawCategoryHtml()});
categoryView.add(categoryWebView);
scrollView.add(categoryView);

Ti.App.addEventListener("set_category_value",function (e) {
  categoryValue = e.value;
});


// Add problem municipality
var municipalityView = Ti.UI.createView({ top: 385,left: 10,width: 300, height: 90, backgroundColor: '#333', borderRadius: 6});
var municipalityTitleLabel = Ti.UI.createLabel({ top: 5, left: 10, width: 300, height: 30, color: '#FFF', font: {fontSize: 18, fontWeight: 'bold'}, text: "Општина?"});
municipalityView.add(municipalityTitleLabel);

var drawMunicipalityHtml = function () {
  var municipalityHtml = '<html>';
  municipalityHtml += '<head>';
  municipalityHtml += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
  municipalityHtml += '</head>';
  municipalityHtml += '<body bgcolor="#333">';
  municipalityHtml += "<select id='municipality_select' style='width: 270px; font-size: 14px; height: 30px;'>";
  
  var municipalities_rows = db.execute('SELECT * FROM municipalities;');
  municipalityValue = municipalities_rows.fieldByName('web_id'); // initialize municipalityValue
  while (municipalities_rows.isValidRow()) {
    municipalityHtml += '<option value="' + municipalities_rows.fieldByName('web_id') + '">' + municipalities_rows.fieldByName('name') + '</option>';
    municipalities_rows.next();
  }
  municipalities_rows.close();
  
  municipalityHtml += "</select>";
  municipalityHtml += "<script type='text/javascript'>";
  municipalityHtml += "document.getElementById('municipality_select').onchange = function () { Titanium.App.fireEvent('set_municipality_value', {value: this.value}); };";
  municipalityHtml += "</script>";
  municipalityHtml +="</body></html>";
  
  return municipalityHtml;
};

var municipalityWebView = Ti.UI.createWebView({top: 35, left: 0, width: 300, height: 48, html: drawMunicipalityHtml()});
municipalityView.add(municipalityWebView);
scrollView.add(municipalityView);

Ti.App.addEventListener("set_municipality_value",function (e) {
  municipalityValue = e.value;
});



// Form buttons
var buttonsView = Ti.UI.createView({ top: 480, left: 10,width: 300, height: 50}); // , backgroundColor: '#3E4146', borderRadius: 6
var resetButton = Titanium.UI.createButton({backgroundImage: '../../images/buttons/button-off.png', backgroundSelectedImage: '../../images/buttons/button-on.png', left: 20, top: 5, width: 120, height: 40, title: "Избриши", font: {fontSize: 17, fontWeight: 'bold'}, color: "#FFFFFF"});
var clearAlert = Titanium.UI.createAlertDialog({title: 'Враќање на почеток', message: 'Дали сакате сите вредности да бидат вратени на почеток?', buttonNames: ['Да', 'Не']});
clearAlert.addEventListener("click",function (e) {
  if(e.index == 0) {
    clearAllValues();
  }
});
resetButton.addEventListener("click", function (e) {
  clearAlert.show();
});
 
var sendButton = Titanium.UI.createButton({backgroundImage: '../../images/buttons/button-off.png', backgroundSelectedImage: '../../images/buttons/button-on.png', right: 20, top: 5, width: 120, height: 40, title: "Испрати", font: {fontSize: 17, fontWeight: 'bold'}, color: "#FFFFFF"});
sendButton.addEventListener("click", function (e) {
  submitReport();
});

buttonsView.add(resetButton);
buttonsView.add(sendButton);

scrollView.add(buttonsView);

win.add(scrollView);




/*
 * Take new photo
 */
var newPhoto = function () {
  Ti.Media.showCamera({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    success: function (event) {
      var cropRect = event.cropRect;
      currentMedia = event.media;

      if (currentImageAdded) {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
      }
      
      currentImageView = Ti.UI.createImageView({top: 1, left: 1, image: event.media, height: 44, width: 44, borderRadius: 2});
      currentImageView.addEventListener('click', function (event) {
        displayMediaChooser();
      });
      
      mediaButtonBg.add(currentImageView);
      currentImageAdded = true;
    },
    error: function (error) {
      Ti.UI.createAlertDialog({title: 'Проблем со камера', message: 'Уредот или нема камера или се појави проблем при зачувување на сликата.'}).show();
    },
    allowImageEditing: true,
    saveToPhotoGallery: false
  });
}

/*
 * Choose photo from gallery
 */
var chooseFromGallery = function () {
  Ti.Media.openPhotoGallery({
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    success: function (event) {
      var cropRect = event.cropRect;
      currentMedia = event.media;

      if(currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
      }
      
      currentImageView = Ti.UI.createImageView({top: 1, left: 1, image: event.media, height: 44, width: 44, borderRadius: 2});
      currentImageView.addEventListener('click', function (event) {
        displayMediaChooser();
      });
      mediaButtonBg.add(currentImageView);
      currentImageAdded = true;
    }
  });
};



// Media management
var currentMedia = false;

var chooseMediaSource = function (event) {
  switch(event.index) {
    // case 0:
    //   newVideo();
    //   break;
    case 0:
      newPhoto();
      break;
    case 1:
      chooseFromGallery();
      break;
    case 2:
      // event.source.options.length === 4 fix for desctructive and cancel properties
      if(event.source.options.length === 4 && currentImageAdded)  {
        mediaButtonBg.remove(currentImageView);
        currentImageAdded = false;
        currentMedia = false;
      }
      break;
      default:
  };
};

var chooseMedia = Ti.UI.createOptionDialog({title: 'Изберете слика'});
chooseMedia.addEventListener('click', chooseMediaSource);

function displayMediaChooser() {
  if(currentImageAdded) {
    chooseMedia.options = ['Нова', 'Постоечка', 'Избриши', 'Откажи'];
    chooseMedia.destructive = 2; // doesn't work
    chooseMedia.cancel = 3; // doesn't work
  } else {
    chooseMedia.options = ['Нова', 'Постоечка','Откажи'];
    chooseMedia.cancel = 2; // doesn't work
  }
  chooseMedia.show();
}

/*
 * Clears values of form fields
 */
var clearAllValues = function () {
  resetCounter += 1;
  weightSlider.value = 5;
  descriptionField.value = "";
  image = null;
  currentMedia = null;
  categoryValue = '1';
  municipalityValue = '1';
  categoryWebView.html = categoryWebView.html + Array(resetCounter).join(" ");
  municipalityWebView.html = municipalityWebView.html + Array(resetCounter).join(" ");
  if(currentImageAdded) {
    mediaButtonBg.remove(currentImageView);
    currentImageAdded = false;
  }
}

/*
 * Shows success after report was submited
 */
var showSuccess = function () {
  hideIndicator(androidActivityIndicator);
   
  Ti.UI.createAlertDialog({title: 'Успешно пријавување!', message: 'Проблемот е успешно пријавен. Ви благодариме!'}).show();
  clearAllValues();
}

/*
 * Shows errors after report was submited
 */
var showError = function (json) {
  hideIndicator(androidActivityIndicator);
  
  var message;
  if (json.type === "photo") {
    message = "Сликата не е во валиден формат.";
  } else if (json.type === "device_id") {
    message = "Не можете да додадете слика бидејќи извештајот е испратен од друг мобилен уред.";
  } else {
    message = "Се појави технички проблем при испраќање на сликата.";
  }
  
  Ti.UI.createAlertDialog({title: 'Грешка', message: message}).show();
  clearAllValues();
}

var xhrOnError = function () {
  hideIndicator(androidActivityIndicator);
  Ti.UI.createAlertDialog({title: 'Неуспешно праќање', message: 'Се јавија проблеми при испраќање. Ве молиме обидете се повторно.'}).show();
};


        
var handleErrorActions = function (actions) {
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
  
  if (messageSync.length) {
    var syncAlert = Titanium.UI.createAlertDialog({title: 'Синхронизација', message: 'Потребно е да направите синхронизација со серверот за да ја превземете изменетата листа на ' + messageSync.join(" и ") + '. Дали сакате синхронизацијата да започне?', buttonNames: ['Да', 'Не']});
    syncAlert.addEventListener("click",function (e) {
      if (e.index == 0) {
        var count = 0;
  
        var syncFlash = function () {
          flash("Успешно се синхронизирани категориите и општините со серверот.");
        }
        
        if (categorySync) {
          syncCategories(function () {
            categoryWebView.html = drawCategoryHtml(); // change category HTML view
            count += 1;
            if (count === messageSync.length) {
              syncFlash();
            }
          });
        }
        
        if (municipalitySync) {
          syncMunicipalities(function () {
            municipalityWebView.html = drawMunicipalityHtml(); // change municipality HTML view
          });
          count += 1;
          if (count === messageSync.length) {
            syncFlash();
          }
        }
      }
    });
    syncAlert.show();
  }
};


// Submit report
Ti.App.addEventListener('submit_form', function (options) {
  if (options.latitude == null) { options.latitude = 0.0; }
  if (options.longitude == null) { options.longitude = 0.0; }

  var jsonData = JSON.stringify({problem: {
    description: descriptionField.value,
    weight: weightSlider.value,
    category_id: categoryValue,
    municipality_id: municipalityValue,
    latitude: options.latitude,
    longitude: options.longitude,
    email: Titanium.App.Properties.getString("email"),
    device_id: Ti.Platform.id
  }});
                               
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = xhrOnError;

  xhr.onload = function () {
    if(this.status == 200) {
      var problem = JSON.parse(this.responseText);
      
      if (problem.status === "ok") {
        if (problem.id && currentMedia) {
          Ti.App.fireEvent('upload_picture', { problem_id: problem.id });
        } else {
          showSuccess();
        }
      } else {
        hideIndicator(androidActivityIndicator);
        handleErrorActions(problem.actions);
        //Ti.UI.createAlertDialog({title: 'Грешка при валидација', message: problem.message}).show();
      }
    } else {
      hideIndicator(androidActivityIndicator);
      Ti.UI.createAlertDialog({title: 'Грешка при пријавување', message: 'Се појави проблем при пријавување на проблемот. Ве молиме обидете се повторно.'}).show();
    }
  };
  
  xhr.open('POST', apiEndpoint + '/problems');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(jsonData);
});

// Upload picture
Ti.App.addEventListener('upload_picture', function (options) {
  if (options.problem_id == null) {
    xhrOnError({ error: 'Недостасува проблем идентификатор' });
    return;
  }

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = xhrOnError;

  xhr.onload = function () {
    var json = JSON.parse(this.responseText);
    
    if (json.status === "ok") {
      showSuccess();
    } else {
      showError(json);
    }
  };
  
  var data = {"_method": "PUT", "photo": currentMedia, device_id: Ti.Platform.id};
  
  xhr.open('PUT', apiEndpoint + '/problems/' + options.problem_id);
  xhr.send(data);
});

function submitReport() {
  descriptionField.blur(); // Drop keyboard
  
  if (Titanium.Network.online == false){
    Titanium.UI.createAlertDialog({title: "Интернет конекција", message: "Не е пронајдена интернет конекција. Ве молиме проверете дали уредот е врзан на интернет."}).show();
  } else if (!descriptionField.value) {
    Ti.UI.createAlertDialog({title: 'Недостасуваат податоци', message: 'Потребно е опис за проблемот да внесете.'}).show();
  } else {
    androidActivityIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам'});
    androidActivityIndicator.show();
    
    if (virtualDevice) {
      // for virtual device
      Ti.App.fireEvent('submit_form', { latitude: 0, longitude: 0 }); // submit event without real latitude and longitude
    } else {
      // for physical device
      Titanium.Geolocation.getCurrentPosition(function (e) {
        if (e.error) {
          hideIndicator(androidActivityIndicator);
          Titanium.UI.createAlertDialog({title: "Локација", message: "Се појави проблем при детектирање на локација. Ве молиме обидете се повторно."}).show();
        } else {
          Ti.App.fireEvent('submit_form', { latitude: e.coords.latitude, longitude: e.coords.longitude });
        }
      });      
    }
  }
}

buildDownMenu();
