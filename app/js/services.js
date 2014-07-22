'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')

  .factory('careersAPI', ['$http', function($http) {
    function getCareerNames() {
      return $http({
        url: '/careers/names',
        method: 'GET',
        cache: true
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
    };
  }])
  .factory('localStorage', ['$rootScope', '$window', function($rootScope, $window) {

      var localStorageKeys = {};

      angular.element($window).on('storage', function(event) {
          console.log(event.key);
          //avoid unnecessary triggers of digest cycle for any localStorage change
          if (event.key in localStorageKeys) {
              $rootScope.$apply();
          }
      });

      function get(key) {
          if($window.localStorage) {
              //coerce into type Array
              if(key === 'careerNames') {
                  var careerNames = $window.localStorage.getItem(key);
                  return careerNames.split(',');
              //coerce into type Boolean
              } else if(key === 'showTooltips') {
                  var showTooltips = $window.localStorage.getItem(key);
                  return showTooltips === 'true' ? true : false;
              }
          }
      }

      function set(key, value) {
          if($window.localStorage){
              $window.localStorage.setItem(key, value);
              localStorageKeys[key] = true;
          }
      }

      //initialize
      if($window.localStorage) {
          var careerNames = get('careerNames');
          var showTooltips = get('showTooltips');
          if(!careerNames) set('careerNames', []);
          //showTooltips can === false
          if(showTooltips === undefined) set('showTooltips', true);
      }

      return {
          get: get,
          set: set
      };
  }])
  .factory('alphabet', [function() {
      //20 may be too many
      return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];
  }])
  ;
