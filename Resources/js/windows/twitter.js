Ti.include('../p.js');

var win = Titanium.UI.currentWindow;
win.setBackgroundColor('#3F3F3F');

var getRowData = function (object, i) {
  var row = Titanium.UI.createTableViewRow({
    bottom: 5,
    height: 'auto',
    leftImage: object.profile_image_url,
    layout: "vertical"
  });

  var screenNameLabel = Ti.UI.createLabel({
    left: 57, 
    height: 20, 
    text: object.screen_name,
    color: '#FFF',
    font: {fontSize: 15, fontWeight: 'bold'}
  });

  var commentLabel = Ti.UI.createLabel({
    top: 5, left: 57, right: 5,
    color: '#AEAEB0',
    font: {fontSize: 14, fontWeight: 'normal'},
    text: object.text
  });
  
  var dateLabel = Ti.UI.createLabel({
    top: 5, left: 57, 
    height: 20, 
    color: '#999', 
    font: {fontSize: 13, fontWeight: 'normal'}, 
    text: P.time.time_ago_in_words_with_parsing(object.created_at + "")
  });

  row.add(screenNameLabel);
  row.add(commentLabel);
  row.add(dateLabel);

  row.className = "item"
  //row.className = "item" + i; // hack
  return row;
}

var getProfileTweets = function (tweetsTable) {
  var url = 'http://twitter.com/statuses/user_timeline/PopraviMK.json';
  P.http.getJSON(url, function (json) {
    if (json && json.length) {
      no_news.hide();

      var data = [];
      for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        data[i] = getRowData({
          profile_image_url: tweet.user.profile_image_url,
          screen_name: tweet.user.screen_name,
          text: tweet.text,
          created_at: tweet.created_at
        });
      }
      
      tweetsTable.setData = data;
      tweetsTable.data = data;
    }
  }); 
}

var getSearchTweets = function (tweetsTable) {
  tweetsTable.setData = [];
  tweetsTable.data = [];
  var url = 'http://search.twitter.com/search.json?q=popravimk';
  P.http.getJSON(url, function (json) {
    if (json && json.results && json.results.length) {
      no_news.hide();

      var data = [];
      for (var i = 0; i < json.results.length; i++) {
        var tweet = json.results[i];
        data[i] = getRowData({
          profile_image_url: tweet.profile_image_url,
          screen_name: tweet.from_user,
          text: tweet.text,
          created_at: tweet.created_at
        });
      }

      tweetsTable.setData = data;
      tweetsTable.data = data;
    } else {
      getProfileTweets(tweetsTable); // get only tweets from profile
    }
  }); 
}

var tweetsTable = Titanium.UI.createTableView({
  top: 30,
  data: []
});
win.add(tweetsTable);

var no_news = Ti.UI.createLabel({
  text: "Нема новости",
  color: '#AEAEB0',
  font: {fontSize: 14, fontWeight: 'normal'},
  visible: false
});
win.add(no_news);


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
  url: '../../images/icons/refresh.png'
});
refreshImageView.addEventListener("click", function (e) {
  getSearchTweets(tweetsTable);
});
header.add(refreshImageView);
win.add(header);

getSearchTweets(tweetsTable)

P.UI.buildMenu();
