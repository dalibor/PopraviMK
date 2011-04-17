Ti.include('../p.js');

var win = Ti.UI.currentWindow;
var cookie = null;

// VIEWS BEGIN
var scrollView = Ti.UI.createScrollView({
  top: 25, 
  contentWidth: "auto", 
  contentHeight: "auto", 
  showVerticalScrollIndicator: true, 
  backgroundColor: '#3F3F3F'
});

  var loginFormView = Ti.UI.createView({
    top: 10, left: 10, 
    width: 300, height: 250, 
    backgroundColor: '#1B1C1E', 
    borderRadius: 6,
    layout: 'vertical'
  });
  var FormTitle = Ti.UI.createLabel({
    top: 5,
    width: 300, height: 30,
    text: 'Најавување',
    color: '#fff',
    textAlign:'center',
    font: {fontSize: 20, fontWeight: 'bold'}
  });

  var emailLabel = Ti.UI.createLabel({
    left: 10, top: 10,
    width: 300, height: 30,
    text: 'Email',
    color: '#fff',
    font: {fontSize: 18}
  });
  var emailField = Ti.UI.createTextField({
    height: 35, width: 280, 
    color: '#787878', 
    hintText: 'Email', 
    autocorrect: false,
    value: Ti.App.Properties.getString('email'),
    //keyboardType: Ti.UI.KEYBOARD_EMAIL, 
    returnKeyType: Ti.UI.RETURNKEY_DEFAULT, 
    borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED //passwordMask: true
  });

  var passwordLabel = Ti.UI.createLabel({
    left: 10,
    width: 300, height: 30,
    text: "Лозинка",
    color: '#fff',
    font: {fontSize: 18}
  });
  var passwordField = Ti.UI.createTextField({
    height: 35, width: 280,
    color: '#787878',
    autocorrect: false,
    //keyboardType: Ti.UI.KEYBOARD_EMAIL, 
    returnKeyType: Ti.UI.RETURNKEY_DEFAULT, 
    borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
    passwordMask: true
  });

  var buttonsView = Ti.UI.createView({
    left: 25,
    height: 50, width: 250
  });
    var saveButton = Ti.UI.createButton({
      left: 130,
      width: 120, height: 40,
      title: "Најави ме",
      backgroundImage: '../../images/buttons/button-off.png',
      backgroundSelectedImage: '../../images/buttons/button-on.png',
      font: {fontSize: 17, fontWeight: 'bold'},
      color: "#FFFFFF"
    });

// VIEWS END


// STRUCTURE BEGIN
    loginFormView.add(FormTitle);
    loginFormView.add(emailLabel);
    loginFormView.add(emailField);
    loginFormView.add(passwordLabel);
    loginFormView.add(passwordField);
      buttonsView.add(saveButton);
    loginFormView.add(buttonsView);
  scrollView.add(loginFormView);
win.add(scrollView);
// STRUCTURE END


// EVENTS BEGIN
emailField.addEventListener('return', function () {
  emailField.blur();
});

passwordField.addEventListener('return', function () {
  passwordField.blur();
});

saveButton.addEventListener("click", function (e) {
  uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам податоци'});
  uploadIndicator.show();

  var successCallback = function () {
    win.close();
  };

  P.http.login(successCallback);
});
// EVENTS END
