var Promise = require('./promise.js');

module.exports = function(Promise) {
    var cache = {};

    //missHandler should be a promise
    //additional params can be included and will be passed to miss handler
    function get(key, missHandler) {

      var params = Array.prototype.slice.call(arguments, 2);
      
      return new Promise(function(resolve, reject) {
          //handle lookup of arrays in nearCache
          if(Array.isArray(key)) {
              var cacheKey = key.sort().join(',');
          } else {
              var cacheKey = key;
          }
          if(cache[cacheKey]) {
              resolve(cache[cacheKey]);
          } else {
              if(!missHandler) {
                  reject('no missHandler');
              }
              missHandler.apply(undefined, params).then(function(result) {
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