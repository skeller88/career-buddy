'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'alphabet', 'careersAPI', 'd3Scales', 'localStorage', function($log, $scope, $timeout, alphabet, careersAPI, d3Scales, localStorage) {
    //variables
    $scope.alphabet = alphabet;
    $scope.selectedCareersData = [];
    $scope.selectedCareerNames = [];
    //prevents flicker of kendo window widget 
    $scope.showLegend = false;
    $scope.showWelcomeTip = false;
    $scope.showChartTip = false;
    var isStubbedD3 = false;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

    //kendo widgets
    $scope.selectOptions = {    
        placeholder: "Select at least two careers to compare.",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

    $scope.tabStripOptions = {
        animation: false
    }

    //get career data 
    $scope.getCareerNames = function() {
        careersAPI.getCareerNames().success(function(data) {
            $log.debug('getCareerNames success', data);
            dataSource.data(data);
            //ensures that multiselect widget only fades in when career names have been loaded
            $scope.careerNamesLength = data.length;
            $scope.selectedCareerNames = localStorage.get('careerNames') || [];

            if($scope.selectedCareerNames.length > 1) {
                $scope.compare();
            }
        }).error(function(err) {
            $log.error('getCareerNames error: ', err);
        });
    }

    $scope.getDataAndShowChart = function() {
        careersAPI.getCareerData($scope.selectedCareerNames)
            .success(function(data) {
            $log.debug('getDataAndShowChart success', data);
            $scope.selectedCareersData = data;
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
                }, 7000);
            }, 7000);
        }, 1000);
    }

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }
  }]);
