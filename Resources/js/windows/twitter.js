Titanium.include('../helpers/shared.js');

var windowBackgroundColor = '#3F3F3F';
var win = Titanium.UI.currentWindow;
win.setBackgroundColor(windowBackgroundColor);

var header = Ti.UI.createView({height: 30, top: 0, left: 0});

var latestNews = Titanium.UI.createLabel({text: 'Последни новости за PopraviMK', color: "#FFF", font: {fontSize: 14}, left: 5, top: 5, height: 20, width: 250 });
header.add(latestNews);

var refreshImageView = Titanium.UI.createImageView({url: '../../images/icons/refresh.png', width: 16, height: 16, top: 8, right: 10});
refreshImageView.addEventListener("click", function (e) {
  refreshTweets();
});
header.add(refreshImageView);

win.add(header);

var getTweetsData = function (tweets) {
  var rowData = [];
  
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    
    var row = Titanium.UI.createTableViewRow({height: 'auto'});
    var post_view = Titanium.UI.createView({height: 'auto', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#1B1C1E"});
    
    var photo = Titanium.UI.createImageView({url: tweet.profile_image_url, top: 4, left: 4, width: 48, height: 48});
    post_view.add(photo);

    var contentView = Ti.UI.createView({height: 'auto', layout: 'vertical', top: 0, left: 57});

    var screen_name = Ti.UI.createLabel({color: '#FFF', font: {fontSize: 15,fontWeight: 'bold'}, height: 'auto', left: 0, text: tweet.from_user});
    contentView.add(screen_name);

    var comment = Ti.UI.createLabel({color: '#AEAEB0', font: {fontSize: 14,fontWeight: 'normal'}, height: 'auto', left: 0, right: 5, text: tweet.text});
    contentView.add(comment);
    
    var dateView = Ti.UI.createView({height: 'auto', top: 5, left:0, width: '230', height: 25});
    var date = Ti.UI.createLabel({color: '#999', font: {fontSize: 13,fontWeight: 'normal'}, height: 'auto', left: 0, text: DateHelper.time_ago_in_words_with_parsing(tweet.created_at+"")});
    dateView.add(date)
    contentView.add(dateView);
    
    post_view.add(contentView)
    row.add(post_view);

    row.className = "item"+i;

    rowData[i] = row;
  }
  
  return rowData
}

var refreshTweets = function () {
  tweetsTable.setData = [];
  tweetsTable.data = [];
  no_news.hide();
  getJSON('http://search.twitter.com/search.json?q=popravimk', function (json) {
    if (json && json.results && json.results.length) {
      var data = getTweetsData(json.results);
      tweetsTable.setData = data;
      tweetsTable.data = data;
    } else {
      no_news.show()
    }
  }); 
}

var tweetsTable = Titanium.UI.createTableView({data: [], top: 30});
win.add(tweetsTable);

var no_news = Ti.UI.createLabel({color: '#AEAEB0', font: {fontSize: 14, fontWeight: 'normal'}, text: "Нема новости", visible: false});
win.add(no_news);


refreshTweets()

buildDownMenu();
