'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$scope', 'careersAPI', 'selectedCareersStorage', function($scope, careersAPI, selectedCareersStorage) {
    //variables
    $scope.selectedCareerNames = selectedCareersStorage.get();
    $scope.selectedCareersData = [];
    $scope.isShowChart = false;
    var isStubbedD3 = true;

    $scope.selectOptions = {    
        placeholder: "Select at least two careers...",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

    //functions
    $scope.getCareerNames = function() {
        careersAPI.getCareerNames().success(function(data) {
            console.log('success', data);
            $scope.names = data;
            dataSource.data(data);
        }).error(function(err) {
            console.log('getCareerNames error: ', err);
        });
    }

    $scope.getDataAndShowChart = function() {
        careersAPI.getCareerData($scope.selectedCareerNames)
            .success(function(data) {
            $scope.selectedCareersData = data;
            $scope.isShowChart = true;    
        }).error(function(data, status) {
            console.log('getCareerData error: ', data, status);
        });
    }

    $scope.compare = function() {
        selectedCareersStorage.set($scope.selectedCareerNames);

        $scope.getDataAndShowChart();
    };

    $scope.getCareerNames();

    var dataSource = new kendo.data.DataSource({
        data: []
    });

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    if($scope.selectedCareerNames.length) {
        $scope.getDataAndShowChart();
    }
  }])
  .controller('AboutCtrl', ['$scope', function($scope) {
  }])
  .controller('ContactCtrl', ['$scope', function($scope) {
  }]);
