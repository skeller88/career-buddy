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
            .get('/careers/names')
            //why not "application/json"?
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(200, done)
    });

    it('getCareerData - get relevant career data', function(done) {
        request(app)
            .get('/careers?careers=Nurse+practitioners&careers=Mathematicians')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(200, done);
    });
});