'use strict';

// Declare app level module which depends on filters, and services
angular.module('basic-auth', [
                         'basic-auth.services',
                         'ngRoute',
                         'ngResource',
                         'satellizer',
                         'hc.marked'
                         ])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'templates/questions-index',
        controller: 'QuestionsIndexCtrl'
      });

      // QUESTIONS
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

      // USERS & PROFILE
      $routeProvider.when('/users/:id', {
        templateUrl: 'templates/profile',
        controller: 'UsersShowCtl'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });

      // ADMIN
      $routeProvider.when('/admin', {
        templateUrl: 'templates/admin',
        controller: 'AdminCtrl'
      });

      // PASSWORD
      $routeProvider.when('/password-new', {
        templateUrl: 'templates/password-new',
        controller: 'PasswordNewCtrl'
      });

      $routeProvider.when('/password-edit', {
        templateUrl: 'templates/password-edit',
        controller: 'PasswordEditCtrl'
      });

      $routeProvider.otherwise({ redirectTo: '/' });

      // $locationProvider.html5Mode(true);

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
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
