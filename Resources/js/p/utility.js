P.utility = {};

/*
 * Merges hashes
 */
P.utility.mergeHashes = function (destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};

