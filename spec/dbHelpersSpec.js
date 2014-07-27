var dbHelpers = require('../src/util/dbHelpers.js');

describe('dbHelpers.queryCareerNames', function() {
    it('retrieves all career names from the database', function(done) {
        dbHelpers.queryCareerNames().then(function(careerNames) {
            expect(careerNames.length).toBe(1074);
            done();
        });
    });
});

describe('dbHelpers.queryCareerData', function() {
    it('retrieves all data for given career names', function(done) {
        dbHelpers.queryCareerData(['Mathematicians', 'Nurse practitioners', 'Physician assistants']).then(function(matchedCareers) {
            var careerKeys = Object.keys(matchedCareers[0]);
            expect(careerKeys.length).toBe(12);
            expect(matchedCareers.length).toBe(3);
            done();
        });
    });
});