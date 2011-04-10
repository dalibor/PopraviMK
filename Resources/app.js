Titanium.UI.setBackgroundColor('#3F3F3F');

var tabGroup = Titanium.UI.createTabGroup({
  height: 60
});

// tab 1: report a problem tab
var reportProblemWindow = Titanium.UI.createWindow({
  title: 'Пријави', 
  url: 'js/windows/problems_new.js'
});
var reportProblemTab = Titanium.UI.createTab({
  title: 'ПРИЈАВИ', 
  icon: 'images/tabs/icon-new.png', 
  window: reportProblemWindow
});
tabGroup.addTab(reportProblemTab);

// tab 1: view problem reports tab
var viewReportsWindow = Titanium.UI.createWindow({
  title: 'Преглед', 
  url: 'js/windows/problems_index.js'
});
var viewReportsTab = Titanium.UI.createTab({
  title: 'ПРЕГЛЕД', 
  icon: 'images/tabs/icon-list.png', 
  window: viewReportsWindow
});
tabGroup.addTab(viewReportsTab);

var twitterNewsWindow = Titanium.UI.createWindow({
  title: 'Новости', 
  url: 'js/windows/twitter.js'
});
var twitterNewsTab = Titanium.UI.createTab({
  title: 'НОВОСТИ', 
  icon: 'images/tabs/icon-news.png', 
  window: twitterNewsWindow
});
tabGroup.addTab(twitterNewsTab);

tabGroup.open();
