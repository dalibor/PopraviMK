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
        db.execute('INSERT INTO "categories" ("web_id", "name") VALUES (' + category.id + ',"' + category.name + '");');
      };

      callback();
    }
  });
};

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
        db.execute('INSERT INTO "municipalities" ("web_id", "name") VALUES (' + municipality.id + ',"' + municipality.name + '");');
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

P.http.getProblems = function (url, table) {
  P.http.getJSON(url, function (json) {
    table.initialized = true;
    table.setData(P.UI.buildProblemsTableData(json));
  });
};

/*
 * Gets nearest problems from the API
 */
P.http.showNearestProblems = function (table) {
  if (P.config.virtualDevice) {
    // on virtual device use hard-coded the location
    var url = P.config.apiEndpoint + '/problems.json?type=nearest&' +
      'longitude=' + 21.46385 + "&latitude=" + 42.038033;
    P.http.getProblems(url, table);
  } else {
    Titanium.Geolocation.getCurrentPosition(function (e) {
      if (e.error) {
        P.UI.geolocationProblem();
      } else {
        var url = P.config.apiEndpoint + '/problems.json?type=nearest&' +
          'longitude=' + e.coords.longitude + '&latitude=' + e.coords.latitude;
        P.http.getProblems(url, table);
      }
    });
  }
};


/*
 * Gets latest problems from the API
 */
P.http.showLatestProblems = function (table) {
  var url = P.config.apiEndpoint + '/problems.json?type=latest';
  P.http.getProblems(url, table);
};


/*
 * Gets my problems from the API
 */
P.http.showMyProblems = function (table) {
  var url = P.config.apiEndpoint + '/problems.json?type=my&device_id=' + Ti.Platform.id;
  P.http.getProblems(url, table);
};


P.http.showProfileTweets = function (table, noNewsLabel) {
  var url = 'http://twitter.com/statuses/user_timeline/PopraviMK.json';

  P.http.getJSON(url, function (json) {
    if (json && json.length) {
      noNewsLabel.hide();

      var tableData = [];
      for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        tableData.push(P.UI.getTwitterDataRow({
          profile_image_url: tweet.user.profile_image_url,
          screen_name: tweet.user.screen_name,
          text: tweet.text,
          created_at: tweet.created_at
        }));
      }

      table.setData(tableData);
    }
  });
};


P.http.showSearchTweets = function (tweetsTable, noNewsLabel) {
  tweetsTable.setData([]);
  var url = 'http://search.twitter.com/search.json?q=popravimk';
  P.http.getJSON(url, function (json) {
    if (json && json.results && json.results.length) {
      noNewsLabel.hide();

      var tableData = [];
      for (var i = 0; i < json.results.length; i++) {
        var tweet = json.results[i];
        tableData.push(P.UI.getTwitterDataRow({
          profile_image_url: tweet.profile_image_url,
          screen_name: tweet.from_user,
          text: tweet.text,
          created_at: tweet.created_at
        }));
      };

      tweetsTable.setData(tableData);
    } else {
      P.http.showProfileTweets(tweetsTable, noNewsLabel); // get only tweets from profile
    }
  });
};
