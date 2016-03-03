'use strict';

// Declare app level module which depends on filters, and services
angular.module('courseboard', [
                         'courseboard.services',
                         'courseboard.directives',
                         'ngRoute',
                         'ngResource',
                         'satellizer',
                         'hc.marked',
                         'angularMoment',
                         'ngTagsInput',
                         'ui.bootstrap'
                         ])
    
    .run(['$rootScope', '$location', '$auth', 'GlobalAlert', function ($rootScope, $location, $auth, GlobalAlert) {
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var loggedIn = $auth.isAuthenticated()
        if (!next.publicAccess && !loggedIn) {
          $rootScope.returnToState = next.url;
          $rootScope.returnToStateParams = next.params.Id;
          $location.path('/');
          GlobalAlert.add('warning', "Please log in to see this question", 2000);
        }
      });
    }])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      // HOME
      $routeProvider.when('/', {
        templateUrl: 'templates/splash',
        publicAccess: true
      });

      // COURSES
      $routeProvider.when('/courses', {
        templateUrl: 'templates/courses',
        controller: 'CoursesCtrl',
        publicAccess: true
      });

      $routeProvider.when('/courses/new', {
        templateUrl: 'templates/course-new',
        controller: 'CoursesNewCtrl',
        publicAccess: true
      });

      // PASSWORD
      $routeProvider.when('/password-edit', {
        templateUrl: 'templates/password-edit',
        controller: 'PasswordEditCtrl',
        publicAccess: true
      });

      $routeProvider.when('/password-new', {
        templateUrl: 'templates/password-new',
        controller: 'PasswordNewCtrl',
        publicAccess: true
      });

      // USERS & PROFILE
      $routeProvider.when('/users/:id', {
        templateUrl: 'templates/profile',
        controller: 'UsersShowCtrl'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });

      $routeProvider.when('/settings', {
        templateUrl: 'templates/settings',
        controller: 'SettingsCtrl'
      });

      // ADMIN
      $routeProvider.when('/admin', {
        templateUrl: 'templates/admin',
        controller: 'AdminCtrl'
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
