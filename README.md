# Career Buddy

Career Buddy helps people find their best career by enabling them to explore the latest employment projections from the Bureau of Labor Statistics. Users can visualize the highest paying careers, the fastest growing careers, or their own custom set of careers.  

## Getting Started - developers 

To get you started you can simply clone the career-buddy repository and install the dependencies:

### Prerequisites

Clone the career-buddy repository from [https://github.com/skeller88/career-buddy](https://github.com/skeller88/career-buddy).

Install node.js, its package manager (npm), and bower, from [http://nodejs.org/](http://nodejs.org/) and [http://bower.io/](http://bower.io/).

Install [Ruby](https://www.ruby-lang.org/en/downloads/) and [RVM](https://rvm.io/rvm/install)

Install the Ruby gems. `gem install compass` should install both Compass and Sass.

### Install Dependencies

There are two kinds of dependencies in this project: tools and angular framework code.  The tools help manage and test the application.

 `npm` is preconfigured to automatically run `bower` so after cloning the repo, run the following command:

```
npm install
```

Behind the scenes this will also call `bower install`.  After runing `npm install` the project should have two new folders.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes it easier to serve the files by a webserver.*

### Run the Application

```
node src/server.js
```

or for automatic refreshing of server on changes:

```
nodemon src/server.js
```

Now browse to the app at `http://localhost:3000/#/`.

### Run Tests

`grunt test` to run tests once

`grunt watch` to rerun tests whenever any .js files in spec/, src/, or app/ are changed. 

## Updating Dependencies
To find the latest versions that match the version ranges specified in the `package.json` file, run: 

```
npm update
```

To find the latest versions that match the version ranges specified in the `bower.json` file, including Angular, run:

```
bower update
```