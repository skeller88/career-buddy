'use strict';

var request = require('supertest');
var server = require('../../src/server.js');
var Promise = require('../../src/util/promise.js');
var app = server.app;
//number of careers currently in database
var numCareers = 1074;

function returnPadding(text) {
    return text.split('').slice(0, server.padding.length).join('');
}

function removePadding(text) {
    var unpaddedText = text.split('').slice(server.padding.length).join('');
    return unpaddedText;
}

describe('middleware', function() {

    it('sendWithAngularJSONProtection - pads response', function(done) {
        function missingPadding(res) {
            var padding = returnPadding(res.text);
            //supertest API expects function to return false in order for the test to pass
            if (padding !== server.padding) {
                return 'missing proper response padding';
            }
        }

        request(app)
            .get('/careers/names')
            //not "application/json" because sendWithAngularJSONProtection() coerces response body into string?
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(missingPadding)
            .expect(200, done);
    });

    it('does not cache .html files', function(done) {
        request(app)
            .get('/index.html')
            .expect('Cache-Control', "public, max-age=0")
            .expect(200, done);
    });

    it('caches .js files', function(done) {
        request(app)
            .get('/js/app.js')
            .expect('Cache-Control', "public, max-age=31557600000")
            .expect(200, done);
    });

    it('caches .css files', function(done) {
        request(app)
            .get('/css/application.css')
            .expect('Cache-Control', "public, max-age=31557600000")
            .expect(200, done);
    });
});

describe('routes', function() {

    it('getCareerNames - get all career names', function(done) {
        function missingCareerNames(res) {
            res.text = removePadding(res.text);
            //string needs to be parsed so it can be manipulated as an array
            var careers = JSON.parse(res.text);
            var career = careers[0];
            //1074 current number of careers in database
            if (!career.career_name) {
                return 'didn\'t return objects with "career_name" keys';
            } else if (careers.length !== numCareers) {
                return 'should return ' + 1074 + ' career names';
            }
        }

        request(app)
            .get('/careers/names')
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(missingCareerNames)
            .expect(200, done);
    });

    it('getCareerData - get relevant career data', function(done) {
        function missingCareerData(res) {
            res.text = removePadding(res.text);
            //string needs to be parsed so it can be manipulated as an array
            var careers = JSON.parse(res.text);
            var career = careers[0];
            if (careers.length !== 2) {
                return 'expected 2 careers, got ' + careers.length + ' career(s).';
            } else if (career.career_name !== 'Nurse practitioners' && career.career_name !== 'Mathematicians') {
                return 'didn\'t return correct careers';
            } else if (!career.career_percent_emp_change || !career.career_med_ann_wage) {
                return 'missing "employment" and "wage" data for career in response';
            }
        }

        request(app)
            .get('/careers?careers=Nurse+practitioners&careers=Mathematicians')
            .expect('Content-Type', "application/json; charset=utf-8")
            .expect(missingCareerData)
            .expect(200, done);
    });
});