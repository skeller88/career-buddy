'use strict';

var chai = require('chai');
var dbHelpers = require('../../src/util/dbHelpers.js');
var assert = chai.assert;

describe('dbHelpers.dbConnectionObj', function() {
    it('has SQL query methods', function() {
        assert.property(dbHelpers.dbConnectionObj, 'from', 'no "from" property');
        assert.property(dbHelpers.dbConnectionObj, 'select', 'no "select" property');
        assert.property(dbHelpers.dbConnectionObj, 'where', 'no "where" property');
    });
});