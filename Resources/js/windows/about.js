var win = Ti.UI.currentWindow;

var aboutImage = Ti.UI.createImageView({url: '../../images/bg/bg-dark.png'});
win.add(aboutImage);

Ti.App.addEventListener("openURL", function (e) {
  Ti.Platform.openURL(e.url);
});

var  html = "<html><body style='padding: 10px; font-size:14px;color:#fff;font-family:sans-serif;'>" +
"<p>PopraviMK е сервис кој им овозможува на луѓето да помогнат во откривање на проблеми настанати на јавна површина.</p>" +
"<p>PopraviMK има прилично едноставна идеја. Ние сакаме луѓето јавно да ги споделат сите проблеми со инфраструктурата. Доколку луѓето ги споделат овие проблеми и ја посочат локацијата (на мапа) каде точно се наоѓаат, може да им се помогне на општините побрзо и поефикасно да ги отстранат истите.</p>" +
"<p>Проблемите се пријавуваат така што се испраќа опис, тежина, категорија, општина и локација на проблемот која се зема преку GPS уредот на телефонот, а дополнително се испраќа и слика.</p>" +
"<p>Сервисот е наменет да им користи и на оние кои учествуваат во процесот на отстранување на проблемите, најчесто општините. Тие ќе можат со активираниот GPS на нивниот телефонот да ги лоцираат проблемите на мапа и да добијат насока на движење од местото каде што се наоѓаат до местото од каде е пријавен проблемот.</p>" +
"<p>Покрај мобилнава апликација PopraviMK, независно постои и веб апликација <a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://popravi.mk/'});\" style='color:#EE9200; font-weight:bold;'>popravi.mk</a> од каде луѓето исто така можат да пријавуваат нови или да ги прегледуваат веќе пријавените проблеми.</p>" +
"<p>Апликацијата ја изработија:</p>" +
"<ul>" +
"<li style='padding-bottom: 3px;'><a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://dalibornasevic.com/'});\" style='color:#EE9200; font-weight:bold;'>Далибор Насевиќ</a></li>"+
"<li style='padding-top: 3px;'><a href=\"javascript:Ti.App.fireEvent('openURL',{url:'http://detrimental.com.mk/'});\" style='color:#EE9200; font-weight:bold;'>Диме Пашоски</a></li>"+
"</ul>"

'</body></html>';

var webView = Ti.UI.createWebView({top: 0, left: 0, backgroundColor: 'transparent', html: html});

win.add(webView);
