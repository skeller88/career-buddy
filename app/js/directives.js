'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('epChart', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        var vis = d3.select(element[0])
          .append('svg')
          .style('width', '500px')
          .style('height', '500px');

        //todo- use chart options for range
        var chartWidthStart = 60;
        var chartWidthEnd = 480;
        var chartHeight = 400;
        var chartXAxisVertTranslation = 474;

        //career_percent_emp_change
        var xRange = d3.scale.linear().range([chartWidthStart, chartWidthEnd]).domain([-44, 54]);
        //career_med_ann_wage
        // var yRange = d3.scale.linear().range([40, chartWidthEnd]).domain([18000, 173000]);
        var yRange = d3.scale.linear().range([chartWidthStart, chartWidthEnd]).domain([173000, 18000]);

        console.log(xRange);
        var xAxis = d3.svg.axis()
          .scale(xRange);

        var yAxis = d3.svg.axis()
          .scale(yRange)
          .orient('left');

        vis.append("svg:g").call(xAxis).attr('transform', 'translate(0,' + chartXAxisVertTranslation + ')');
        vis.append("svg:g").call(yAxis).attr('transform', 'translate(' + chartWidthStart + ',0)');
      }
    }
  }]);
