P.user = {};

P.user.loggedIn = function () {
  var cookie = Ti.App.Properties.getString("cookie");
  var loggedIn = cookie !== null && cookie !== '';
  return loggedIn;
};

P.user.email = function () {
  return Titanium.App.Properties.getString("email");
};
