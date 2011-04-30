Ti.include('../p.js');

var win = Titanium.UI.currentWindow;
win.setBackgroundColor('#3F3F3F');


// BODY BEGIN
var tweetsTable = Titanium.UI.createTableView({
  top: 30,
  data: []
});
win.add(tweetsTable);

var noNewsLabel = Ti.UI.createLabel({
  text: "Нема новости",
  color: '#AEAEB0',
  font: {fontSize: 14, fontWeight: 'normal'},
  visible: false
});
win.add(noNewsLabel);
// BODY END


// HEADER BEGIN
var header = Ti.UI.createView({
  top: 0, left: 0,
  height: 30
});

var latestNews = Titanium.UI.createLabel({
  top: 5, left: 5,
  height: 20, width: 250,
  text: 'Последни новости за PopraviMK',
  color: "#FFF",
  font: {fontSize: 14}
});
header.add(latestNews);

var refreshImageView = Titanium.UI.createImageView({
  top: 8, right: 10,
  width: 16, height: 16,
  image: '../../images/icons/refresh.png'
});
header.add(refreshImageView);

// header events
refreshImageView.addEventListener("click", function (e) {
  P.http.showSearchTweets(tweetsTable, noNewsLabel);
});
win.add(header);
// HEADER BEGIN


P.http.showSearchTweets(tweetsTable, noNewsLabel)
P.UI.createOptionsMenu();
