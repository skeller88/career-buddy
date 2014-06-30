'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$scope', 'careersAPI', 'selectedCareersStorage', function($scope, careersAPI, selectedCareersStorage) {
    $scope.dummy = 'dummy';
    $scope.selectedCareers = selectedCareersStorage;
    $scope.selectedCareersData = [];
    $scope.isShowChart = false;

    var isStubbedD3 = false;

    if(isStubbedD3) {
      var stubData = 
          [ { career_name: 'Software developers and programmers',
              career_occ_code: '15-1130',
              career_2012_emp: 1503.1,
              career_2022_emp: 1782.6,
              career_num_emp_change: 279.5,
              career_percent_emp_change: 18.6,
              career_percent_self_emp: 4.5,
              career_job_openings: 522,
              career_med_ann_wage: 87100,
              career_edu: null,
              career_work_exp: null,
              career_job_training: null },
            { career_name: 'Teachers and instructors, all other',
              career_occ_code: '25-3099',
              career_2012_emp: 981.6,
              career_2022_emp: 1057.5,
              career_num_emp_change: 75.9,
              career_percent_emp_change: 7.7,
              career_percent_self_emp: 8.4,
              career_job_openings: 243.5,
              career_med_ann_wage: 28540,
              career_edu: 'Bachelor\'s degree',
              career_work_exp: 'None',
              career_job_training: 'Internship residency' },
            { career_name: 'Nurse practitioners',
              career_occ_code: '29-1171',
              career_2012_emp: 110.2,
              career_2022_emp: 147.3,
              career_num_emp_change: 37.1,
              career_percent_emp_change: 33.7,
              career_percent_self_emp: 1.8,
              career_job_openings: 58.5,
              career_med_ann_wage: 89960,
              career_edu: 'Master\'s degree',
              career_work_exp: 'None',
              career_job_training: 'None' },
            { career_name: 'Police officers',
              career_occ_code: '33-3050',
              career_2012_emp: 658.1,
              career_2022_emp: 697.1,
              career_num_emp_change: 39,
              career_percent_emp_change: 5.9,
              career_percent_self_emp: null,
              career_job_openings: 245.3,
              career_med_ann_wage: 55260,
              career_edu: null,
              career_work_exp: null,
              career_job_training: null } ];
      $scope.selectedCareersData = stubData;
      var dataSource = new kendo.data.DataSource({
        data: stubData
      });
    } else {
      var dataSource = new kendo.data.DataSource({
        data: []
      });
    }

    careersAPI.getCareerNames().success(function(data) {
      $scope.names = data;
      dataSource.data(data);
    }).error(function(err) {
      console.log('getCareerNames error: ', err);
    });

    $scope.selectOptions = {
        placeholder: "Select at least two careers...",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

    $scope.compare = function() {
      careersAPI.getCareerData($scope.selectedCareers)
        .success(function(data) {
        $scope.selectedCareersData = data;
        $scope.isShowChart = true; 

      }).error(function(data, status) {
        console.log('getCareerData error: ', data, status);
      });

    };

    $scope.$watch('selectedCareers', function() {
      selectedCareersStorage = $scope.selectedCareers;
    });

  }])
  .controller('AboutCtrl', ['$scope', function($scope) {
  }])
  .controller('ContactCtrl', ['$scope', function($scope) {
  }]);
