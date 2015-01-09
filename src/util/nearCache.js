'use strict';

var Promise = require('./promise.js');

module.exports = function(Promise) {
    var cache = {};

    //@param key [array] used as argument by missHandler if cache miss
    // TODO(shane): Sometimes only a single string is needed to be used as the
    // key. Would it make more sense to allow for a [string] to be used by the
    // missHandler as well as an [array]?
    //@param missHandler [promise]
    function get(key, missHandler) {

      return new Promise(function(resolve, reject) {
          //handle lookup of arrays in nearCache
          if(Array.isArray(key)) {
              //arrays will be stringified
              var cacheKey = key.sort().join(',');
          } else {
              var cacheKey = key;
          }
          if(cache[cacheKey]) {
              resolve(cache[cacheKey]);
          } else {
              if(!missHandler) {
                  reject(new Error('no missHandler'));
              }
              missHandler.call(undefined, key).then(function(result) {
                  set(cacheKey, result);
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
    };
}(Promise);