P.http = {};

/**
 * Synchronizes categories with the server
 *
 * @param {Function} callback
 */
P.http.syncCategories = function (callback) {
  var url = P.config.apiEndpoint + '/categories.json?api_key=' + P.config.api_key;
  P.http.getJSON(url, function (categories) {
    if (categories.length) {
      P.db.saveCategories(categories);
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
  var url = P.config.apiEndpoint + '/municipalities.json?api_key=' + P.config.api_key;
  P.http.getJSON(url, function (municipalities) {
    if (municipalities.length) {
      P.db.saveMunicipalities(municipalities);
      callback();
    }
  });
};

P.http.sync = function (callback) {
  var count = 0;
  
  P.http.syncCategories(function () {
    count += 1;
    if (count === 2) {
      callback();
    }
  });

  P.http.syncMunicipalities(function () {
    count += 1;
    if (count === 2) {
      callback();
    }
  });
};

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

      if (json.status === 'api_key') {
        P.UI.apiKeyError();
      } else if (json.status === 'access_denied') {
        P.UI.loggedInError();
      } else {
        callback(json);
      }
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

P.http.getProblems = function (url, callback) {
  P.http.getJSON(url, function (json) {
    callback(json);
  });
};

/*
 * Gets nearest problems from the API
 */
P.http.getNearestProblems = function (callback) {
  if (P.config.virtualDevice) {
    // on virtual device use hard-coded the location
    var url = P.config.apiEndpoint + '/problems.json?api_key=' + P.config.api_key +
      '&type=nearest&' + 'longitude=' + 21.46385 + "&latitude=" + 42.038033;
    P.http.getProblems(url, callback);
  } else {
    Titanium.Geolocation.getCurrentPosition(function (e) {
      if (e.error) {
        P.UI.geolocationProblem();
      } else {
        var url = P.config.apiEndpoint + '/problems.json?api_key=' + P.config.api_key +
        '&type=nearest&' + 'longitude=' + e.coords.longitude + '&latitude=' + e.coords.latitude;
        P.http.getProblems(url, callback);
      }
    });
  }
};


/*
 * Gets latest problems from the API
 */
P.http.getLatestProblems = function (table) {
  var url = P.config.apiEndpoint + '/problems.json?api_key=' + P.config.api_key + 
    '&type=latest';
  P.http.getProblems(url, table, 'latest');
};


/*
 * Gets my problems from the API
 */
P.http.getMyProblems = function (table) {
  var url = P.config.apiEndpoint + '/problems.json?api_key=' + P.config.api_key +
    '&type=my&email=' + Titanium.App.Properties.getString("email");
  P.http.getProblems(url, table, 'my');
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


P.http.createProblem = function (params, successCallback, errorCallback, errorHandler) {
  if (params.latitude == null) { params.latitude = 0.0; }
  if (params.longitude == null) { params.longitude = 0.0; }

  // in previous Titanium versions this was real id of the mobile device, and now
  // it's is a random number used to allow the device to upload photo in a new request
  var token = String(Math.floor(Math.random() * 123456789));

  var payload = JSON.stringify({problem: {
    description: params.description,
    weight: params.weight,
    category_id: params.category_id,
    municipality_id: params.municipality_id,
    latitude: params.latitude,
    longitude: params.longitude,
    email: Titanium.App.Properties.getString("email"),
    token: token
  }});

  uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам податоци'});
  uploadIndicator.show();

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = P.UI.xhrError;

  xhr.onload = function () {
    if (this.status === 200) {
      uploadIndicator.hide();
      var problem = JSON.parse(this.responseText);

      if (problem.status === 'ok') {
        if (problem.id && params.image) {
          P.http.uploadPhoto(problem.id, token, params.image, successCallback, errorCallback);
        } else {
          successCallback();
        }
      } else if (problem.status === 'api_key') {
        P.UI.apiKeyError();
      } else if (problem.status === 'access_denied') {
        P.UI.loggedInError();
      } else {
        errorHandler(problem.actions);
      }
    } else {
      P.UI.generalError();
    }
  };

  xhr.open('POST', P.config.apiEndpoint + '/problems?api_key=' + P.config.api_key);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.send(payload);
};


P.http.uploadPhoto = function (problem_id, token, image, successCallback, errorCallback) {
  if (problem_id == null) {
    P.UI.xhrError();
    return;
  }

  uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам слика'});
  uploadIndicator.show();

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = P.UI.xhrError;
  xhr.setTimeout(20000);

  xhr.onload = function () {
    var response = JSON.parse(this.responseText);
    uploadIndicator.hide();

    if (response.status === 'ok') {
      successCallback();
    } else if (response.status === 'api_key') {
      P.UI.apiKeyError();
    } else if (response.status === 'access_denied') {
      P.UI.loggedInError();
    } else {
      errorCallback(response);
    }
  };

  var payload = {"_method": "PUT", "photo": image, token: token};

  xhr.open('PUT', P.config.apiEndpoint  + '/problems/' + problem_id + '.json' + 
    '?api_key=' + P.config.api_key);
  xhr.send(payload);
};

P.http.changeProblemStatus = function (problem_id, status, 
    successCallback, accessDeniedCallback) {
  uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Менувам статус на проблем'});
  uploadIndicator.show();

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = P.UI.xhrError;
  xhr.setTimeout(20000);

  xhr.onload = function () {
    var json = JSON.parse(this.responseText);
    uploadIndicator.hide();

    if (json.status === 'ok') {
      successCallback();
    } else if (json.status === 'access_denied') {
      accessDeniedCallback();
    } else if (json.status === 'error') {
      P.UI.serverError();
    } else if (json.status === 'api_key') {
      P.UI.apiKeyError();
    } else {
      P.UI.generalError();
    }
  };

  var payload = {"_method": "PUT", "status": status};

  xhr.open('PUT', P.config.apiEndpoint + '/problems/' + problem_id + 
    '/update_status.json?api_key=' + P.config.api_key);
  xhr.send(payload);
};

P.http.login = function (successCallback) {
  var payload = JSON.stringify({
    email: emailField.value, 
    password: passwordField.value
  });

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = P.UI.xhrError;

  xhr.onload = function () {
    uploadIndicator.hide();

    if (this.status === 200) {
      var response = JSON.parse(this.responseText);
      if (response.status === 'ok') {
        Ti.App.Properties.setString('cookie', this.getResponseHeader('Set-Cookie'));
        Ti.App.Properties.setString('municipality_id', response.municipality_id);
        successCallback();
      } else if (response.status === 'api_key') {
        P.UI.apiKeyError();
      } else if (response.status === 'access_denied') {
        P.UI.loggedInError();
      } else {
        P.UI.loginError(response.message);
      }
    } else {
      P.UI.generalError();
    }
  };

  // NOTE: DEBUG
  //Ti.App.Properties.setString("cookie", "_popravi.mk_session=BAh7ByIPc2Vzc2lvbl9pZCIlYTYzODM0MGVjZWU1ODU1NTlhOWU4MGEwMDRlNmIyNjMiDHVzZXJfaWRpVg==--5653024a8388b7561e5eee0a6d84143ab16753fd");

  xhr.open('POST', P.config.apiEndpoint + '/session?api_key=' + P.config.api_key);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');

  // NOTE: Titanium can't set cookie on the second request
  // xhr.setRequestHeader('Cookie', 'something') will works the first time
  // but after a successful response from server with a 'Set-Cookie' header,
  // Titanium can't remove this cookie
  xhr.setRequestHeader('Cookie', Ti.App.Properties.getString("cookie"));

  xhr.send(payload);
};

P.http.getComments = function (problem_id, callback) {
  var url = P.config.apiEndpoint + '/comments.json?api_key=' + P.config.api_key +
    '&problem_id=' + problem_id;
  P.http.getJSON(url, function (json) {
    callback(json);
  });
};


P.http.createComment = function (problem_id, content, successCallback) {
  uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам коментар'});
  uploadIndicator.show();

  //P.http.login(successCallback);

  var payload = JSON.stringify({
    name: Ti.App.Properties.getString("name"), 
    email: Ti.App.Properties.getString("email"), 
    content: content
  });

  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = P.UI.xhrError;

  xhr.onload = function () {
    uploadIndicator.hide();

    if (this.status == 200) {
      var response = JSON.parse(this.responseText);
      if (response.status === 'ok') {
        successCallback(response.comment);
      } else if (response.status === 'api_key') {
        P.UI.apiKeyError();
      } else if (response.status === 'access_denied') {
        P.UI.loggedInError();
      } else {
        P.UI.commentError();
      }
    } else {
      P.UI.generalError();
    }
  };

  xhr.open('POST', P.config.apiEndpoint + '/comments?api_key=' + P.config.api_key +
    '&problem_id=' + problem_id);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Cookie', Ti.App.Properties.getString("cookie"));

  xhr.send(payload);
};
