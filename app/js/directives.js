'use strict';

/* Directives */

angular.module('myApp.directives', ['kendo.directives']).
  directive('skEpChart', ['$window', 'alphabet', function($window, alphabet) {
    return {
      restrict: 'EA',
      scope: {
        selectedCareersData: '='
      },
      link: function(scope, element, attrs) {

          drawChart();

          d3.select($window).on('resize', drawChart);
          $('.sk-career-selector').resize(drawChart);

          function drawChart() {
              if(d3.select('svg')) d3.select('svg').remove();

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
              var xLegendP = 15;
              var yLegendP = 15;


              var xlabel = "Projected Job Growth: 2012-2022 (%)";
              var ylabel = "Median Annual Salary: 2012 ($1000s)";
              var rlabel = "Number Employeed: 2012 (1k)";
              var legendText = "Legend";

              /* SCALES */

              //career_percent_emp_change in %
              var xScale = d3.scale.linear()
                           .domain([-40, 60])
                           .range([0, iw]);

              //career_med_ann_wage in $1000s
              var yScale = d3.scale.linear()
                           .domain([15, 175])
                           .range([ih, 0]);

              //career_2012_emp
              var rScale = d3.scale.log()
                           .domain([.4,145355])
                           .range([rmin, rmax]);

              var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

              var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');

              /* DRAW CHART */

              var tip = d3.tip()
                  .attr('class', 'sk-tooltip')
                  .offset([-17, -12])
                  .html(function(d) {

                    return '<h4 class="sk-career-name">' + d.career_name + '</h4>' +
                        '<div >' +
                            '<span class="sk-tooltip-label">People employed: </span><span class="sk-tooltip-data">' + d.career_2012_emp + '</span>' +
                        '</div>' +
                        '<div class="sk-emp-change">' +
                            '<span class="sk-tooltip-label">Expected change in demand : </span><span class="sk-tooltip-data">' + d.career_percent_emp_change + '%</span>' +
                        '</div>' +
                        '<div>' +
                            '<span class="sk-tooltip-label">Annual wage: </span><span class="sk-tooltip-data">$' + d.career_med_ann_wage + '</span>' +
                        '</div>'
                  })

              var svg = d3.select(element[0])
                .append('svg')
                .attr('class', 'sk-chart-svg');

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
                .attr('class', 'x-label label')
                .attr('text-anchor', 'middle')
                .attr('transform', 'translate(' + (iw/2) + ',' + (h) + ')')
                .text(xlabel);

              innerChart.append('text')
                .attr('class', 'y-label label')
                .attr('transform', 'translate(' + (0 - yLabelP) + ',' + (ih/2) + ') rotate(-90)')
                .style('text-anchor', 'middle')
                .text(ylabel);

              var legend = innerChart.append('div')
                .attr('class', 'sk-legend')
                .attr('ng-click', 'blah')
                .attr('transform', 'translate(' + xLegendP + ',' + (ih - yLegendP) + ')')
                .text(legendText);

              function updateGraph() {
                //add data
                var circles = innerChart.selectAll('circle').data(scope.selectedCareersData);

                circles
                  .enter()
                  .append('circle')
                  .attr('class', 'sk-data-point')
                  .attr('cx', function(d) { return xScale(d.career_percent_emp_change); })
                  .attr('cy', function(d) { return yScale(d.career_med_ann_wage/1000); })
                  .attr('r', function(d) { return rScale(d.career_2012_emp); })
                  .on('mouseover', tip.show)
                  .on('mouseout', tip.hide);

                circles
                  .enter()
                  .append('text')
                  .attr('class', 'careerBubbleLabel')
                  .attr('text-anchor', 'middle')
                  .text(function(d, i){ return alphabet[i]; })
                  .attr('x', function(d) { return xScale(d.career_percent_emp_change); })
                  //2 is arbitrary distance to provide space between bubble and label 
                  .attr('y', function(d) { return yScale(d.career_med_ann_wage/1000) - rScale(d.career_2012_emp) - 2; });

                circles
                  .exit()
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
