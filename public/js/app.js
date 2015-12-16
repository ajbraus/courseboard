'use strict';

// Declare app level module which depends on filters, and services
angular.module('basic-auth', [
                         'basic-auth.services',
                         'ngRoute',
                         'ngResource',
                         'satellizer',
                         'btford.markdown'
                         ])

    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'templates/questions-index',
        controller: 'QuestionsIndexCtrl'
      });

      $routeProvider.when('/questions/new', {
        templateUrl: 'templates/questions-new',
        controller: 'QuestionsNewCtrl'
      });

      $routeProvider.when('/questions/:id', {
        templateUrl: 'templates/questions-show',
        controller: 'QuestionsShowCtrl'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/'});

      $locationProvider.html5Mode(true);
    }]);
