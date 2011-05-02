Ti.include('../p.js');

var win = Ti.UI.currentWindow;

var scrollView = Ti.UI.createScrollView({
  top: 25,
  contentWidth: 'auto',
  contentHeight: 'auto',
  showVerticalScrollIndicator: true,
  backgroundColor: '#3F3F3F'
});
  var userView = Ti.UI.createView({
    top: 10, left: 10,
    width: 300, height: 215,
    backgroundColor: '#1B1C1E',
    borderRadius: 6,
    layout: 'vertical'
  });
    var nameLabel = Ti.UI.createLabel({
      top: 5, left: 10,
      width: 300, height: 25,
      color: '#fff',
      font: {fontSize: 18, fontWeight: 'bold'},
      text: 'Име'
    });
    userView.add(nameLabel);
    var nameField = Ti.UI.createTextField({
      top: 5, 
      height: 40, width: 280, 
      color: '#787878', 
      value: Ti.App.Properties.getString('name'), 
      hintText: 'Име', 
      autocorrect: false,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT, 
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    userView.add(nameField);

    var emailLabel = Ti.UI.createLabel({
      top: 5, left: 10,
      width: 300, height: 25,
      color: '#fff',
      font: {fontSize: 18, fontWeight: 'bold'},
      text: 'Email'
    });
    userView.add(emailLabel);
    var emailField = Ti.UI.createTextField({
      top: 5, 
      height: 40, width: 280, 
      color: '#787878', 
      value: Ti.App.Properties.getString('email'), 
      hintText: 'E-mail', 
      autocorrect: false,
      keyboardType: Ti.UI.KEYBOARD_EMAIL, 
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT, 
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    userView.add(emailField);

  var buttonsView = Ti.UI.createView({
    top: 5, left: 25,
    height: 50, width: 250
  });
    var resetButton = Ti.UI.createButton({
      left: 0, 
      width: 120, height: 40, 
      backgroundImage: '../../images/buttons/yellow_off.png', 
      backgroundSelectedImage: '../../images/buttons/yellow_on.png', 
      title: "Анонимно", 
      font: {fontSize: 17, fontWeight: 'bold'}, 
      color: "#FFFFFF"
    });
    buttonsView.add(resetButton);
    var saveButton = Ti.UI.createButton({
      left: 130, 
      width: 120, height: 40,
      backgroundImage: '../../images/buttons/green_off.png', 
      backgroundSelectedImage: '../../images/buttons/green_on.png', 
      title: "Сними", 
      font: {fontSize: 17, fontWeight: 'bold'}, 
      color: "#FFFFFF"
    });
    buttonsView.add(saveButton);

  userView.add(buttonsView);
  scrollView.add(userView);


  var descriptionView = Ti.UI.createView({
    top: 240, left: 10, bottom: 10,
    width: 300, height: 'auto',
    backgroundColor: '#333',
    borderRadius: 6,
    layout: 'vertical'
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
      top: 5, left: 10,
      width: 280,
      color: '#EEE',
      font: {fontSize: 14, fontWeight: 'normal'},
      text: 'Проблеми може да пријавувате анонимно или со email адреса за идентификација. \n\nДоколку се идентификувате со email адреса и на веб апликацијата се регистрирате или сте регистрирани со истата, ќе можете од таму да ги изменувате пријавените проблеми. \n\nИмето се користи во приказот кај коментарите.'
    });
    descriptionView.add(descriptionLabel);

scrollView.add(descriptionView);
win.add(scrollView)


// EVENTS BEGIN
resetButton.addEventListener("click", function (e) {
  nameField.value = "";
  emailField.value = "";
  Ti.App.Properties.setString("name", "");
  Ti.App.Properties.setString("email", "");
  nameField.blur();
  emailField.blur();
  P.UI.flash("Успешно е поставено да пријавувате проблеми анонимно.");
});
saveButton.addEventListener("click", function (e) {
  if (P.utility.emailRegExp.test(emailField.value) === true) {
    Ti.App.Properties.setString("name", nameField.value);
    Ti.App.Properties.setString("email", emailField.value);
    nameField.blur();
    emailField.blur();
    P.UI.flash("Вашите податоци се запишани.");
  } else {
    P.UI.flash('Форматот на внесената email адреса не е валиден.');
  }
});
// EVENTS END
