'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'MyCtrl1'});
  $routeProvider.when('/about', {templateUrl: 'partials/about.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
