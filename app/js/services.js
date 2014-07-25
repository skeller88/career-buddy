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
  .factory('savedCareers', [function() {
      var fastestGrowingCareers = [
          'Industrial-organizational psychologists',
          'Personal care aides',
          'Home health aides',
          'Insulation workers, mechanical',
          'Interpreters and translators',
          'Helpers--brickmasons, blockmasons, stonemasons, and tile and marble setters',
          'Genetic counselors',
          'Physical therapist assistants',
          'Physical therapist aides',
          'Skincare specialists',
          'Physician assistants',
          'Segmental pavers',
          'Helpers--electricians',
          'Information security analysts',
          'Occupational therapy aides',
          'Health specialties teachers, postsecondary',
          'Medical secretaries',
          'Physical therapists',
          'Orthotists and prosthetists',
          'Brickmasons and blockmasons'
      ];

      var topPayingCareers = [
          'Oral and maxillofacial surgeons',
          'Physicians and surgeons, all other',
          'Surgeons',
          'Obstetricians and gynecologists',
          'Internists, general',
          'Anesthesiologists',
          'Orthodontists',
          'Psychiatrists',
          'Family and general practitioners',
          'Prosthodontists',
          'Chief executives',
          'Dentists, all other specialists',
          'Pediatricians, general',
          'Nurse anesthetists',
          'Dentists, general',
          'Petroleum engineers',
          'Architectural and engineering managers',
          'Air traffic controllers',
          'Computer and information systems managers',
          'Marketing managers'
      ];

      //highest number of new jobs
      var topGrowingCareers = [
          'Personal care aides',
          'Registered nurses',
          'Retail salespersons',
          'Home health aides',
          'Combined food preparation and serving workers, including fast food',
          'Nursing assistants',
          'Secretaries and administrative assistants, except legal, medical, and executive',
          'Customer service representatives',
          'Janitors and cleaners, except maids and housekeeping cleaners',
          'Construction laborers',
          'General and operations managers',
          'Laborers and freight, stock, and material movers, hand',
          'Carpenters',
          'Bookkeeping, accounting, and auditing clerks',
          'Heavy and tractor-trailer truck drivers',
          'Medical secretaries',
          'Childcare workers',
          'Office clerks, general',
          'Maids and housekeeping cleaners',
          'Licensed practical and licensed vocational nurses'
      ];

      return {
          fastestGrowingCareers: fastestGrowingCareers,
          topPayingCareers: topPayingCareers,
          topGrowingCareers: topGrowingCareers
      }
  }])
  ;
