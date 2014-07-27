var assert = require('assert');
var dbHelpers = require('../src/util/dbHelpers.js');

describe('dbHelpers.queryCareerNames', function() {
    it('retrieves all career names from the database', function(done) {
        dbHelpers.queryCareerNames().then(function(careerNames) {
            assert.equal(careerNames.length, 1074, 'query did not select correct number of careers');
            done();
        });
    });
});

describe('dbHelpers.queryCareerData', function() {
    it('retrieves all data for given career names', function(done) {
        dbHelpers.queryCareerData(['Mathematicians', 'Nurse practitioners', 'Physician assistants']).then(function(matchedCareers) {
            var careerKeys = Object.keys(matchedCareers[0]);
            assert.equal(careerKeys.length, 12, 'query did not select correct number of columns');
            assert.equal(matchedCareers.length, 3, 'query did not select correct number of careers');
            done();
        });
    });
});