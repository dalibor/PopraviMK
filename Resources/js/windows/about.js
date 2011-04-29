var win = Ti.UI.currentWindow;
win.setBackgroundColor('#3F3F3F');

var infoLabel = Ti.UI.createLabel({
  top: 25, bottom: 10,
  left: 5, right: 5,
  autoLink: Ti.UI.Android.LINKIFY_ALL,
  color: '#EEE',
  font: {fontFamily: 'Helvetica Neue', fontSize: 14, fontWeight: 'normal'},
  text: [
    "PopraviMK е сервис кој им овозможува на граѓаните да помогнат во откривање на проблеми настанати на јавна површина.",
    "Со споделување на урбаните проблеми граѓаните им помагаат на општините побрзо и поефикасно да ги отстранат истите.",
    "Проблемите се пријавуваат така што се испраќа опис, тежина, категорија, општина и географска локација од проблемот, како и слика за истиот.",
    "Сервисот е наменет да им користи и на општините. Тие можат да ги лоцираат проблемите на мапа и со активираниот GPS да добијат насока на движење од местото каде што се наоѓаат до местото од каде е пријавен проблемот. Исто така тие можат да менуваат статус на проблемите и да ги информираат граѓаните преку официјални соопштенија за истите.",
    "Покрај мобилнава апликација, PopraviMK постои и како веб апликација http://popravi.mk каде граѓаните исто така можат пријавуваат и прегледуваат проблеми."
  ].join("\n\n")
});

var scrollView = Ti.UI.createScrollView({
  top: 5, bottom: 5,
  left: 5,
  contentWidth: "auto", contentHeight: "auto",
  showVerticalScrollIndicator: true
});
scrollView.add(infoLabel);

win.add(scrollView);

