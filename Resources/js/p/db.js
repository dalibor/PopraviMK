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

P.db.syncProblems = function () {
  var dbProblems = P.db.connection.execute('SELECT * FROM problems;');
  var i = 0;

  while (dbProblems.isValidRow()) {
    i = i + 1;
    var token = String(Math.floor(Math.random() * 123456789));
    var total = P.db.countLocalProblems();
    var imagePath = dbProblems.fieldByName('image');
    var image;

    if (imagePath) {
      var file = Ti.Filesystem.getFile(imagePath);
      if (file.exists()) {
        image = file.read();
      }
    }

    if (i === 1) {
      // create indicator
      var ind = Titanium.UI.createActivityIndicator({
        location: Titanium.UI.ActivityIndicator.DIALOG,
        type: Titanium.UI.ActivityIndicator.DETERMINANT,
        message: 'Испраќам: 0 од ' + total,
        min: 0,
        max: total,
        value: 0
      });

      ind.show();
    }

    var params = {
      description: dbProblems.fieldByName('description'),
      weight: dbProblems.fieldByName('weight'),
      category_id: dbProblems.fieldByName('category_id'),
      municipality_id: dbProblems.fieldByName('municipality_id'),
      latitude: dbProblems.fieldByName('latitude'),
      longitude: dbProblems.fieldByName('longitude'),
      email: dbProblems.fieldByName('email'),
      image: image, 
      problemId: dbProblems.fieldByName('id'),
      token: String(Math.floor(Math.random() * 123456789))
    };

    var successCallback = function (params) { 
      // remove the sent problem
      P.db.connection.execute('DELETE FROM problems WHERE id = ' + params.problemId + ';');
      var currentTotal = Number(P.db.countLocalProblems());
      var value = total - currentTotal;

      ind.setValue(value);
      ind.setMessage('Испраќам: ' + value + ' од ' + total);

      if (currentTotal === 0) {
        ind.hide();
        P.UI.flash("Проблемите се успешно синхронизирани со серверот.");
      }
    };

    P.http.massCreateProblem(params, successCallback);

    dbProblems.next();
  };

  dbProblems.close();
};

P.db.countLocalProblems = function () {
  var total = 0;

  var dbProblems = P.db.connection.execute('SELECT COUNT(*) AS count FROM problems;');

  if (dbProblems.isValidRow()) {
    total = dbProblems.fieldByName('count');
  }

  dbProblems.close();

  return total;
};
