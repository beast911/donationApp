'use strict';

// Declare app level module which depends on views, and components
window.baseModule = angular.module('donationApp', [
  'ngRoute',
  'donationApp.welcome',
  'donationApp.thankYou'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/donation'});
}]);
