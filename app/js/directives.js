'use strict';

/* Directives */

angular.module('myApp.directives', ["kendo.directives"]).
  directive('skEpChart', [function() {
    return {
      restrict: 'EA',
      scope: {
        selectedCareersData: '='
      },
      link: function(scope, element, attrs) {

          scope.$watch('selectedCareersData', function(newData, oldData) {
            if(scope.selectedCareersData.length) {
              updateGraph(newData);
            }
          });

          //chart configuration
          //todo- use chart options for range
          var w = 500;
          var h = 500;

          //sizes of bubbles 
          var rmin = 4;
          var rmax = 15;

          //padding between axes and edges of svg
          var xp = 90;
          var yp = 40;

          //padding between labels and axes
          var xlp = 5;
          var ylp = 1;

          var svg = d3.select(element[0])
            .append('svg')
            .attr('class', 'chart')
            .attr('width', w + xp)
            .attr('height', h + yp);

          var xlabel = "Projected Job Growth: 2012-2022 (%)";
          var ylabel = "Median Annual Salary ($)";
          var rlabel = "Number Employeed (1k)";

          //career_percent_emp_change
          var xScale = d3.scale.linear()
                       .domain([-40, 60])
                       .range([xp, w]);
          //career_med_ann_wage
          var yScale = d3.scale.linear()
                       .domain([15000, 175000])
                       .range([h - yp, yp]);
          //career_2012_emp
          var rScale = d3.scale.linear()
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
            .attr('transform', 'translate(0,' + (h - yp) + ')')
            .call(xAxis);

          svg.append('svg:g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + xp + ',0)')
            .call(yAxis)
            .append('text')
            .attr('class', 'y-label label')
            .attr('transform', 'rotate(-90)')
            .attr('transform', 'translate(' + (0 - ylp) + ',0)')
            .style('text-anchor', 'end')
            .text(ylabel);

          //labels
          svg.append('svg:text')
            .attr('class', 'x-label label')
            .attr('text-anchor', 'end')
            .attr('transform', 'translate(' + (w - xp) + ',' + (h + xlp) + ')')
            .text(xlabel);

          if(!scope.selectedCareersData.length) {
            return;
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

          //event handlers
          // var mouseMove = function() {
          //   var infobox = d3.select(".infobox");
          //   var coord = d3.svg.mouse(this);
          //   // now we just position the infobox roughly where our mouse is
          //   infobox.style("left", coord[0] + 15  + "px" );
          //   infobox.style("top", coord[1] + "px");
          // };

          // var mouseOver = function(d) {
          //   var bubble = d3.select(this);
          //   bubble.attr("stroke", "#000")
          //     .attr("stroke-width", 4 );
          //   var infobox = d3.select(".infobox")
          //     .style("display", "block" );
          //   infobox.select("p.state")
          //     .text( d.state );
          //   infobox.select("p.xdata")
          //     .text( xlabel + ": " + d[xlabel] );
          //   infobox.select("p.ydata")
          //     .text( ylabel + ": " + d[ylabel] );
          // };
           
          // var mouseOut = function() {
          //   var infobox = d3.select(".infobox");
          //   infobox.style("display", "none" )
          //   var bubble = d3.select(this);
          //   bubble.attr("stroke", "none")
          // };
         
          // attach function to run when mouse is moved anywhere on svg
          // d3.select("svg")
          //   .on("mousemove", mouseMove );
         
          // add <p> elements to our infobox. later we will enter our crime data there
          var infobox = d3.select(".infobox");
          infobox.append("p")
            .attr("class", "state" );
          infobox.append("p")
            .attr("class", "xdata" );
          infobox.append("p")
            .attr("class", "ydata" );

          function updateGraph(data) {
            //add data
            var circles = svg.selectAll('circle').data(data);

            circles
              .enter()
              .append('circle')
              .attr('cx', function(d) { return xScale(d.career_percent_emp_change); })
              .attr('cy', function(d) { return yScale(d.career_med_ann_wage); })
              .attr('r', function(d) {
                return rScale(d.career_2012_emp);
              })
              .style('fill', function(d) {
                var pc = d.career_percent_emp_change;

                if(pc < 0) {
                  return 'rgba(128, 0, 128, 0.75)';
                } else {
                  return 'rgba(255, 0, 0, 0.75)';
                }
              });
              // .attr('k-content', 'I\'m a tooltip')
              // .attr('kendo-tooltip');

            circles
              .exit()
              .remove();
          }

          updateGraph(scope.selectedCareersData);
      }
    }
  }]);
