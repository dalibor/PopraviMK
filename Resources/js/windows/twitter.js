Ti.include('../p.js');

var win = Titanium.UI.currentWindow;
win.setBackgroundColor('#3F3F3F');

// FUNCTIONS BEGIN

var getTwitterDataRow = function (object, i) {
  var row = Titanium.UI.createTableViewRow({
    bottom: 5,
    height: 'auto',
    leftImage: object.profile_image_url,
    className: 'tweet',
    layout: 'vertical'
  });

  var screenNameLabel = Ti.UI.createLabel({
    left: 57,
    height: 20,
    text: object.screen_name,
    color: '#FFF',
    font: {fontFamily: 'Helvetica Neue', fontSize: 15, fontWeight: 'bold'}
  });

  var commentLabel = Ti.UI.createLabel({
    autoLink: Ti.UI.Android.LINKIFY_ALL,
    top: 5, left: 57, right: 5,
    color: '#AEAEB0',
    font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'normal'},
    text: object.text
  });

  var dateLabel = Ti.UI.createLabel({
    top: 5, left: 57,
    height: 20,
    color: '#999',
    font: {fontFamily: 'Helvetica Neue', fontSize: 13, fontWeight: 'normal'},
    text: P.time.time_ago_in_words_with_parsing(object.created_at + "")
  });

  row.add(screenNameLabel);
  row.add(commentLabel);
  row.add(dateLabel);

  return row;
};

var showOfficialNews = function (callback) {
  var url = 'http://twitter.com/statuses/user_timeline/PopraviMK.json';

  P.http.getJSON(url, function (json) {
    if (json && json.length) {
      var tableData = [];

      for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        tableData.push(getTwitterDataRow({
          profile_image_url: tweet.user.profile_image_url,
          screen_name: tweet.user.screen_name,
          text: tweet.text,
          created_at: tweet.created_at
        }));
      }

      callback(tableData);
    } else {
      callback([]);
    }
  });
};


var showHashNews = function (callback) {
  var url = 'http://search.twitter.com/search.json?q=popravimk';

  P.http.getJSON(url, function (json) {
    if (json && json.results && json.results.length) {
      var tableData = [];

      for (var i = 0; i < json.results.length; i++) {
        var tweet = json.results[i];
        tableData.push(getTwitterDataRow({
          profile_image_url: tweet.profile_image_url,
          screen_name: tweet.from_user,
          text: tweet.text,
          created_at: tweet.created_at
        }));
      };

      callback(tableData);
    } else {
      callback([]);
    }
  });
};




// FUNCTIONS END


var officialNewsTable = Titanium.UI.createTableView({
  data: [],
  visible: false
});
win.add(officialNewsTable);
var hashNewsTable = Titanium.UI.createTableView({
  data: [],
  visible: false
});
win.add(hashNewsTable);
var noNewsLabel = Ti.UI.createLabel({
  text: "Нема новости",
  color: '#AEAEB0',
  font: {fontSize: 14, fontWeight: 'normal'},
  visible: false
});
win.add(noNewsLabel);

var resetViews = function () {
  noNewsLabel.hide();
  officialNewsTable.hide();
  hashNewsTable.hide();

  // remove Data from tables
  officialNewsTable.setData([]);
  hashNewsTable.setData([]);
};

// EVENTS BEGIN
Ti.App.addEventListener('show_official_news', function (data) {
  resetViews();
  showOfficialNews(function (tableData) {
    if (tableData.length) {
      officialNewsTable.setData(tableData);
      officialNewsTable.show();
    } else {
      noNewsLabel.show();
    }
  });
});

Ti.App.addEventListener('show_hash_news', function (data) {
  resetViews();
  showHashNews(function (tableData) {
    if (tableData.length) {
      hashNewsTable.setData(tableData);
      hashNewsTable.show();
    } else {
      noNewsLabel.show();
    }
  });
});
// EVENTS END


Ti.App.fireEvent('show_official_news');


// OPTIONS MENU BEGIN
var activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = function (e) {
  var menu = e.menu;

  var officialNewsMenuItem = menu.add({title: '@PopraviMK'});
  officialNewsMenuItem.addEventListener('click', function () {
    Ti.App.fireEvent('show_official_news');
  });

  var hashNewsMenuItem = menu.add({title: '#PopraviMK'});
  hashNewsMenuItem.addEventListener('click', function () {
    Ti.App.fireEvent('show_hash_news');
  });
};
// OPTIONS MENU END
