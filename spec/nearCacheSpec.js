var assert = require('assert');
var nearCache = require('../src/util/nearCache.js');
var Promise = require('bluebird');

var data = {'foo': 'dataBar'};

function missHandler(key) {
    return new Promise(function(resolve, reject) {
        if(data[key]){ 
            resolve(data[key]);
        } else {
            reject(key + ' ' + 'not found.');
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

    it('retrieves a property that is already in the cache', function(done) {
        nearCache.set('foo', 'bar');

        nearCache.get('foo').then(function(key) {
            assert.equal(key, 'bar', 'nearCache.get("foo") did not return the proper value');
            done();
        });
    });

    it('uses a miss handler to set a property that is not in the cache', function(done) {
        nearCache.get('foo', missHandler).then(function(key) {
            assert.equal(key, 'bar', 'miss handler did not return the proper value');
            done();
        });
    });

    it('rejects a promise when missing the miss handler param and when a property is not in the cache', function(done) {
        nearCache.get('foo',).then(function(key) {
            assert.equal(key, 'bar', 'function promise was not rejected');
            done();
        });
    });
});