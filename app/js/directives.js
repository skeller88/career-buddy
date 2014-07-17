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
          $('.sk-career-selector').resize(drawChart);

          function drawChart() {
              if(d3.select('svg')) d3.select('svg').remove();

              console.log($window.innerHeight);
              console.log($('.sk-multi-select-container').css('height'));
              console.log($('.sk-career-selector').height());
              console.log($('.sk-navbar-background').css('height'));

              //svg dimensions
              /* .sk-career-selector has a total height of 210px */
              // var sh = $window.innerHeight - 210 - $('.sk-navbar-background').height();
              // var sh = $window.innerHeight - $('.sk-career-selector').height() - $('.sk-navbar-background').height();
              var sh = element.height();
              var sw = element.width();

              //chart dimensions
              var margin = {top: 15, right: 15, bottom: 15, left: 15};
              var padding = {top: 0, right: 0, bottom: 40, left: 50};

              var w = sw - margin.left - margin.right;
              var h = sh - margin.top - margin.bottom;
              var iw = w - padding.left - padding.right;
              var ih = h - padding.top - padding.bottom;

              //Margin between labels and axes of chart
              var xlp = 15;
              var ylp = 40;

              //sizes of bubbles 
              var rmin = 4;
              var rmax = 15;

              var svg = d3.select(element[0])
                .append('svg')
                .attr('class', 'sk-chart-svg')
                .style('border', '1px solid red')
                // .attr('viewBox','0 0 '+ Math.min(sw,sh) +' '+ Math.min(sw,sh))
                // .attr('preserveAspectRatio','xMinYMin')
              
              var outerChart = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .style('background-color', '1px solid green');

              var innerChart = outerChart.append('g')
                .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

              var xlabel = "Projected Job Growth: 2012-2022 (%)";
              var ylabel = "Median Annual Salary: 2012 ($1000s)";
              var rlabel = "Number Employeed: 2012 (1k)";

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

              innerChart.append('g')
                .attr('class', 'y-label label')
                .attr('transform', 'translate(' + (0 - ylp) + ',' + (ih/2) + ')')
              .append('text')
                .style('text-anchor', 'middle')
                .attr('transform', 'rotate(-90)')
                .text(ylabel);

              function updateGraph() {
                //add data
                var circles = innerChart.selectAll('circle').data(scope.selectedCareersData);

                circles
                  .enter()
                  .append('circle')
                  .attr('cx', function(d) { return xScale(d.career_percent_emp_change); })
                  .attr('cy', function(d) { return yScale(d.career_med_ann_wage/1000); })
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
