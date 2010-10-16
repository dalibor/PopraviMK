Titanium.include('../helpers/config.js');
Titanium.include('../helpers/shared.js');

var win = Ti.UI.currentWindow;

var scrollView = Ti.UI.createScrollView({top: 0, contentWidth: "auto", contentHeight: "auto", showVerticalScrollIndicator: true, backgroundColor: '#3F3F3F'});

var welcomeView = Ti.UI.createView({top: 10, left: 10, width: 300, height: 100, backgroundColor: '#333', borderRadius: 6});
var welcomeTitleLabel = Ti.UI.createLabel({top: 5, left: 10, width: 300, height: 30, color: '#fff', font: {fontSize: 18, fontWeight: 'bold'}, text: "Добредојдовте"});
welcomeView.add(welcomeTitleLabel);

var welcomeDescriptionLabel = Ti.UI.createLabel({top: 40, left: 10, width: 280, height: 50, color: '#EEE', font: {fontSize: 13, fontWeight: 'normal'}, 
  text: 'Ви благодариме за инсталирање на PopraviMK и откривање на проблемите настанати на јавна површина.'
});
welcomeView.add(welcomeDescriptionLabel);

scrollView.add(welcomeView);

var emailView = Ti.UI.createView({top: 125, left: 10, width: 300, height: 250, backgroundColor: '#1B1C1E', borderRadius: 6});
var emailTitleLabel = Ti.UI.createLabel({top: 5, left: 10, width: 300, height: 30, color: '#fff', font: {fontSize: 18, fontWeight: 'bold'}, text: 'Електронска пошта'});
emailView.add(emailTitleLabel);

var emailDescriptionLabel = Ti.UI.createLabel({top: 40, left: 10, width: 280, height: 110, color: '#EEE', font: {fontSize: 13, fontWeight: 'normal'}, 
  text: 'Проблеми може да пријавувате анонимно или со ваша адреса за електронска пошта. Доколку се идентификувате и подоцна регистрирате со истата адреса на веб апликацијата од овој сервис, ќе можете од таму да ги изменувате вашите пријавени проблеми.'
});
emailView.add(emailDescriptionLabel);
var emailField = Titanium.UI.createTextField({color: '#787878', value: Titanium.App.Properties.getString("email"), height: 35, top: 160, width: 280, hintText: 'E-mail', autocorrect: false,
keyboardType: Titanium.UI.KEYBOARD_EMAIL, returnKeyType: Titanium.UI.RETURNKEY_DEFAULT, borderStyle: Titanium.UI.INPUT_BORDERSTYLE_ROUNDED //passwordMask: true
});   
emailField.addEventListener('return', function () {
  emailField.blur();
});
emailField.addEventListener('change', function (e) {
  emailVal = e.value;
});
emailView.add(emailField);


var buttonsView = Ti.UI.createView({height: 50, width: 250, top: 195, left: 25});

var resetButton = Titanium.UI.createButton({left: 0, backgroundImage: '../../images/buttons/button-off.png', backgroundSelectedImage: '../../images/buttons/button-on.png', width: 120, height: 40, title: "Анонимно", font: {fontSize: 17, fontWeight: 'bold'}, color: "#FFFFFF"});
resetButton.addEventListener("click", function (e) {
  emailField.value = "";
  Titanium.App.Properties.setString("anonymous", "1");
  Titanium.App.Properties.setString("email", "");
  win.close()
});
buttonsView.add(resetButton);

var saveButton = Titanium.UI.createButton({left: 130, backgroundImage: '../../images/buttons/button-off.png', backgroundSelectedImage: '../../images/buttons/button-on.png', width: 120, height: 40, title: "Сними", font: {fontSize: 17, fontWeight: 'bold'}, color: "#FFFFFF"});
saveButton.addEventListener("click", function (e) {
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if(reg.test(emailVal) === true) {
    Titanium.App.Properties.setString("anonymous", "");
    Titanium.App.Properties.setString("email", emailVal);
    win.close()
   } else {
      Ti.UI.createAlertDialog({title: 'Невалидна адреса', message: 'Форматот на внесената адреса не е валиден.'}).show();
   }
});
buttonsView.add(saveButton);

emailView.add(buttonsView);
scrollView.add(emailView);

win.add(scrollView)
