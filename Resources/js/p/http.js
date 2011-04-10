P.http = {};

/**
 * Synchronizes categories with the server
 * 
 * @param {Function} callback
 */
P.http.syncCategories = function (callback) {
  var url = P.config.apiEndpoint + '/categories.json';
  P.http.getJSON(url, function (categories) {
    if (categories.length) {
      db.execute('DELETE FROM categories;') // remove old categories
      
      // insert new categories
      for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        db.execute('INSERT INTO "categories" ("web_id", "name") VALUES (' + category.id + ',"' + category.name + '");')
      }
      
      callback();             
    }
  });           
}

/**
 * Synchronizes municipalities with the server
 * 
 * @param {Object} callback
 */
P.http.syncMunicipalities = function (callback) {
  var url = P.config.apiEndpoint + '/municipalities.json';
  P.http.getJSON(url, function (municipalities) {
    if (municipalities.length) {
      db.execute('DELETE FROM municipalities;') // remove old municipalities
      
      // insert new municipalities
      for (var i = 0; i < municipalities.length; i++) {
        var municipality = municipalities[i];
        db.execute('INSERT INTO "municipalities" ("web_id", "name") VALUES (' + municipality.id + ',"' + municipality.name + '");')
      }
      
      callback();
    }
  });           
}

P.http.getJSON = function (url, callback) {
  if (Ti.Network.online == false) {
    Ti.UI.createAlertDialog({
      title: "Интернет конекција", 
      message: "Не е пронајдена интернет конекција. Ве молиме проверете дали уредот е врзан на интернет."
    }).show();
  } else {
    var indicator = Ti.UI.createActivityIndicator({message: 'Вчитувам'})
    indicator.show();

    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function () {
      indicator.hide();
      var json = JSON.parse(this.responseText);
      callback(json);
    };
    xhr.onerror = function () {
      indicator.hide();
      Ti.UI.createAlertDialog({
        title: 'Неуспешна конекција до серверот', 
        message: 'Се јави проблем при поврзување со серверот. Ве молиме обидете се подоцна.'
      }).show();
    };
    xhr.open('GET', url);
    xhr.send();
  }
};
