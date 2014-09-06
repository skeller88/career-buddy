var dbHelpers = require('../util/dbHelpers.js');
var nearCache = require('../util/nearCache.js');
var Promise = require('../util/promise.js');

module.exports = (function(dbHelpers, nearCache, Promise) {
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
                resolve(careerNames);
            }, function(err) {
                reject(err);
            });
        });
    }

    function getAllEdLevels() {
        function queryCareerEdLevels() {
            return dbConnectionObj
                .select('career_edu')
                .distinct('career_edu')
                .from(careerTableName);
        }

        return new Promise(function(resolve, reject) {
            nearCache.get('careerEdLevels', queryCareerEdLevels, 'careerEdLevels')
                .then(function(careerEdLevels) {
                    resolve(careerEdLevels);
                }, function(err) {
                    reject(err);
                });
        });
    };

    //@param careerNames [array of career names]
    function findByCareerNames(careerNames) {
        function queryCareerData(careerNames) {
          return dbConnectionObj
          .select()
          .from(careerTableName)
          .whereIn('career_name', careerNames);
        }

        return new Promise(function(resolve, reject) {
            nearCache.get(careerNames, queryCareerData, careerQueryKey)
            .then(function(careers) {
                resolve(careers);
            }, function(err) {
                reject(err);
            });
        })
    }

    return {
        findByCareerNames: findByCareerNames,
        getAllEdLevels: getAllEdLevels,
        getAllCareerNames: getAllCareerNames
    }
})(dbHelpers, nearCache, Promise);