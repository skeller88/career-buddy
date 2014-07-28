#Test Plan

* = automated

##End to end
####When app loaded
Precondition: No careers entered
Postcondition: empty multiselect, no chart

Precondition: 1 career entered, chart button clicked
Postcondition: multiselect with 1 career, no chart

Precondition: 2 careers, chart button clicked
Postcondition: multiselect with 2 careers, chart

Precondition: 6 careers, chart button clicked
Postcondition: multiselect with 6 careers, no chart, error message

####After app loaded
Precondition: 1 career entered, chart button clicked
Postcondition: multiselect with 1 career, no chart

Precondition: 2 careers entered, chart button clicked
Postcondition: multiselect with 2 careers, chart

Precondition: 6 careers entered, chart button clicked
Postcondition: multiselect with 6 careers, no chart, error message

Precondition: 2 careers previously entered, 1 career deleted
Postcondition:

Precondition: 3 careers previously entered, 1 career deleted
Postcondition:

Precondition: 3 careers previously entered, 1 career added
Postcondition:

Precondition: 3 careers previously entered, 1 career added, 1 career deleted
Postcondition: 

Precondition: 6 careers previously entered, 1 career deleted
Postcondition: multiselect with 5 careers, chart

##App
####UI
Clicking on navbar links changes the page content

Pages transition out to the left and in from the right

No flickers of unstyled content
No flickers of improperly postioned content (kendo window widget)

CSS
- colors
- CSS3 works in newest versions of Chrome, Mozilla, Safari, and IE (10+):
   - animation, box-shadow, border-box, border-radius, keyframes, text-shadow, transform, transition

Buttons
- "Chart" and "Legend" buttons disabled when < 2 careers || > 5 careers entered in multiselect, and enabled otherwise
- "Highest paying careers" and "Fastest growing careers" buttons generate a chart containing the highest paying and fastest growing careers, respectively 
- Clicking on "Legend" button causes legend to appear in center of window
- Clicking on "Reset" clears all currently selected careers from multiselect and localstorage 

###UI - chart
When hovering over a career in legend, the corresponding bubble for that career is highlighted

Chart width and height are responsive

Entering data transitions in a staggered manner (if multiple entering data)

Chart redraws on window resize event

###Util


##Src

###Models
careers.js
- retrieves all career names
- retrieves career data for specific careers

###Server
server.js
- when requested all career names, responds with an array of {career_name: [name]} 
- when requested career data for specific careers, responds with an array of {career_name: [name], career_2012_emp: [emp], ...}

- handles x # of requests per y ms
- when # of requests exceeds server capacity, does z 

###Util 
nearCache.js
* retrieves correct data for requests that have already been made
* retrieves correct data for requests that have not been made before, and stores the new data in the cache
- requests for a cached resource take <5ms 
- stores x requests in memory
- when memory exceeded, does y

dbHelpers.js
* connects to correct database
* connection object has orm methods

###Database
- has a backup database if it fails
- handles x # of requests per x
- when # of requests exceeds server capacity, does z 