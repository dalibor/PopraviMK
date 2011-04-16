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

  var payload = JSON.stringify({
    email: emailField.value, 
    password: passwordField.value
  });

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = P.UI.xhrError;

  xhr.onload = function () {
    uploadIndicator.hide();

    if (this.status == 200) {
      var response = JSON.parse(this.responseText);
      if (response.status === 'ok') {
        Ti.App.Properties.setString("cookie", this.getResponseHeader('Set-Cookie'));
        win.close();
        //Ti.App.fireEvent('reload_app')
        //Ti.App.addEventListener('reload_app', function (options) {
          //createTabs();
        //});
      } else {
        P.UI.loginError(response.message);
      }
    } else {
      P.UI.generalError();
    }
  };

  // NOTE: DEBUG
  //Ti.App.Properties.setString("cookie", "_popravi.mk_session=BAh7ByIPc2Vzc2lvbl9pZCIlYTYzODM0MGVjZWU1ODU1NTlhOWU4MGEwMDRlNmIyNjMiDHVzZXJfaWRpVg==--5653024a8388b7561e5eee0a6d84143ab16753fd");

  xhr.open('POST', P.config.apiEndpoint + '/session');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  // NOTE: Titanium can't set cookie on the second request
  // xhr.setRequestHeader('Cookie', 'something') will works the first time
  // but after a successful response from server with a 'Set-Cookie' header,
  // Titanium can't remove this cookie
  xhr.setRequestHeader('Cookie', Ti.App.Properties.getString("cookie"));

  xhr.send(payload);
});
// EVENTS END
