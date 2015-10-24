'use strict';

// Declare app level module which depends on filters, and services
angular.module('zoinks', ['myApp.filters', 
                         'myApp.services', 
                         'myApp.directives', 
                         'myApp.controllers',
                         'ngResource',
                         'ngRoute'])

    .constant('HOST', 'http://localhost:1337') //DEV
    // .constant('HOST', 'http://www.zoinksapp.com') //PRODUCTION

    .config(['$routeProvider', function($routeProvider) {
       $routeProvider.when('/', {
          templateUrl: 'templates/splash'
       });

       $routeProvider.when('/zoinks/:id', {
          templateUrl: 'templates/zoink-show',
          controller: 'ZoinkShowCtrl'
       });

       $routeProvider.otherwise({redirectTo: '/'});
    }]);