'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')

  .factory('careers', ['$http', '$q', '$resource', function($http, $q, $resource) {
    function getCareerNames() {
      return $http({
        url: '/careers',
        method: 'GET',
        cache: true
      });
    }

    return {
      getCareerNames: getCareerNames
    }
  }]);
