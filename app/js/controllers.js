'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'alphabet', 'careersAPI', 'selectedCareersStorage', function($log, $scope, $timeout, alphabet, careersAPI, selectedCareersStorage) {
    //variables
    $scope.alphabet = alphabet;
    $scope.selectedCareerNames = selectedCareersStorage.get();
    $scope.selectedCareersData = [];
    $scope.welcomeTip = 'Search for careers you\'d like to compare in the search box above.'
    $scope.isShowChart = false;
    var chartTip;
    var isStubbedD3 = false;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

    //kendo widgets
    $scope.selectOptions = {    
        placeholder: "Select at least two careers...",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

    var welcomeTip = $('#welcomeTip').kendoTooltip({
        autoHide: false,
        content: 'Welcome to Career Buddy, the app that helps you find the perfect career for you. ',
        hide: function() {
            $("#welcomeTip").data("kendoTooltip").destroy();
            chartTip = $('#chartTip').kendoTooltip({
                autoHide: false,
                // callOut: false,
                content: 'When you\'ve selected at least 2 careers, click this button to compare them.',
                hide: function() {
                    $("#chartTip").data("kendoTooltip").destroy();
                }
            });
            console.log(chartTip);
            chartTip.show();
        }
    });

    //get career data 
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

    //event handlers
    $scope.compare = function() {
        selectedCareersStorage.set($scope.selectedCareerNames);

        $scope.getDataAndShowChart();
    };

    $scope.getCareerNames();

    $timeout(welcomeTip.show, 1000);

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
