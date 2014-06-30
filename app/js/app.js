'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngAnimate',
  'ui.router',
  'ngResource',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html', 
      controller: 'HomeCtrl'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'partials/about.html', 
      controller: 'AboutCtrl'
    })
    .state('contact', {
      url: '/contact',
      templateUrl: 'partials/contact.html', 
      controller: 'ContactCtrl'
    })
    .state('otherwise', {
      url: '*path',
      templateUrl: 'partials/home.html'
    });
}]);
