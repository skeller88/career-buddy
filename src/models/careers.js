var dbHelpers = require('../util/dbHelpers.js');
var nearCache = require('../util/nearCache.js');
var Promise = require('../util/promise.js');

module.exports = function(dbHelpers, nearCache, Promise) {
    var careerTableName = 'careers';
    var dbConnectionObj = dbHelpers.dbConnectionObj;

    function getAllCareerNames() {
        function queryCareerNames() {
          return dbConnectionObj
          .select('career_name')
          .from(careerTableName);
        }

        return new Promise(function(resolve, reject) {
            nearCache.get('careerNames', queryCareerNames, 'careerNames')
            .then(function(careerNames) {
                //for faster lookup of career names in multiselect widget on client side
                resolve(careerNames);
            }, function(err) {
                reject(err);
            });
        });
    }

    //expects a 'careers' param whose value is an array of career names
    function findByCareerNames(careerNames) {
        function queryCareerData(careerNames) {
          return dbConnectionObj
          .select()
          .from(careerTableName)
          .whereIn('career_name', careerNames);
        }

        return new Promise(function(resolve, reject) {
            var careerQueryKey = careerNames.sort();

            nearCache.get(careerQueryKey, queryCareerData, careerQueryKey)
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