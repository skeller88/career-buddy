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
          careers: careers
        },
        cache: true
      })
    }

    return {
      getCareerNames: getCareerNames,
      getCareerData: getCareerData
    };
  }])
  .factory('d3Scales', function() {
      var rmin = 4;
      var rmax = 15;

      //max and min for 'careers' table column 'career_2012_emp'
      var minNumEmp = 0.4;
      var maxNumEmp = 145355;

      var bubbleRadiusScale = d3.scale.log()
          .domain([minNumEmp,maxNumEmp])
          .range([rmin, rmax]);

      var bubbleOpacityScale = d3.scale.log()
          .domain([minNumEmp,maxNumEmp])
          .range([1,.5]);

      return {
        bubbleRadiusScale: bubbleRadiusScale,
        bubbleOpacityScale: bubbleOpacityScale
      }
  })
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
              var value = $window.localStorage.getItem(key);
              return value && JSON.parse(value);
          }
      }

      function set(key, value) {
          //localStorage stores all values as strings, and the app needs localStorage
          //to store arrays
          if($window.localStorage){
              $window.localStorage.setItem(key, JSON.stringify(value));
              localStorageKeys[key] = true;
          }
      }

      //initialize
      if($window.localStorage) {
          if(!get('careerNames')) set('careerNames', []);
          //account for undefined and false values 
          if(!get('showTour') && !(typeof get('showTour') === 'boolean')) set('showTour', true);
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
