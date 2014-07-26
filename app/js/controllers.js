'use strict';

/* Controllers */

angular.module('myApp.controllers', ['kendo.directives'])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'alphabet', 'careersAPI', 'd3Scales', 'localStorage', 'savedCareers', function($log, $scope, $timeout, alphabet, careersAPI, d3Scales, localStorage, savedCareers) {
    //variables
    $scope.alphabet = alphabet;
    $scope.selectedCareersData = [];
    $scope.selectedCareerNames = [];
    $scope.savedCareers = savedCareers;
    //prevents flicker of kendo window widget 
    $scope.showLegend = false;
    $scope.disableLegendButton = true;
    $scope.showWelcomeTip = false;
    $scope.showChartTip = false;
    $scope.welcomeTourIntro = 'uninitialized';
    var isStubbedD3 = false;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

    //kendo widgets

    //tooltips for tour functionality - must be in reverse order of their appearance in tour

    $scope.moneyTipOptions = {
        autohide: false,
        content: 'Select and compare the highest paying careers.',
        hide: function() {
            $timeout(function() {
                $scope.moneyTip.destroy();
            }, 1000)
        },
        position: 'top'
    }

    $scope.growthTipOptions = {
        autohide: false,
        content: 'Select and compare the fastest growing careers.',
        hide: function() {
            $timeout(function() {
                $scope.growthTip.destroy();
            }, 1000)
        },
        position: 'bottom'
    }

    $scope.selectOptions = {    
        autoBind: false,
        dataTextField: "career_name",
        dataValueField: "career_name",
        dataSource: dataSource,
        placeholder: 'Select at least two careers to compare.',
        filter: 'contains'
    };

    //prevents flicker of overflow scrollbar
    $scope.tabStripOptions = {
        animation: false
    }

    //get career data 
    $scope.getCareerNames = function() {
        careersAPI.getCareerNames().success(function(data) {
            console.log(data);
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

    $scope.getDataAndShowChart = function(careerNames) {
        var careerNames = careerNames || $scope.selectedCareerNames;
        careersAPI.getCareerData(careerNames).success(function(data) {
            $scope.selectedCareersData = data;
        }).error(function(data, status) {
            $log.error('getCareerData error: ', data, status);
        });
    }

    //event handlers
    $scope.resetSelected = function() {
        $scope.selectedCareerNames = [];
        localStorage.set('careerNames', $scope.selectedCareerNames);
    }

    $scope.compare = function() {
        localStorage.set('careerNames', $scope.selectedCareerNames);

        /* necessary to reset 'disableLegendButton' flag in case user no longer
        uses buttons that generate predetermined comparisons and instead
        enters their own comparisons */ 
        $scope.disableLegendButton = true;
        $scope.getDataAndShowChart();
    };

    $scope.compareTopPaying = function() {
        //will be disabled otherwise because $scope.selectedCareerNames === []
        $scope.disableLegendButton = false;
        $scope.resetSelected();
        $scope.getDataAndShowChart(savedCareers.topPayingCareers);
    }

    $scope.compareFastestGrowing = function() {
        $scope.disableLegendButton = false;
        $scope.resetSelected();
        $scope.getDataAndShowChart(savedCareers.fastestGrowingCareers);
    }

    $scope.getCareerNames();

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    localStorage.set('showTooltips', true);
    $timeout(function() {
        if(localStorage.get('showTooltips')) {
            localStorage.set('showTooltips', false);
        } else {
            $scope.moneyTip.destroy();
            $scope.growthTip.destroy();
        }
    }, 1000);
  }]);
