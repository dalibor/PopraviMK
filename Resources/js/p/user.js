P.user = {};

P.user.loggedIn = function () {
  var cookie = Ti.App.Properties.getString("cookie");
  var loggedIn = cookie !== null && cookie !== '';
  return loggedIn;
};
