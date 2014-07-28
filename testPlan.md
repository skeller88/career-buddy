#Test Plan

* = automated

##End to end
####When app loaded
Precondition: Navigation to http://career-buddy-production.herokuapp.com/#/
Postcondition: Page has a multiselect menu, navbar, and buttons

Precondition: Navigation to http://career-buddy-production.herokuapp.com/#/about
Postcondition: About page with 'powered by' images

Precondition: Navigation to http://career-buddy-production.herokuapp.com/#/contact
Postcondition: Contact page

Precondition: User did not previously select any careers
Postcondition: multiselect with no careers, no chart

Precondition: User previously selected 1 career
Postcondition: multiselect with no careers, no chart

Precondition: User previously selected and charted 2 careers
Postcondition: multiselect with 2 careers, chart with data from those careers

Precondition: User previously selected 6 careers
Postcondition: multiselect with 6 careers, no chart, error message

####After app loaded
Precondition: 1 career entered, "Chart" button clicked
Postcondition: multiselect with 1 career, no chart

Precondition: 2 careers entered, "Chart" button clicked
Postcondition: multiselect with 2 careers, chart with data from those careers

Precondition: 6 careers entered, "Chart" button clicked
Postcondition: multiselect with 6 careers, no chart, error message

Precondition: 2 careers previously entered, 1 career deleted, "Chart" button clicked
Postcondition: no change in chart

Precondition: 3 careers previously entered, 1 career deleted, "Chart" button clicked
Postcondition: bubble for deleted career is removed from chart

Precondition: 3 careers previously entered, 1 career added, "Chart" button clicked
Postcondition: bubble for added career is added to chart

Precondition: 3 careers previously entered, 1 career added, 1 career deleted
Postcondition: bubble for deleted career is removed from chart, bubble for added career is added

Precondition: 6 careers previously entered, 1 career deleted
Postcondition: multiselect with 5 careers, chart with data from those careers

Precondition: "Highest paying" button clicked
Postcondition: chart with data from highest paying careers 

Precondition: "Fastest growing" button clicked
Postcondition: chart with data from fastest growing careers

Precondition: "I feel lucky" button clicked
Postcondition: chart with data from random set of careers

##App
####UI
Clicking on navbar links changes the page content

Pages transition out to the left and in from the right

No flash of unstyled content such as:
- Angular expressions
- kendo window widget

CSS
- colors
- CSS3 works in newest versions of Chrome, Mozilla, Safari, and IE10+:
   - animation, box-shadow, border-box, border-radius, keyframes, text-shadow, transform, transition

HTML layout as expected in Chrome, Mozilla, Safari, and IE10+
- navbar, multiselect widget, and buttons are fixed height
- chart height is responsive

Buttons
- "Chart" and "Legend" buttons disabled when < 2 careers || > 5 careers entered in multiselect, and enabled otherwise
- Clicking on "Legend" button causes legend to appear in center of window
- Clicking on "Reset" clears all currently selected careers from multiselect and localstorage 

Chart
- When hovering over a career in legend, the corresponding bubble for that career is highlighted
- Chart width and height are responsive
- Entering data transitions in a staggered manner (if multiple entering data)
- Chart redraws on window resize event

####js
app.js
- '/', '/about', '/contact', and '*path' routes are routed to the correct partial and controller

controllers.js
'HomeCrtl'
- kendo tooltips are added to "Highest paying" and "Fastest growing" buttons for new users, and destroyed 3sec after the tooltips are hidden
- kendo multiselect allows user to search careers by the letters contained in the career name
- getCareerNames() - career names that user can search are loaded when controller is created
- getDataAndShowChart() - given an array of career names, sets $scope.selectedCareersData === the data for those careers sorted in alphabetical order of career name
- resetSelected() - sets $scope.selectedCareerNames to `[]`
- compare(), compareTopPaying(), compareFastestGrowing(), compareRandom() - set $scope.selectedCareersData === expected values 
- addHighlight(), removeHighlight() - adds and removes css classes from correct d3 bubbles

directives.js
'skLegendBubbles'
- renders 4 bubbles in a column in increasing order of size 
- bubbles have proper labels

'skEpChart'
- renders a bubble chart consisting of bubbles
- enter selections transition in by expanding 
- bubbles have tooltips consisting of proper data
- has x and y axes with proper labels
- handles enter, update, and remove selections

services.js
'careersAPI'
- getCareerNames(), getCareerData() - return expected data, cache data that has already been retrieved

'd3Scales'
- bubbleRadiusScale(), bubbleOpacityScale() - output expected float given a certain float

'localStorage'
- get() retrieves a value from window.localStorage
- set() sets a value in window.localStorage
- both of the above functions work for all data types

'savedCareers'
- fastestGrowingCareers, topPayingCareers, and topGrowingCareers have expected values

###Util
mergeSort.js
- returns a stably sorted array

##Src

###Models
careers.js
- retrieves all career names
- retrieves career data for specific careers

###Server
server.js
- when requested all career names, responds with an array of {career_name: [name]} 
- when requested career data for specific careers, responds with an array of {career_name: [name], career_2012_emp: [emp], ...}

###Util 
nearCache.js
* retrieves correct data for requests that have already been made
* retrieves correct data for requests that have not been made before, and stores the new data in the cache

dbHelpers.js
* connects to correct database
* connection object has orm methods

###Database
- switches to backup database if production database fails
