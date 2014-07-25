'use strict';

/* Directives */

angular.module('myApp.directives', ['kendo.directives']).
  directive('skLegendBubbles', ['d3Scales', function(d3Scales) {
      return {
          restrict: 'EA',
          link: function(scope, element, attrs) {
              var bubbleSizes = [10, 100, 1000, 10000];

              var sh = element.height();
              var sw = element.width();

              var margin = {top: 25, right: 5, bottom: 5, left: 25};
              var w = sw - margin.left - margin.right;
              var h = sh - margin.top - margin.bottom;

              var bubblesHeight = 0;
              var labelsHeight = 0;

              var legendHeader = "# Employed: 2012 (thousands)";

              //bubble paddding
              var bpx = 5;
              var bpy = 10;

              //label padding
              var lpx = 30;

              var svg = d3.select(element[0])
                .append('svg')
                .attr('class', 'sk-chart-svg sk-legend-bubbles-content');

              var outerChart = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              outerChart.append('text')
                  .classed('sk-legend-header', true)
                  .text(legendHeader);

              var circles = outerChart.selectAll('circle')
                  .data(bubbleSizes);

              var labels = outerChart.selectAll('circle')
                  .data(bubbleSizes);

              circles.enter().append('circle')
                  .attr('class', 'sk-data-point')
                  .attr('cx', bpx)
                  .attr('cy', function(d, i){ return bubblesHeight += (bpy + d3Scales.bubbleRadiusScale(d)*2); })
                  .attr('r', function(d){ return d3Scales.bubbleRadiusScale(d); })
                  .attr('opacity', function(d) { return d3Scales.bubbleOpacityScale(d); })
                  ;

              labels.enter().append('text')
                  .attr('class', 'sk-legend-bubble-label')
                  .attr('x', lpx)
                  .attr('y', function(d, i){ return labelsHeight += (bpy + d3Scales.bubbleRadiusScale(d)*2); })
                  //svg:text baseline is 'bottom' by default
                  .attr('dominant-baseline', 'middle')
                  .text(function(d){ return d; })
                  ;
          }
      }
  }]).
  directive('skEpChart', ['$window', 'alphabet', 'd3Scales', function($window, alphabet, d3Scales) {
    return {
      restrict: 'EA',
      scope: {
        selectedCareersData: '='
      },
      link: function(scope, element, attrs) {
          // var svg = d3.select(element[0])
          //       .append('svg')
          //       .attr('class', 'sk-chart-svg');

          drawChart();

          d3.select($window).on('resize', drawChart);

          function drawChart() {
              if(d3.select('svg.sk-career-chart')) d3.select('svg.sk-career-chart').remove();

              /* DIMENSIONS */

              //svg
              var sh = element.height();
              var sw = element.width();

              //chart
              var margin = {top: 15, right: 15, bottom: 15, left: 15};
              var padding = {top: 0, right: 0, bottom: 40, left: 50};

              var w = sw - margin.left - margin.right;
              var h = sh - margin.top - margin.bottom;
              var iw = w - padding.left - padding.right;
              var ih = h - padding.top - padding.bottom;

              //bubbles
              var rmin = 4;
              var rmax = 15;

              //tooltip height
              var tth = 28;

              //Margin between labels and chart axes
              var yLabelP = 45;

              //Margin between legend and chart axes
              var xLegendP = 85;
              var yLegendP = 35;

              var xlabel = "Projected Job Growth: 2012-2022 (%)";
              var ylabel = "Median Annual Salary: 2012 (thousands)";
              var rlabel = "# Employed: 2012 (thousands)";
              var legendText = "Legend";

              /* SCALES */

              //career_percent_emp_change in %
              var xScale = d3.scale.linear()
                           .domain([-40, 60])
                           .range([0, iw]);

              //career_med_ann_wage in $1000s
              var yScale = d3.scale.linear()
                           .domain([15, 190])
                           .range([ih, 0]);

              var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

              var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

              /* DRAW CHART */

              var tip = d3.tip()
                  .attr('class', 'sk-tooltip-chart')
                  .offset([-17, -12])
                  .html(function(d) {

                    return '<h4 class="sk-career-name">' + d.career_name + '</h4>' +
                        '<div >' +
                            '<span class="sk-tooltip-label">People employed: </span><span class="sk-tooltip-data">' + d.career_2012_emp + ' (thousands)</span>' +
                        '</div>' +
                        '<div class="sk-emp-change">' +
                            '<span class="sk-tooltip-label">Expected change in demand: </span><span class="sk-tooltip-data">' + d.career_percent_emp_change + '%</span>' +
                        '</div>' +
                        '<div>' +
                            '<span class="sk-tooltip-label">Annual wage: </span><span class="sk-tooltip-data">$' + d.career_med_ann_wage + '</span>' +
                        '</div>'
                  })

              var svg = d3.select(element[0])
                .append('svg')
                .classed('sk-chart-svg sk-career-chart', true);

              svg.call(tip);
              
              var outerChart = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              var innerChart = outerChart.append('g')
                .attr('class', 'innerChart')
                .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

              //axes
              innerChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + (ih) + ')')
                .call(xAxis);

              innerChart.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,0)')
                .call(yAxis);

              //labels - clearer to append to outerChart instead?
              innerChart.append('text')
                .classed('x-label label', true)
                .attr('transform', 'translate(' + (iw/2) + ',' + (h) + ')')
                .text(xlabel);

              innerChart.append('text')
                .classed('y-label label', true)
                .attr('transform', 'translate(' + (0 - yLabelP) + ',' + (ih/2) + ') rotate(-90)')
                .text(ylabel);

              var legend = innerChart.append('g')
                .attr('transform', 'translate(' + (iw - xLegendP) + ',' + (yLegendP) + ')')

              // var legendDiv = legend.append('foreignObject')
              //   .attr('width', 200)
              //   .attr('height', 200)
              // .append('xhtml:div')
              //   .style('fill', 'red');
                // .style("stroke-width", 2).style("stroke", "black");

              // legendDiv.append('rect')
              //   .attr('width', xLegendP)
              //   .attr('height', yLegendP)
              //   .attr('id', 'sk-legend-border');

              // legend.append('text')
              //   .attr('id', 'sk-legend-link')
              //   .text(legendText);

              // d3.select("#sk-legend-link").on("click", showLegend);

              function updateGraph() {
                //add data
                var circles = innerChart.selectAll('circle')
                    .data(scope.selectedCareersData, function(d) { return d.career_name; })

                var labels = innerChart.selectAll('text.careerBubbleLabel')
                    .data(scope.selectedCareersData, function(d) { return d.career_name; })

                circles.enter().append('circle')
                  .classed( 'sk-data-point', true)
                  .attr('cx', function(d) { return xScale(d.career_percent_emp_change); })
                  .attr('cy', function(d) { return yScale(d.career_med_ann_wage/1000); })
                  .attr('r', 0)
                  .attr('opacity', 0)
                  .on('mouseover', tip.show)
                  .on('mouseout', tip.hide)
                  .transition()
                    .delay(function(d, i) { return i * 100; })
                    .duration(1000)
                    .attr('r', function(d) { return d3Scales.bubbleRadiusScale(d.career_2012_emp); })
                    .attr('opacity', function(d) { return d3Scales.bubbleOpacityScale(d.career_2012_emp); });

                labels.enter().append('text')
                    .classed('careerBubbleLabel', true)
                    .attr('text-anchor', 'middle')
                    .text(function(d, i){ return alphabet[i]; })
                    .attr('x', function(d) { return xScale(d.career_percent_emp_change); })
                    //2 is arbitrary distance to provide space between bubble and label 
                    .attr('y', function(d) { return yScale(d.career_med_ann_wage/1000) - d3Scales.bubbleRadiusScale(d.career_2012_emp) - 2; })
                    .attr('opacity', 0)
                    .transition()
                      .delay(function(d, i) { return i * 100; })
                      .duration(1000)
                      .attr('opacity', function(d) { return d3Scales.bubbleOpacityScale(d.career_2012_emp)});

                labels.text(function(d, i){ return alphabet[i]; })

                circles.exit().transition()
                    .duration(500)
                    .attr('r', 0)
                    .remove();

                labels.exit().transition()
                    .duration(500)
                    .attr('opacity', 0)
                    .remove();

              }

              updateGraph();

              scope.$watch('selectedCareersData', function() {
                  updateGraph();
              });
          }

          // svg.append('svg:text')
          //   .attr('transform', 'rotate(90)')
          //   .attr('class', 'y-label label')
          //   .attr('text-anchor', 'end')
          //   .attr('transform', 'translate(' + (w - xp) + ',' + (h + lpx) + ')')
          //   // .attr('transform', 'translate(' + (h/2) + ',' + (0 - lpy) + ')')
          //   .text(ylabel);

          // svg.append('svg:text')
          //   .attr('class', 'y-label label')
          //   .attr('text-anchor', 'end')
          //   .attr('transform', 'translate(' + (w - xp) + ',' + (h + 4*lpx) + ')')
          //   // .attr('transform', 'translate(' + (h/2) + ',' + (0 - lpy) + ')')
          //   .text(ylabel);

          // add <p> elements to our infobox. later we will enter our crime data there
          // var infobox = d3.select(".infobox");
          // infobox.append("p")
          //   .attr("class", "state" );
          // infobox.append("p")
          //   .attr("class", "xdata" );
          // infobox.append("p")
          //   .attr("class", "ydata" );
      }
    }
  }]);
