'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'alphabet', 'careersAPI', 'd3Scales', 'localStorage', function($log, $scope, $timeout, alphabet, careersAPI, d3Scales, localStorage) {
    //variables
    $scope.alphabet = alphabet;
    $scope.selectedCareersData = [];
    $scope.isShowChart = false;
    $scope.selectedCareerNames = localStorage.get('careerNames');
    $scope.showWelcomeTip = false;
    $scope.showChartTip = false;
    var isStubbedD3 = false;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

    //kendo widgets
    $scope.selectOptions = {    
        placeholder: "Click or type in this box to start browsing careers...",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

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
        localStorage.set('careerNames', $scope.selectedCareerNames);

        $scope.getDataAndShowChart();
    };

    $scope.getCareerNames();

    if(localStorage.get('showTooltips')) {
        localStorage.set('showTooltips', false);
        $timeout(function() {
            $scope.showWelcomeTip = true;
            $timeout(function() {
                $scope.showWelcomeTip = false;
                $scope.showChartTip = true;
                $timeout(function() {
                    $scope.showChartTip = false;
                }, 3000);
            }, 3000);
        }, 1000);
    }

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    if($scope.selectedCareerNames.length > 1) {
        $scope.compare();
    }

  }]);
