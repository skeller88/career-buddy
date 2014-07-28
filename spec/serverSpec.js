var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var request = require('supertest');
var server = require('../src/server.js');
var Promise = require('../src/util/promise.js');

chai.use(chaiAsPromised);
var assert = chai.assert;
var app = server.app;

//dummy data
var data = {'foo': 'dataBar'};

describe('routes', function() {
    it('getCareerNames - get all career names', function(done) {
        request(app)
            .get('careers/names')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('getCareerData - get relevant career data', function(done) {
        request(app)
            .get('careers/')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});