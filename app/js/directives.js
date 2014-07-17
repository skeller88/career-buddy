'use strict';

/* Directives */

angular.module('myApp.directives', ['kendo.directives']).
  directive('skEpChart', ['$window', function($window) {
    return {
      restrict: 'EA',
      scope: {
        selectedCareersData: '='
      },
      link: function(scope, element, attrs) {

          drawChart();

          d3.select($window).on('resize', drawChart);

          function drawChart() {
              if(d3.select('svg')) d3.select('svg').remove();

              //svg dimensions
              var sw = element.width();
              var sh = element.height();

              console.log(sw, sh);

              //chart margins
              var margin = {top: 10, right: 10, bottom: 20, left: 20};

              //chart dimensions
              var w = sw - margin.left - margin.right;
              var h = sh - margin.top - margin.bottom;

              //Margin between labels and axes
              var xlp = 10;
              var ylp = 10;

              //legend dimensions
              var lw = sw/5;
              var lh = sh/5;

              //sizes of bubbles 
              var rmin = 4;
              var rmax = 15;

              var svg = d3.select(element[0])
                .append('svg')
                .attr('class', 'sk-chart-svg')
                .attr('viewBox','0 0 '+ Math.min(sw,sh) +' '+ Math.min(sw,sh))
                .attr('preserveAspectRatio','xMinYMin')
              .append("g")
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

              var xlabel = "Projected Job Growth: 2012-2022 (%)";
              var ylabel = "Median Annual Salary: 2012 ($)";
              var rlabel = "Number Employeed: 2012 (1k)";

              //career_percent_emp_change
              var xScale = d3.scale.linear()
                           .domain([-40, 60])
                           .range([0, w]);
              //career_med_ann_wage
              var yScale = d3.scale.linear()
                           .domain([15000, 175000])
                           .range([h, 0]);
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
                
              //axes
              svg.append('svg:g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + (h) + ')')
                .call(xAxis);

              svg.append('svg:g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,0)')
                .call(yAxis)
                .append('text')
                .attr('class', 'y-label label')
                .attr('transform', 'rotate(-90)')
                // .attr('transform', 'translate(' + '0,' + (0 - ylp) + ')')
                .style('text-anchor', 'end')
                .text(ylabel);

              //labels
              svg.append('svg:text')
                .attr('class', 'x-label label')
                .attr('text-anchor', 'end')
                .attr('transform', 'translate(' + (w/2) + ',' + (sh - xlp) + ')')
                .text(xlabel);

              //legend 
              var legend = svg.append('svg:g')
                .attr('class', 'chartLegend')
                .attr('width', lw)
                .attr('height', lh)
                .attr('transform', 'translate(' + (sw - lw) + ',' + (lh) + ')');

              legend.append('text')
                .text('Legend');

              function updateGraph() {
                //add data
                var circles = svg.selectAll('circle').data(scope.selectedCareersData);
                var legendData = legend.selectAll('text').data(scope.selectedCareersData);

                circles
                  .enter()
                  .append('circle')
                  .attr('cx', function(d) { return xScale(d.career_percent_emp_change); })
                  .attr('cy', function(d) { return yScale(d.career_med_ann_wage); })
                  .attr('r', function(d) { return rScale(d.career_2012_emp); })
                  .style('fill', function(d) {
                    var pc = d.career_percent_emp_change;

                    if(pc < 0) {
                      return 'rgba(128, 0, 128, 0.75)';
                    } else {
                      return 'rgba(255, 0, 0, 0.75)';
                    }
                  });

                circles
                  .enter()
                  .append('text')
                  .attr('class', 'careerBubbleLabel')
                  .text(function(d, i){ return i; })
                  .attr('x', function(d) { return xScale(d.career_percent_emp_change); })
                  //why is the origin of this element in the bottom left corner, rather than the top left? 
                  .attr('y', function(d) { return yScale(d.career_med_ann_wage) - rScale(d.career_2012_emp); });

                circles
                  .exit()
                  .remove();

                legendData
                  .enter()
                  .append('text')
                  .attr('y', function(d, i) { return i*15; })
                  .text(function(d, i) { return i + ": " + d.career_name; });
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
