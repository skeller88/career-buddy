var request = require('supertest');
var server = require('../src/server.js');
var Promise = require('../src/util/promise.js');
var app = server.app;

function returnPadding(text) {
    return text.split('').slice(0, server.padding.length).join('');
}

function removePadding(text) {
    var unpaddedText = text.split('').slice(server.padding.length).join('');
    return unpaddedText;
}

describe('routes', function() {
    it('sendWithJSONProtection - pads response', function(done) {
        function missingPadding(res) {
            var padding = returnPadding(res.text);
            //supertest API expects function to return false in order for the test to pass
            if(padding !== server.padding) return 'missing proper response padding'; 
        }

        request(app)
            .get('/careers/names')
            //not "application/json" because sendWithJSONProtection() coerces response body into string?
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(missingPadding)
            .expect(200, done)
    });

    it('getCareerNames - get all career names', function(done) {
        function missingCareerNames(res) {
            res.text = removePadding(res.text);
            //string needs to be parsed so it can be manipulated as an array
            var careerNamesArray = JSON.parse(res.text);
            var career = careerNamesArray[0];
            //1074 current number of careers in database
            if (!career.career_name) return 'didn\'t return objects with "career_name" keys';
            if (careerNamesArray.length !== 1074) return 'should return 1074 career names';
        }

        request(app)
            .get('/careers/names')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(missingCareerNames)
            .expect(200, done)
    });

    it('getCareerData - get relevant career data', function(done) {
        function missingCareerData(res) {
            res.text = removePadding(res.text);
            //string needs to be parsed so it can be manipulated as an array
            var careerDataArray = JSON.parse(res.text);
            var career = careerDataArray[0];
            if (career.career_name !== 'Nurse practitioners' && career.career_name !== 'Mathematicians') return 'didn\'t return correct careers';
            if (!career.career_percent_emp_change || !career.career_med_ann_wage) return 'missing "employment" and "wage" data for career in response';
        }

        request(app)
            .get('/careers?careers=Nurse+practitioners&careers=Mathematicians')
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(missingCareerData)
            .expect(200, done);
    });
});