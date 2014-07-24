var dbHelpers = require('../util/dbHelpers.js');
var nearCache = require('../server/nearCache.js');
var Promise = require('bluebird');

module.exports = function(dbHelpers, nearCache, Promise) {
    function getAllCareerNames() {
        return new Promise(function(resolve, reject) {
            nearCache.get('careerNames', dbHelpers.queryCareerNames)
            .then(function(careerNames) {
                resolve(careerNames);
            }, function(err) {
                reject(err);
            });
        });
    }

    //expects a 'careers' param whose value is an array of career names
    function findByCareerNames(careerNames) {
        return new Promise(function(resolve, reject) {
            var careerQueryKey = careerNames.sort();

            nearCache.get(careerQueryKey, dbHelpers.queryCareerData)
            .then(function(careers) {
                resolve(careers);
            }, function(err) {
                reject(err);
            });
        })
    }

    return {
        getAllCareerNames: getAllCareerNames,
        findByCareerNames: findByCareerNames
    }
}(dbHelpers, nearCache, Promise);