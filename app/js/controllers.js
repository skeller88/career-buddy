'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$scope', 'careers', function($scope, careers) {
    $scope.selectedCareers = [];
    $scope.selectedCareersData = [];
    $scope.isShowChart = false;

    var dataSource = new kendo.data.DataSource({
      data: []
    });

    careers.getCareerNames()
        .success(function(data, status, headers, config) {
        $scope.names = data;
        dataSource.data(data);

      }).error(function(data, status, headers, config) {
        console.log('getCareerNames error: ', data, status);
      });

    $scope.selectOptions = {
        placeholder: "Select at least two careers...",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

    $scope.compare = function() {
      careers.getCareerData($scope.selectedCareers)
        .success(function(data, status, headers, config) {
        $scope.selectedCareersData = data;
        $scope.isShowChart = true; 

      }).error(function(data, status, headers, config) {
        console.log('getCareerData error: ', data, status);
      });

    };

  }])
  .controller('AboutCtrl', ['$scope', function($scope) {
  }])
  .controller('ContactCtrl', ['$scope', function($scope) {
  }]);
