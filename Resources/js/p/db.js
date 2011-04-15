P.db = {};
P.db.db = Titanium.Database.install('../../db/popravi.sqlite', 'popravi');

P.db.categories = function () {
  var categories = [];

  var dbCategories = P.db.db.execute('SELECT * FROM categories;');

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

  var dbMunicipalities = P.db.db.execute('SELECT * FROM municipalities;');

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
  P.db.db.execute('DELETE FROM municipalities;') // remove old municipalities

  // insert new municipalities
  for (var i = 0; i < municipalities.length; i++) {
    var municipality = municipalities[i];
    P.db.db.execute('INSERT INTO "municipalities" ("web_id", "name") VALUES (' + municipality.id + ',"' + municipality.name + '");');
  }
};


P.db.saveCategories = function (categories) {
  P.db.db.execute('DELETE FROM categories;') // remove old categories

  // insert new categories
  for (var i = 0; i < categories.length; i++) {
    var category = categories[i];
    P.db.db.execute('INSERT INTO "categories" ("web_id", "name") VALUES (' + category.id + ',"' + category.name + '");');
  };
};

