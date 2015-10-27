'use strict';

// Declare app level module which depends on filters, and services
angular.module('zoinks', ['zoinks.filters', 
                         'zoinks.services', 
                         'zoinks.directives', 
                         'zoinks.controllers',
                         'ngResource',
                         'ngTouch', 
                         'btford.socket-io',
                         'ngSanitize', 
                         'ngRoute'])

    .constant('HOST', 'http://localhost:1337') //DEV
    // .constant('HOST', 'http://zoinksapp.herokuapp.com') //PRODUCTION

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