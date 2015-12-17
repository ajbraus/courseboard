'use strict';

// Declare app level module which depends on filters, and services
angular.module('basic-auth', [
                         'basic-auth.services',
                         'ngRoute',
                         'ngResource',
                         'satellizer',
                         'hc.marked'
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

      $routeProvider.when('/edit/questions/:id', {
        templateUrl: 'templates/questions-new',
        controller: 'QuestionsEditCtrl'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/'});

      $locationProvider.html5Mode(true);
    }])

    .config(['markedProvider', function (markedProvider) {
      markedProvider.setOptions({
        gfm: true,
        tables: true,
        highlight: function (code, lang) {
          if (lang) {
            return hljs.highlight(lang, code, true).value;
          } else {
            return hljs.highlightAuto(code).value;
          }
        }
      });
    }]);
