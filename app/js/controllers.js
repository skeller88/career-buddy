'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$log', '$scope', 'alphabet', 'careersAPI', 'selectedCareersStorage', function($log, $scope, alphabet, careersAPI, selectedCareersStorage) {
    //variables
    $scope.alphabet = alphabet;
    $scope.selectedCareerNames = selectedCareersStorage.get();
    $scope.selectedCareersData = [];
    $scope.isShowChart = false;
    var isStubbedD3 = true;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

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
            $log.debug('getCareerNames success', data);
            $scope.names = data;
            dataSource.data(data);
        }).error(function(err) {
            $log.error('getCareerNames error: ', err);
        });
    }

    $scope.getDataAndShowChart = function() {
        careersAPI.getCareerData($scope.selectedCareerNames)
            .success(function(data) {
            $log.debug('getDataAndShowChart success', data);
            $scope.selectedCareersData = data;
            $scope.isShowChart = true;    
        }).error(function(data, status) {
            $log.error('getCareerData error: ', data, status);
        });
    }

    $scope.compare = function() {
        selectedCareersStorage.set($scope.selectedCareerNames);

        $scope.getDataAndShowChart();
    };

    $scope.getCareerNames();

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    if($scope.selectedCareerNames.length) {
        $scope.compare();
    }

  }])
  .controller('AboutCtrl', ['$scope', function($scope) {
  }])
  .controller('ContactCtrl', ['$scope', function($scope) {
  }]);
