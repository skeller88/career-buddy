'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')

  .factory('careers', ['$http', '$q', '$resource', function($http, $q, $resource) {
    function getCareerNames() {
      return $http({
        url: '/careers/names',
        method: 'GET'
      });
    }

    //careers is an array of career names
    function getCareerData(careers) {
      return $http({
        url:'/careers',
        method: 'GET',
        params: {
          careers: JSON.stringify(careers)
        }
      })
    }

    return {
      getCareerNames: getCareerNames,
      getCareerData: getCareerData
    }
  }]);
