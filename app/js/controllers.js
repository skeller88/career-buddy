'use strict';

/* Controllers */

angular.module('myApp.controllers', ['kendo.directives'])
  .controller('HomeCtrl', ['$log', '$scope', '$timeout', 'careersService', 'd3Scales', 'localStorage', 'mergeSort', 'savedCareers', function($log, $scope, $timeout, careersService, d3Scales, localStorage, mergeSort, savedCareers) {
    //variables
    $scope.selectedCareersData = [];
    $scope.selectedCareerNames = [];
    $scope.savedCareers = savedCareers;
    //prevents flicker of kendo window widget 
    $scope.isLegendShown = false;
    $scope.isLegendButtonDisabled = true;
    var preselectedTipCounter = 0;
    var legendTipCounter = 0;
    var isStubbedD3 = false;
    var dataSource = new kendo.data.DataSource({
        data: []
    });

    //kendo widgets

    //tooltips for tour functionality - must be in reverse order of their appearance in tour

    $scope.preselectedTipOptions = {
        autohide: false,
        content: 'In addition to custom searches, you can compare any of the above preselected groups of careers.',
        hide: function() {
            //only show tooltip 3 times
            if(++preselectedTipCounter > 3) {
                $timeout(function() {
                    $scope.preselectedTip.destroy();
                }, 3000)
            }
        },
        position: 'bottom'
    }

    $scope.legendTipOptions = {
        autohide: false,
        content: 'Use the legend to interpret information displayed on the chart.',
        hide: function() {
            if(++legendTipCounter > 3) {
                $timeout(function() {
                    $scope.legendTip.destroy();
                }, 3000)
            }
        },
        position: 'top'
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
        careersService.getCareerNames().success(function(data) {
            dataSource.data(data);
            $scope.careerNames = data;
            //ensures that multiselect widget only fades in when career names have been loaded
            $scope.careerNamesLength = data.length;
            $scope.selectedCareerNames = localStorage.get('careerNames') || [];

            if($scope.selectedCareerNames.length > 1 && $scope.selectedCareerNames.length < 5) {
                $scope.compare();
            }
        }).error(function(err) {
            $log.error('getCareerNames error: ', err);
        }); 
    }

    $scope.getDataAndShowChart = function(careerNames) {
        var careerNames = careerNames || $scope.selectedCareerNames;
        careersService.getCareerData(careerNames).success(function(data) {
            $scope.selectedCareersData = data.sort(function(a, b) {
                if (a.career_name > b.career_name)
                   return 1;
                if (a.career_name < b.career_name)
                   return -1;
                // a must be equal to b
                return 0;
            })

            if(localStorage.get('showTooltips')) $scope.legendTip.show();
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

        /* necessary to reset 'isLegendButtonDisabled' flag in case user no longer
        uses buttons that generate predetermined comparisons and instead
        enters their own comparisons */ 
        $scope.isLegendButtonDisabled = false;
        $scope.getDataAndShowChart();
    };

    $scope.compareTopPaying = function() {
        //will be disabled otherwise because $scope.selectedCareerNames === []
        $scope.isLegendButtonDisabled = false;
        $scope.resetSelected();
        $scope.getDataAndShowChart(savedCareers.topPayingCareers);
    }

    $scope.compareFastestGrowing = function() {
        $scope.isLegendButtonDisabled = false;
        $scope.resetSelected();
        $scope.getDataAndShowChart(savedCareers.fastestGrowingCareers);
    }

    $scope.compareRandom = function() {
        $scope.isLegendButtonDisabled = false;
        $scope.resetSelected();

        var randomCareers = (function() {
            var randomCareerNames = [];
            var careersNamesChosen = {};

            //number 10 chosen to provide optimal UI. More user feedback will provide insight on a better number, if there is one.
            for(var i = 0; i < 10; i++) {
                var randomCareerInd = Math.floor(Math.random() * $scope.careerNamesLength);
                var randomCareer = $scope.careerNames[randomCareerInd].career_name;

                if(!(randomCareer in careersNamesChosen)) {
                    randomCareerNames.push(randomCareer);
                    careersNamesChosen[randomCareer] = true;
                }
            }

            return randomCareerNames;
        })();

        $scope.getDataAndShowChart(randomCareers);
    }

    $scope.addHighlight = function(careerNum) {
        
        d3.select('.sk-data-point-num-' + careerNum)
            .classed({'sk-data-point-selected': true, 'sk-data-point': false})
    }

    $scope.removeHighlight = function(careerNum) {
        d3.select('.sk-data-point-num-' + careerNum)
            .classed({'sk-data-point-selected': false, 'sk-data-point': true})
    }

    $scope.getCareerNames();

    if(isStubbedD3) {
        $scope.selectedCareerNames = ['Teachers and instructors, all other', 'Software developers and programmers', 'Nurse practitioners', 'Police officers'];
    }

    //need to wait until kendo tooltips have been added to the DOM before invoking callback function 
    $timeout(function() {
        if(localStorage.get('showTooltips')) {
            localStorage.set('showTooltips', false);
        } else {
            //destroying tooltips removes their event handlers, but still can
            //invoke their .show() and .hide() methods from within controller
            $scope.preselectedTip.destroy();
            $scope.legendTip.destroy();
        }
    }, 1000);
  }]);

var a = [
    {name: 'a'},
    {name: 'b'},
    {name: 'c'},
    {name: 'd'},
    {name: 'e'},
    {name: 'f'},
    {name: 'g'},
    {name: 'h'},
    {name: 'i'},
    {name: 'j'},
    {name: 'k'},
    {name: 'l'},
]

a.sort(function(a, b) { return a.name > b.name; });
