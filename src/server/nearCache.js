var Promise = require('bluebird');

module.exports = function(Promise) {
  var cache = {};

  //missHandler should be a promise
  function get(key, missHandler) {
    var args = Array.prototype.slice.call(arguments, 2);

    return new Promise(function(resolve, reject) {
      if(cache[key]) {
        resolve(cache[key]);
      } else {
        if(!missHandler) {
          reject('no missHandler');
        }
        missHandler.apply(undefined, args).then(function(result) {
          set(key, result);
          resolve(result);
        });
      }
    });
  }

  function set(key, value) {
    cache[key] = value;
  }

  return {
    get: get,
    set: set
  }
}(Promise);