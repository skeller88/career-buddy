'use strict';

/* Controllers */

angular.module('myApp.controllers', ['kendo.directives'])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'alphabet', 'careersAPI', 'd3Scales', 'localStorage', 'savedCareers', function($log, $scope, $timeout, alphabet, careersAPI, d3Scales, localStorage, savedCareers) {
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

    //tooltips for tour functionality - must be in reverse order of their appearance in tour
    $scope.welcomeTourClearOptions = {
        content: 'clear all currently selected careers,',
        autoHide: false,
        showOn: 'focus',
        hide: function() {
            $scope.welcomeTourClear.destroy();
            $scope.welcomeTourMoney.show();
        },
        position: 'top'
    }

    $scope.welcomeTourMoneyOptions = {
        content: 'select and compare the highest paying careers,',
        autoHide: false,
        showOn: 'focus',
        hide: function() {
            $scope.welcomeTourMoney.destroy();
            $scope.welcomeTourGrowth.show();
        },
        position: 'left'
    }

    $scope.welcomeTourGrowthOptions = {
        content: 'and select and compare the fastest growing careers. Have fun!',
        autoHide: false,
        showOn: 'focus',
        hide: function() {
            $scope.welcomeTourGrowth.destroy();
        },
        position: 'bottom'
    }

    $scope.welcomeTourLegendOptions = {
        content: 'You can also interpret the results,',
        autoHide: false,
        hide: function() {
            $scope.welcomeTourLegend.destroy();
            $scope.welcomeTourClear.show();
        },
        showOn: 'focus'
    }

    $scope.welcomeTourChartOptions = {
        content: 'When you\'ve selected at least two careers, click the "Chart" button to generate a comparison.',
        autoHide: false,
        hide: function() {
            $scope.welcomeTourChart.destroy();
            $scope.welcomeTourLegend.show();
        },
        showOn: 'focus',
    }

    $scope.welcomeTourIntroOptions = {
        content: 'Welcome to Career Buddy, the app that helps you find the best career for you.',
        autoHide: false,
        hide: function() {
            $scope.welcomeTourIntro.destroy();
            $scope.welcomeTourChart.show();
        },
        position: 'bottom',
        showOn: 'focus'
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
        console.log($scope.selectedCareerNames);
        careersAPI.getCareerData($scope.selectedCareerNames).success(function(data) {
            $scope.selectedCareersData = data;
        }).error(function(data, status) {
            $log.error('getCareerData error: ', data, status);
        });
    }

    //event handlers
    $scope.clearSelected = function() {
        $scope.selectedCareerNames = [];
    }

    $scope.compare = function() {
        localStorage.set('careerNames', $scope.selectedCareerNames);

        $scope.getDataAndShowChart();
    };

    $scope.compareTopPaying = function() {
        $scope.selectedCareerNames = savedCareers.topPayingCareers;
        $scope.compare(); 
    }

    $scope.compareFastestGrowing = function() {
        $scope.selectedCareerNames = savedCareers.fastestGrowingCareers; 
        $scope.compare();
    }

    $scope.getCareerNames();

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    localStorage.set('showTour', true);
    $timeout(function() {
        if(localStorage.get('showTour')) {
            localStorage.set('showTour', false);
            $scope.welcomeTourIntro.show();
        }
    }, 1000);
  }]);
