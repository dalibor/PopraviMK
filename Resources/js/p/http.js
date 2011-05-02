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
    P.UI.connectionError();
    return;
  }

  var indicator = Ti.UI.createActivityIndicator({message: 'Вчитувам'})
  indicator.show();

  var xhr = Ti.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    indicator.hide();
    P.UI.flash('Се јави проблем при поврзување со серверот. Ве молиме обидете се подоцна.');
  };

  xhr.onload = function () {
    indicator.hide();

    if (this.status === 200) {
      var json = JSON.parse(this.responseText);

      if (json.status === 'api_key') {
        P.UI.apiKeyError();
      } else if (json.status === 'access_denied') {
        P.UI.loggedInError();
      } else {
        callback(json);
      }
    } else {
      P.UI.generalError();
    }
  };

  xhr.open('GET', url);
  xhr.send();
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
  P.geolocation.detect(function (coords) {
    var url = P.config.apiEndpoint + '/problems.json?api_key=' + P.config.api_key +
    '&type=nearest&' + 'longitude=' + coords.longitude + '&latitude=' + coords.latitude;
    P.http.getProblems(url, callback);
  });
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


P.http.createProblem = function (params, successCallback, errorCallback, errorHandler) {
  if (Ti.Network.online == false) {
    P.UI.connectionError();
    return;
  }

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

  var uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам податоци'});
  uploadIndicator.show();

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    uploadIndicator.hide();
    P.UI.xhrError();
  };

  xhr.onload = function () {
    uploadIndicator.hide();

    if (this.status === 200) {
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


P.http.uploadPhoto = function (problemId, token, image, successCallback, errorCallback) {
  if (Ti.Network.online == false) {
    P.UI.connectionError();
    return;
  }

  if (problemId == null) {
    P.UI.xhrError();
    return;
  }

  var uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам слика'});
  uploadIndicator.show();

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    uploadIndicator.hide();
    P.UI.xhrError();
  }

  xhr.onload = function () {
    uploadIndicator.hide();

    if (this.status === 200) {
      var response = JSON.parse(this.responseText);

      if (response.status === 'ok') {
        successCallback();
      } else if (response.status === 'api_key') {
        P.UI.apiKeyError();
      } else if (response.status === 'access_denied') {
        P.UI.loggedInError();
      } else {
        errorCallback(response);
      }
    } else {
      P.UI.generalError();
    }
  };

  var payload = {"_method": "PUT", "photo": image, token: token};

  xhr.open('PUT', P.config.apiEndpoint  + '/problems/' + problemId + '.json' + 
    '?api_key=' + P.config.api_key);
  xhr.send(payload);
};

P.http.changeProblemStatus = function (problemId, status, 
    successCallback, accessDeniedCallback) {

  if (Ti.Network.online == false) {
    P.UI.connectionError();
    return;
  }

  var uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Менувам статус на проблем'});
  uploadIndicator.show();

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    uploadIndicator.hide();
    P.UI.xhrError();
  };

  xhr.onload = function () {
    var json = JSON.parse(this.responseText);
    uploadIndicator.hide();

    if (this.status === 200) {
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
    } else {
      P.UI.generalError();
    }
  };

  var payload = {"_method": "PUT", "status": status};

  xhr.open('PUT', P.config.apiEndpoint + '/problems/' + problemId + 
    '/update_status.json?api_key=' + P.config.api_key);
  xhr.send(payload);
};

P.http.login = function (successCallback) {
  if (Ti.Network.online == false) {
    P.UI.connectionError();
    return;
  }

  var uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам податоци'});
  uploadIndicator.show();

  var payload = JSON.stringify({
    email: emailField.value, 
    password: passwordField.value
  });

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    uploadIndicator.hide();
    P.UI.xhrError();
  };

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
        P.UI.flash(response.message);
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

P.http.getComments = function (problemId, callback) {
  var url = P.config.apiEndpoint + '/comments.json?api_key=' + P.config.api_key +
    '&problem_id=' + problemId;
  P.http.getJSON(url, function (json) {
    callback(json);
  });
};


P.http.createComment = function (problemId, content, successCallback) {
  if (Ti.Network.online == false) {
    P.UI.connectionError();
    return;
  }

  var uploadIndicator = Titanium.UI.createActivityIndicator({message: 'Испраќам коментар'});
  uploadIndicator.show();

  var payload = JSON.stringify({
    name: Ti.App.Properties.getString("name"), 
    email: Ti.App.Properties.getString("email"), 
    content: content
  });

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    uploadIndicator.hide();
    P.UI.xhrError();
  };

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
    '&problem_id=' + problemId);

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.setRequestHeader('Cookie', Ti.App.Properties.getString("cookie"));

  xhr.send(payload);
};


P.http.massCreateProblem = function (params, successCallback, errorCallback) {
  if (params.latitude == null) { params.latitude = 0.0; }
  if (params.longitude == null) { params.longitude = 0.0; }

  var payload = JSON.stringify({problem: {
    description: params.description,
    weight: params.weight,
    category_id: params.category_id,
    municipality_id: params.municipality_id,
    latitude: params.latitude,
    longitude: params.longitude,
    email: params.email,
    token: params.token
  }});

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    errorCallback();
    P.UI.xhrError();
  };

  xhr.onload = function () {

    if (this.status === 200) {
      var problem = JSON.parse(this.responseText);

      if (problem.status === 'ok') {
        if (problem.id && params.image) {
          P.http.massUploadPhoto(problem.id, params, successCallback, errorCallback);
        } else {
          successCallback(params);
        }
      } else {
        errorCallback();
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


P.http.massUploadPhoto = function (remoteProblemId, params, successCallback, errorCallback) {
  var payload = {"_method": "PUT", "photo": params.image, token: params.token};

  var xhr = Titanium.Network.createHTTPClient();
  xhr.setTimeout(20000);

  xhr.onerror = function () {
    errorCallback();
    P.UI.xhrError();
  };

  xhr.onload = function () {
    if (this.status === 200) {
      var response = JSON.parse(this.responseText);

      if (response.status === 'ok') {
        successCallback(params);
      } else {
        errorCallback();
      }
    } else {
      errorCallback();
      P.UI.generalError();
    }
  };

  xhr.open('PUT', P.config.apiEndpoint  + '/problems/' + remoteProblemId + '.json' + 
    '?api_key=' + P.config.api_key);
  xhr.send(payload);
};
