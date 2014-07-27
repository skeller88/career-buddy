var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var nearCache = require('../src/util/nearCache.js');
var Promise = require('../src/util/promise.js');

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

describe('nearCache.set', function() {
    it('sets a new property', function(done) {
        nearCache.set('foo', 'bar');
        nearCache.get('foo').then(function(key) {
            assert.equal(key, 'bar', 'nearCache.set() did not set the property correctly');
            done();
        });
    });
});

describe('nearCache.get', function() {

    beforeEach(function() {
        nearCache.set('foo', null);
    })

    it('retrieves a property that is already in the cache', function() {
        nearCache.set('foo', 'bar');
        var nearCacheGet = nearCache.get('foo');
        return assert.eventually.equal(nearCacheGet, 'bar', 'nearCache.get("foo") did not return the proper value');
    });

    it('uses a miss handler to set a property that is not in the cache', function() {
        var nearCacheGet = nearCache.get('foo', missHandler, 'foo');
        return assert.eventually.equal(nearCacheGet, 'dataBar', 'miss handler did not return the proper value');
    });

    it('rejects a promise when missing the miss handler param and when a property is not in the cache', function() {
        var nearCacheGet = nearCache.get('foo');
        return assert.isRejected(nearCacheGet, 'function promise was not rejected');
    });
});