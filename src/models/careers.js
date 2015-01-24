"use strict";

var dbHelpers = require('../util/dbHelpers.js');
var nearCache = require('../util/nearCache.js');
var Promise = require('../util/promise.js');

module.exports = (function(dbHelpers, nearCache, Promise) {
    var careerTableName = 'careers';
    var dbConnectionObj = dbHelpers.dbConnectionObj;

    function getAllCareerNames() {
        console.time('getAllCareerNames-database');
        function queryCareerNames() {
          return dbConnectionObj
          .select('career_name')
          .from(careerTableName);
        }

        return new Promise(function(resolve, reject) {
            // nearCache.get() expects an array
            nearCache.get(['careerNames'], queryCareerNames)
            .then(function(careerNames) {
                console.timeEnd('getAllCareerNames-database');
                resolve(careerNames);
            }, function(err) {
                reject(err);
            });
        });
    }

    //@param careerNames [array of career names]
    function findByCareerNames(careerNames) {
        console.time('findByCareerNames-database');

        function queryCareerData(careerNames) {
          return dbConnectionObj
          .select()
          .from(careerTableName)
          .whereIn('career_name', careerNames);
        }

        return new Promise(function(resolve, reject) {
            nearCache.get(careerNames, queryCareerData)
            .then(function(careers) {
                console.timeEnd('findByCareerNames-database');
                resolve(careers);
            }, function(err) {
                reject(err);
            });
        });
    }

    return {
        getAllCareerNames: getAllCareerNames,
        findByCareerNames: findByCareerNames
    };
})(dbHelpers, nearCache, Promise);