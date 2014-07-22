'use strict';

angular.module('myApp', [
  'ngAnimate',
  'ui.router',
  'ngResource',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
  ]).
  config(['$stateProvider', function($stateProvider) {
    $stateProvider.
      state('app', {
        url: '/',
        templateUrl: 'partials/home.html', 
        controller: 'HomeCtrl'
      }).
      state('about', {
        url: '/about',
        templateUrl: 'partials/about.html',
        controller: 'HomeCtrl'
      }).
      state('contact', {
        url: '/contact',
        templateUrl: 'partials/contact.html',
        controller: 'HomeCtrl' 
      }).
      state('otherwise', {
        url: '*path',
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      });
  }]);
