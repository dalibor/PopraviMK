Titanium.include('../helpers/shared.js');

var win = Titanium.UI.currentWindow;
var scrollView = Ti.UI.createScrollView({top: 0, contentWidth: "auto", contentHeight: "auto", showVerticalScrollIndicator: true});

var contentView = Ti.UI.createView({height: 'auto', layout: 'vertical', top: 2});

var titleView = Ti.UI.createView({top: 4})
var titleLabel = Ti.UI.createLabel({color: '#FFF', font: {fontSize: 15, fontWeight: 'bold'}, height: 'auto', width: 300, bottom: 4, text: win.params.title});
titleView.add(titleLabel)
contentView.add(titleView);

var photoView = Titanium.UI.createImageView({url: win.params.photo, width: 300, height: 300});
contentView.add(photoView);

var subtitleView = Ti.UI.createView({top: 10})
var subtitleLabel = Ti.UI.createLabel({color: '#AEAEB0', font: {fontSize: 14}, height: 'auto', width: 300, bottom: 4, text: win.params.subtitle});
subtitleView.add(subtitleLabel)
contentView.add(subtitleView);

var shareTitleView = Ti.UI.createView({top: 4})
var shareTitleLabel = Ti.UI.createLabel({color: '#FFF', font: {fontSize: 13}, height: 'auto', width: 300, bottom: 4, text: "Сподели линк од проблемот:"});
shareTitleView.add(shareTitleLabel)
contentView.add(shareTitleView);

var shareView = Ti.UI.createView({top: 5, width: 120, height: 55})
var twitterButton = Titanium.UI.createButton({width: 50, height: 50, left:0, bottom: 5, backgroundImage: '../../images/buttons/twitter.png', backgroundSelectedImage: '../../images/buttons/twitter.png'});
twitterButton.addEventListener("click", function (e) {
  var url = "http://twitter.com/home/?status=" + encodeURIComponent("Пријавив нов проблем на PopraviMK: " + win.params.url + " #popravimk");
  Ti.Platform.openURL(url);
});
shareView.add(twitterButton)

var facebookButton = Titanium.UI.createButton({width: 50, height: 50, left: 70, bottom: 5, backgroundImage: '../../images/buttons/facebook.png', backgroundSelectedImage: '../../images/buttons/facebook.png'});
facebookButton.addEventListener("click", function (e) {
  var url = "http://www.facebook.com/share.php?u=" + encodeURIComponent(win.params.url) + "&t=" + encodeURIComponent("Пријавив нов проблем на PopraviMK");
  Ti.Platform.openURL(url);
});
shareView.add(facebookButton)

contentView.add(shareView)

scrollView.add(contentView);
win.add(scrollView);
