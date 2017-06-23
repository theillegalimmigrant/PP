pokerplannerApp = angular.module('pokerplannerApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html',
        controller: 'PokerplannerCtrl'
      }).when('/rooms/', {
        templateUrl: '/partials/roomSetup.html',
        controller: 'PokerplannerCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });