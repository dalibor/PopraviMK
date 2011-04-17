P.utility = {};

/*
 * Merges hashes
 */
P.utility.mergeHashes = function (destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

P.utility.emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
