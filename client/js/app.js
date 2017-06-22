pokerplannerApp = angular.module('pokerplannerApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/pokerplanner.html',
        controller: 'PokerplannerCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });