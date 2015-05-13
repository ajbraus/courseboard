/*
 * ANGULAR APP.JS
 */

'use strict';

angular.module('myApp', ['ngResource', 
                         'ngRoute', 
                         'btford.socket-io',
                         'myApp.services', 
                         'myApp.directives', 
                         'myApp.interceptors'])

  .constant('HOST', 'http://localhost:1337') //DEV
  // .constant('HOST', 'http://questionqueue.herokuapp.com') //PRODUCTION

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'templates/room-show'
      , controller: 'RoomIndexCtrl'
      })

      .when('/:room_name', {
        templateUrl: 'templates/post-index'
      , controller: 'PostIndexCtrl'
      })

      .when('/login', {
        templateUrl: 'templates/login'
      , controller: 'PostIndexCtrl'
      })

      .when('/register', {
        templateUrl: 'templates/register'
      , controller: 'PostIndexCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);