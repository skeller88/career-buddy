var Promise = require('bluebird');

module.exports = function(Promise) {
  var cache = {};

  //missHandler should be a promise
  function get(key, missHandler) {
    return new Promise(function(resolve, reject) {
      if(cache[key]) {
        resolve(cache[key]);
      } else {
        if(!missHandler) {
          reject('no missHandler');
        }
        missHandler().then(function(result) {
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