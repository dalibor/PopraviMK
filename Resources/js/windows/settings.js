Ti.include('../p.js');

var win = Ti.UI.currentWindow;

var scrollView = Ti.UI.createScrollView({
  top: 25,
  contentWidth: 'auto',
  contentHeight: 'auto',
  showVerticalScrollIndicator: true,
  backgroundColor: '#3F3F3F'
});
  var emailView = Ti.UI.createView({
    top: 10, left: 10,
    width: 300, height: 140,
    backgroundColor: '#1B1C1E',
    borderRadius: 6,
    layout: 'vertical'
  });
    var emailLabel = Ti.UI.createLabel({
      top: 5, left: 10,
      width: 300, height: 30,
      color: '#fff',
      font: {fontSize: 18, fontWeight: 'bold'},
      text: 'Email'
    });
    emailView.add(emailLabel);
    var emailField = Ti.UI.createTextField({
      top: 10, 
      height: 35, width: 280, 
      color: '#787878', 
      value: Ti.App.Properties.getString('email'), 
      hintText: 'E-mail', 
      autocorrect: false,
      keyboardType: Ti.UI.KEYBOARD_EMAIL, 
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT, 
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    emailView.add(emailField);

  var buttonsView = Ti.UI.createView({
    top: 5, left: 25,
    height: 50, width: 250
  });
    var resetButton = Ti.UI.createButton({
      left: 0, 
      width: 120, height: 40, 
      backgroundImage: '../../images/buttons/button-off.png', 
      backgroundSelectedImage: '../../images/buttons/button-on.png', 
      title: "Анонимно", 
      font: {fontSize: 17, fontWeight: 'bold'}, 
      color: "#FFFFFF"
    });
    buttonsView.add(resetButton);
    var saveButton = Ti.UI.createButton({
      left: 130, 
      width: 120, height: 40,
      backgroundImage: '../../images/buttons/button-off.png', 
      backgroundSelectedImage: '../../images/buttons/button-on.png', 
      title: "Сними", 
      font: {fontSize: 17, fontWeight: 'bold'}, 
      color: "#FFFFFF"
    });
    buttonsView.add(saveButton);

  emailView.add(buttonsView);
  scrollView.add(emailView);


  var descriptionView = Ti.UI.createView({
    top: 170, left: 10, bottom: 10,
    width: 300, height: 145,
    backgroundColor: '#333',
    borderRadius: 6
  });
    var descriptionTitleLabel = Ti.UI.createLabel({
      top: 5, left: 10,
      width: 300, height: 30,
      color: '#fff',
      font: {fontSize: 18, fontWeight: 'bold'},
      text: "Упатство"
    });
    descriptionView.add(descriptionTitleLabel);

    var descriptionLabel = Ti.UI.createLabel({
      top: 35, left: 10,
      width: 280, height: 100,
      color: '#EEE',
      font: {fontSize: 13, fontWeight: 'normal'},
      text: 'Проблеми може да пријавувате анонимно или со email идентификатор. Доколку оставите email и на веб апликацијата се регистрирате или сте регистрирани со истиот, ќе можете од таму да ги изменувате пријавените проблеми.'
    });
    descriptionView.add(descriptionLabel);

scrollView.add(descriptionView);
win.add(scrollView)




// EVENTS BEGIN
resetButton.addEventListener("click", function (e) {
  emailField.value = "";
  Ti.App.Properties.setString("email", "");
  P.UI.flash("Успешно е поставено да пријавувате проблеми анонимно.");
});
saveButton.addEventListener("click", function (e) {
  if (P.utility.emailRegExp.test(emailField.value) === true) {
    Ti.App.Properties.setString("email", emailField.value);
    P.UI.flash("Успешно е поставено да пријавувате проблеми со email адреса.");
  } else {
    P.UI.invalidEmail();
  }
});
// EVENTS END
