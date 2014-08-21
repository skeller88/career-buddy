var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var nearCache = require('../../src/util/nearCache.js');
var Promise = require('../../src/util/promise.js');

chai.use(chaiAsPromised);
var assert = chai.assert;

//dummy data
var data = {'foo': 'dataBar'};

function missHandler(key) {
    return new Promise(function(resolve, reject) {
        if(data[key]){ 
            resolve(data[key]);
        } else {
            reject(new Error(key + ' ' + 'not found.'));
        }
    });
}

function falsyMissHandler(key) {
    return new Promise(function(resolve, reject) {
        if(data[key]){ 
            resolve(false);
        } else {
            reject(new Error(key + ' ' + 'not found.'));
        }
    });
}

describe('nearCache.get', function() {

    beforeEach(function() {
        nearCache.set('foo', null);
    })

    it('returns a value for a key that is already in the cache', function() {
        nearCache.set('foo', 'bar');
        var nearCacheGet = nearCache.get('foo');
        return assert.eventually.equal(nearCacheGet, 'bar', 'nearCache.get("foo") did not return the proper value');
    });

    it('does not call the miss handler when retrieving a key that is already in the cache', function() {
        nearCache.set('foo', 'bar');
        var nearCacheGet = nearCache.get('foo', falsyMissHandler);
        return assert.ok(nearCacheGet, 'bar', 'falsyMissHandler was called');
    });

    it('sets the value of a key not in the cache, and returns that value', function() {
        var nearCacheGet = nearCache.get('foo', missHandler, 'foo');
        return assert.eventually.equal(nearCacheGet, 'dataBar', 'miss handler did not return the proper value');
    });

    it('rejects a promise when missing the miss handler param and when a property is not in the cache', function() {
        var nearCacheGet = nearCache.get('foo');
        return assert.isRejected(nearCacheGet, 'function promise was not rejected');
    });
});