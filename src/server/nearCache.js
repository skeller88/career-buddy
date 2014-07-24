var Promise = require('bluebird');

module.exports = function(Promise) {
    var cache = {};

    //missHandler should be a promise
    function get(key, missHandler) {

      return new Promise(function(resolve, reject) {
          //handle lookup of arrays in nearCache
          if(Array.isArray(key)) {
              var cacheKey = key.sort().join(',');
              console.log(cacheKey, cache[cacheKey]);
          } else {
              var cacheKey = key;
          }
          if(cache[cacheKey]) {
              resolve(cache[cacheKey]);
          } else {
              if(!missHandler) {
                  reject('no missHandler');
              }
              missHandler.call(undefined, key).then(function(result) {
                  set(key, result);
                  resolve(result);
              }, function(err) {
                  reject(err);
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