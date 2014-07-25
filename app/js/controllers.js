'use strict';

/* Controllers */

angular.module('myApp.controllers', ['kendo.directives'])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'alphabet', 'careersAPI', 'd3Scales', 'localStorage', function($log, $scope, $timeout, alphabet, careersAPI, d3Scales, localStorage) {
    //variables
    $scope.alphabet = alphabet;
    $scope.selectedCareersData = [];
    $scope.selectedCareerNames = [];
    //prevents flicker of kendo window widget 
    $scope.showLegend = false;
    $scope.showWelcomeTip = false;
    $scope.showChartTip = false;
    $scope.welcomeTourIntro = 'uninitialized';
    var isStubbedD3 = false;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

    //kendo widgets
    $scope.welcomeTourLegendOptions = {
        content: 'Click the "Legend" button for help interpreting the results.',
        autoHide: false,
        hide: function() {
            $scope.welcomeTourLegend.destroy();
        }
    }

    $scope.welcomeTourChartOptions = {
        content: 'When you\'ve selected at least two careers, click the "Chart" button to generate a comparison.',
        autoHide: false,
        hide: function() {
            $scope.welcomeTourChart.destroy();
            $scope.welcomeTourLegend.show();
        }
    }

    $scope.welcomeTourIntroOptions = {
        content: 'Welcome to Career Buddy, the app that helps you find the best career for you.',
        autoHide: false,
        hide: function() {
            $scope.welcomeTourIntro.destroy();
            $scope.welcomeTourChart.show();
        }
    }

    $scope.selectOptions = {    
        placeholder: "Select at least two careers to compare.",
        dataTextField: "career_name",
        dataValueField: "career_name",
        autoBind: false,
        dataSource: dataSource
    };

    //prevents flicker of overflow scrollbar
    $scope.tabStripOptions = {
        animation: false
    }

    //get career data 
    $scope.getCareerNames = function() {
        careersAPI.getCareerNames().success(function(data) {
            dataSource.data(data);
            //ensures that multiselect widget only fades in when career names have been loaded
            $scope.careerNamesLength = data.length;
            $scope.selectedCareerNames = localStorage.get('careerNames') || [];

            if($scope.selectedCareerNames.length > 1 && $scope.selectedCareerNames.length < 20) {
                $scope.compare();
            }
        }).error(function(err) {
            $log.error('getCareerNames error: ', err);
        });
    }

    $scope.getDataAndShowChart = function() {
        careersAPI.getCareerData($scope.selectedCareerNames)
            .success(function(data) {
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

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    $timeout(function() {
        if(localStorage.get('showTour')) {
            localStorage.set('showTour', false);
            $scope.welcomeTourIntro.show();
        } else {
            $scope.welcomeTourLegend.destroy();
            $scope.welcomeTourChart.destroy();
            $scope.welcomeTourIntro.destroy();
        }
    }, 500);
  }]);
