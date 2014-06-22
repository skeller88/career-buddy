'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('epChart', [function() {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {
        //sample data
        var sampleData = [
          {
            'title': 'Management occupations',
            'numberEmployeed': 8861.5,
            'percentChange': 7.2,
            'annualSalary': 93910
          },
          {
            'title': 'Management occupations-duplicate',
            'numberEmployeed': 8861.5,
            'percentChange': 7.6,
            'annualSalary': 93910
          },
          {
            'title': 'Chief executives',
            'numberEmployeed': 330.5,
            'percentChange': 5.3,
            'annualSalary': 168140
          },
          {
            'title': 'Human resources managers',
            'numberEmployeed': 102.7,
            'percentChange': -13.2,
            'annualSalary': 99720
          },
          {
            'title': 'Nurses',
            'numberEmployeed': 200,
            'percentChange': 2,
            'annualSalary': 60000
          }
        ]

        //chart configuration
        var vis = d3.select(element[0])
          .append('svg')
          .style('width', '500px')
          .style('height', '500px');

        //todo- use chart options for range
        var chartWidthStart = 60;
        var chartWidthEnd = 480;
        var chartHeight = 400;
        var chartXAxisVertTranslation = 474;

        var xlabel = "Projected Growth (%)";
        var ylabel = "Median Salary ($)";
        var rlabel = "Number Employeed (1k)";

        //career_percent_emp_change
        var xRange = d3.scale.linear().range([chartWidthStart, chartWidthEnd]).domain([-44, 54]);
        //career_med_ann_wage
        // var yRange = d3.scale.linear().range([40, chartWidthEnd]).domain([18000, 173000]);
        var yRange = d3.scale.linear().range([chartWidthStart, chartWidthEnd]).domain([173000, 18000]);

        var xAxis = d3.svg.axis()
          .scale(xRange);

        var yAxis = d3.svg.axis()
          .scale(yRange)
          .orient('left');

        vis.append("svg:g")
          .call(xAxis)
          .attr('transform', 'translate(0,' + chartXAxisVertTranslation + ')');
        vis.append("svg:g")
          .call(yAxis)
          .attr('transform', 'translate(' + chartWidthStart + ',0)');

        console.log(vis);
        // vis.append('svg:text')
        //   .attr("class", "x label")
        //   .attr("text-anchor", "end")
        //   .attr("x", width)
        //   .attr("y", height - 6)
        //   .text("income per capita, inflation-adjusted (dollars)");

        //event handlers
        // var mouseMove = function() {
        //   var infobox = d3.select(".infobox");
        //   var coord = d3.svg.mouse(this);
        //   // now we just position the infobox roughly where our mouse is
        //   infobox.style("left", coord[0] + 15  + "px" );
        //   infobox.style("top", coord[1] + "px");
        // };

        var mouseOver = function(d) {
          var bubble = d3.select(this);
          bubble.attr("stroke", "#000")
            .attr("stroke-width", 4 );
          var infobox = d3.select(".infobox")
            .style("display", "block" );
          infobox.select("p.state")
            .text( d.state );
          infobox.select("p.xdata")
            .text( xlabel + ": " + d[xlabel] );
          infobox.select("p.ydata")
            .text( ylabel + ": " + d[ylabel] );
        };
         
        var mouseOut = function() {
          var infobox = d3.select(".infobox");
          infobox.style("display", "none" )
          var bubble = d3.select(this);
          bubble.attr("stroke", "none")
        };
       
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

        //add data
        var circles = vis.selectAll('circle').data(sampleData);

        circles
          .enter()
          .insert('circle')
          .attr('cx', function(d) { return xRange(d.percentChange); })
          .attr('cy', function(d) { return yRange(d.annualSalary); })
          .attr('r', function(d) {
            var ne = d.numberEmployeed;

            if(ne < 10) {
              return 2;
            } else if(ne < 100) {
              return 5;
            } else if(ne < 1000) {
              return 10;
            } else {
              return 15;
            }
          })
          .style('fill', function(d) {
            var pc = d.percentChange;

            if(pc < 0) {
              return 'rgba(128, 0, 128, 0.75)';
            } else {
              return 'rgba(255, 0, 0, 0.75)';
            }
          });

        circles
          .exit()
          .remove();
      }
    }
  }]);
