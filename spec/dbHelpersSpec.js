var chai = require('chai');
var dbHelpers = require('../src/util/dbHelpers.js');
var productionConnectionString = 'postgres://ridycrnekqeenm:36ijB7sOymHbWMgmuRLVOBLofq@ec2-54-221-243-6.compute-1.amazonaws.com:5432/d1eb2fbft5f994?ssl=true';

var assert = chai.assert;

describe('dbHelpers.dbConnectionObj', function() {
    it('connects to production database', function() {
        assert.equal(dbHelpers.dbConnectionObj.client.connectionSettings, productionConnectionString, 'not connected to production database');
    });

    it('has SQL query methods', function() {
        assert.property(dbHelpers.dbConnectionObj, 'from', 'no "from" property');
        assert.property(dbHelpers.dbConnectionObj, 'select', 'no "select" property');
        assert.property(dbHelpers.dbConnectionObj, 'where', 'no "where" property');
    });
});