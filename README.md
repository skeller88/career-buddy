# Career Buddy

User accounts
Save comparisons
NewRelic - analytics, error-reporting service
git - tracking client-side errors in the browser
multiple servers 
server-side templating - jade 
in-memory caching - show data on load 
in-browser behavior analytics - heap, mixpanel 
page optimization

# Notes on the data

### Descriptive Stats
career_2012_emp
- min: 0
- max: 22470


## Getting Started - developers 

To get you started you can simply clone the career-buddy repository and install the dependencies:

### Prerequisites

You need git to clone the angular-seed repository. You can get it from
[https://github.com/skeller88/career-buddy](https://github.com/skeller88/career-buddy).

Install node.js, its package manager (npm), and bower.  You can get them from [http://nodejs.org/](http://nodejs.org/) and [http://bower.io/](http://bower.io/).

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes it easier to serve the files by a webserver.*

### Data Cleaning
Excel insert statements used. 

8 entries with career_med_ann_wage = '>=$187,200' changed to '$187,200'.

entries with career_edu containing "'" changed to "''"

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
node src/server.js
```

or for automatic refreshing of server on changes:

```
nodemon src/server.js
```

Now browse to the app at `http://localhost:3000/#/`.

## Directory Layout

    app/                --> all of the files to be used in production
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      index.html        --> app layout file (the main html template file of the app)
      index-async.html  --> just like index.html, but loads js files asynchronously
      js/               --> javascript files
        app.js          --> application
        controllers.js  --> application controllers
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      partials/             --> angular view partials (partial html templates)
        partial1.html
        partial2.html

## Updating Angular

Previously we recommended that you merge in changes to angular-seed into your own fork of the project.
Now that the angular framework library code and tools are acquired through package managers (npm and
bower) you can use these tools instead to update the dependencies.

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.
