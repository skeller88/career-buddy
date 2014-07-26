#Test Plan

###End to end
####When app loaded
Precondition: No careers entered
Postcondition: empty multiselect, no chart

Precondition: 1 career entered, chart button clicked
Postcondition: multiselect with 1 career, no chart

Precondition: 2 careers, chart button clicked
Postcondition: multiselect with 2 careers, chart

Precondition: 21 careers, chart button clicked
Postcondition: multiselect with 21 careers, no chart, error message

####After app loaded
Precondition: 1 career entered, chart button clicked
Postcondition: multiselect with 1 career, no chart

Precondition: 2 careers entered, chart button clicked
Postcondition: multiselect with 2 careers, chart

Precondition: 21 careers entered, chart button clicked
Postcondition: multiselect with 21 careers, no chart, error message

Precondition: 2 careers previously entered, 1 career deleted
Postcondition:

Precondition: 3 careers previously entered, 1 career deleted
Postcondition:

Precondition: 3 careers previously entered, 1 career added
Postcondition:

Precondition: 3 careers previously entered, 1 career added, 1 career deleted
Postcondition:

Precondition: 21 careers previously entered, 1 career deleted

####UI
Clicking on navbar links changes the page content

Pages transition out to the left and in from the right

No flickers of unstyled content
No flickers of improperly postioned content (kendo window widget)

CSS as expected
- colors
- CSS3 works in newest versions of Chrome, Mozilla, Safari, and IE (10+):
   - animation, box-shadow, border-box, border-radius, keyframes, text-shadow, transform, transition

Buttons disabled when < 2 careers || > 20 careers entered in multiselect, and enabled otherwise

Chart bubbles transition in and out. 


###Models


###Server
Near cache 
- subsequent requests for a resource to take <5ms 
- stores x requests in memory
- when memory exceeded, does y

Server
- handles x # of requests per x
- when # of requests exceeds server capacity, does z 

###Database
- has a backup database if it fails
- handles x # of requests per x
- when # of requests exceeds server capacity, does z 