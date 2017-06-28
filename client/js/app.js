pokerplannerApp = angular.module('pokerplannerApp', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html',
        controller: 'HomeCtrl'
      }).when('/rooms/', {
        templateUrl: '/partials/roomsList.html',
        controller: 'RoomsCtrl'
      }).when('/setup/:id', {
        templateUrl: '/partials/roomSetup.html',
        controller: 'RoomSetupCtrl'
      }).when('/:id', {
        templateUrl: '/partials/room.html',
        controller: 'RoomCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });