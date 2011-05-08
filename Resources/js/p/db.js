P.db = {};
P.db.connection = Titanium.Database.install('../../db/popravi.sqlite', 'popravi2');

P.db.categories = function () {
  var categories = [];

  var dbCategories = P.db.connection.execute('SELECT * FROM categories;');

  while (dbCategories.isValidRow()) {
    categories.push({
      title: dbCategories.fieldByName('name'), 
      id: dbCategories.fieldByName('web_id')
    });
    dbCategories.next();
  };

  dbCategories.close();

  return categories;
};

P.db.municipalities = function () {
  var municipalities = []

  var dbMunicipalities = P.db.connection.execute('SELECT * FROM municipalities;');

  while (dbMunicipalities.isValidRow()) {
    municipalities.push({
      title: dbMunicipalities.fieldByName('name'), 
      id: dbMunicipalities.fieldByName('web_id')
    });
    dbMunicipalities.next();
  };

  dbMunicipalities.close();

  return municipalities;
};


P.db.saveMunicipalities = function (municipalities) {
  P.db.connection.execute('DELETE FROM municipalities;') // remove old municipalities

  // insert new municipalities
  for (var i = 0; i < municipalities.length; i++) {
    var municipality = municipalities[i];
    P.db.connection.execute('INSERT INTO "municipalities" ("web_id", "name") VALUES (' + municipality.id + ',"' + municipality.name + '");');
  }
};


P.db.saveCategories = function (categories) {
  P.db.connection.execute('DELETE FROM categories;') // remove old categories

  // insert new categories
  for (var i = 0; i < categories.length; i++) {
    var category = categories[i];
    P.db.connection.execute('INSERT INTO "categories" ("web_id", "name") VALUES (' + category.id + ',"' + category.name + '");');
  };
};

P.db.createProblem = function (params) {
  var nativePath;

  if (params.image) {
    var nativePath = params.image.nativePath;
  }

  P.db.connection.execute('INSERT INTO "problems" ("description", "weight", "category_id", "municipality_id", "latitude", "longitude", "email", "image") VALUES ("' + params.description + '","' + params.weight + '","' + params.category_id + '","' + params.municipality_id + '","' + params.latitude + '","' + params.longitude + '","' + params.email + '","' + nativePath + '");');
};

P.db.getProblemParams = function (dbProblems) {
  var imagePath = dbProblems.fieldByName('image');
  var image;

  if (imagePath) {
    var file = Ti.Filesystem.getFile(imagePath);
    if (file.exists()) {
      image = file.read();
    }
  }

  var params = {
    description: dbProblems.fieldByName('description'),
    weight: dbProblems.fieldByName('weight'),
    category_id: dbProblems.fieldByName('category_id'),
    municipality_id: dbProblems.fieldByName('municipality_id'),
    latitude: dbProblems.fieldByName('latitude'),
    longitude: dbProblems.fieldByName('longitude'),
    email: dbProblems.fieldByName('email'),
    imagePath: imagePath,
    image: image, 
    problemId: dbProblems.fieldByName('id'),
    token: String(Math.floor(Math.random() * 123456789))
  };

  return params;
};

P.db.syncProblems = function (callback) {
  var total = P.db.countLocalProblems();
  var i = 0;
  var errorPresent = false;

  var indicator = Titanium.UI.createActivityIndicator({
    location: Titanium.UI.ActivityIndicator.DIALOG,
    type: Titanium.UI.ActivityIndicator.DETERMINANT,
    message: 'Испраќам: 0 од ' + total,
    min: 0,
    max: total,
    value: 0
  });

  var successCallback = function (params) { 
    P.db.deleteProblem(params.problemId); // remove the sent problem

    var currentTotal = Number(P.db.countLocalProblems());
    var value = total - currentTotal;

    indicator.setValue(value);
    indicator.setMessage('Испраќам: ' + value + ' од ' + total);

    if (currentTotal === 0) {
      indicator.hide();
      P.UI.flash("Проблемите се успешно синхронизирани со серверот.");
      if (typeof(callback) === 'function') {
        callback();
      }
    }
  };

  var errorCallback = function () {
    errorPresent = true;
    indicator.hide();
    P.UI.syncError();
  };

  if (Ti.Network.online == false) {
    P.UI.connectionError();
  } else {
    var dbProblems = P.db.connection.execute('SELECT * FROM problems;');

    while (dbProblems.isValidRow() || errorPresent) {
      i = i + 1;
      var params = P.db.getProblemParams(dbProblems);

      if (i === 1) {
        indicator.show();
      }

      P.http.massCreateProblem(params, successCallback, errorCallback);

      dbProblems.next();
    };

    dbProblems.close();
  }
};

P.db.countLocalProblems = function () {
  var total = 0;

  var dbProblems = P.db.connection.execute('SELECT COUNT(*) AS count FROM problems;');

  if (dbProblems.isValidRow()) {
    total = Number(dbProblems.fieldByName('count'));
  }

  dbProblems.close();

  return total;
};

P.db.deleteLocalProblems = function (callback) {
  var alert = Titanium.UI.createAlertDialog({
    title: 'Бришење проблеми',
    message: 'Дали сакате да ги избришете сите проблеми кои беа сочувани локално?',
    buttonNames: ['Да', 'Не']
  });
  alert.addEventListener("click", function (e) {
    if (e.index == 0) {
      P.db.connection.execute('DELETE FROM problems;') // remove local problems
      P.UI.flash('Успешно се избришани сите проблеми кои беа сочувани локално.');
      if (typeof(callback) === 'function') {
        callback();
      }
    }
  });
  alert.show();
};

P.db.getMunicipalityName = function (municipalityId) {
  var name = 'Непостоечка општина';

  var dbMunicipalities = P.db.connection.execute('SELECT name FROM municipalities WHERE web_id = ' + municipalityId + ';');

  if (dbMunicipalities.isValidRow()) {
    name = dbMunicipalities.fieldByName('name');
  }

  dbMunicipalities.close();

  return name;
};

P.db.getCategoryName = function (categoryId) {
  var name = 'Непостоечка општина';

  var dbCategories = P.db.connection.execute('SELECT name FROM categories WHERE web_id = ' + categoryId + ';');

  if (dbCategories.isValidRow()) {
    name = dbCategories.fieldByName('name');
  }

  dbCategories.close();

  return name;
};

P.db.deleteProblem = function (problemId) {
  P.db.connection.execute('DELETE FROM problems WHERE id = ' + problemId + ';');
};

P.db.getProblemParamsById = function (problemId) {
  var params = null;

  var dbProblems = P.db.connection.execute('SELECT * FROM problems WHERE id = ' + problemId + ';');

  if (dbProblems.isValidRow()) {
    params = P.db.getProblemParams(dbProblems);
  }

  dbProblems.close();

  return params;
};

P.db.problemErrorHandler = function (actions, refreshPickersCallback) {
  var messageSync = []
  var categorySync = false;
  var municipalitySync = false;

  if (actions.category === "sync") {
    categorySync = true;
    messageSync.push("категории");
  }

  if (actions.municipality === "sync") {
    municipalitySync = true;
    messageSync.push("општини");
  }

  var syncAlert = Titanium.UI.createAlertDialog({
    title: 'Синхронизација', 
    message: 'Потребно е да направите синхронизација со серверот за да ја превземете изменетата листа на ' + messageSync.join(" и ") + '. Дали сакате синхронизацијата да започне?', 
    buttonNames: ['Да', 'Не']
  });

  syncAlert.addEventListener("click", function (e) {
    if (e.index == 0) {
      var callback = function () {
        P.UI.flash("Успешно се синхронизирани категориите и општините со серверот.");
        categories     = P.db.categories();
        municipalities = P.db.municipalities();

        if (typeof(refreshPickersCallback) == 'function') {
          refreshPickersCallback();
        }
      };

      P.http.sync(callback);
    }
  });
  syncAlert.show();
};
