Titanium.UI.setBackgroundColor('#3F3F3F');

var tabGroup = Titanium.UI.createTabGroup({height: 60});

var reportWindow = Titanium.UI.createWindow({title: 'Пријави', url: 'js/windows/problems_new.js'});
var reportTab = Titanium.UI.createTab({icon: 'images/tabs/icon-new.png', title: 'ПРИЈАВИ', window: reportWindow});

var reportsWindow = Titanium.UI.createWindow({title:'Преглед', url: 'js/windows/problems_index.js'});
var reportsTab = Titanium.UI.createTab({icon: 'images/tabs/icon-list.png', title: 'ПРЕГЛЕД', window: reportsWindow});

var twitterWindow = Titanium.UI.createWindow({title:'Новости', url: 'js/windows/twitter.js'});
var twitterTab = Titanium.UI.createTab({icon: 'images/tabs/icon-news.png', title: 'НОВОСТИ', window: twitterWindow});

tabGroup.addTab(reportTab);
tabGroup.addTab(reportsTab);
tabGroup.addTab(twitterTab);

tabGroup.open();
