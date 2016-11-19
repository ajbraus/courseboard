'use strict';

// Declare app level module which depends on filters, and services
angular.module('courseboard', [
                         'courseboard.services',
                         'courseboard.directives',
                         'ngRoute',
                         'ngResource',
                         'ngSanitize',
                         'satellizer',
                         'hc.marked',
                         'angularMoment',
                         'ui.bootstrap',
                         'ngLodash'
                         ])

    .run(['$rootScope', '$location', '$auth', 'GlobalAlert', function ($rootScope, $location, $auth, GlobalAlert) {
      // Redirect to login if route requires auth and you're not logged in
      $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var loggedIn = $auth.isAuthenticated()
        if (!next.publicAccess && !loggedIn) {
          $rootScope.returnToState = next.url;
          $rootScope.returnToStateParams = next.params.Id;
          $location.path('/welcome');
          GlobalAlert.add('warning', "Please log in to see this resource", 2000);
        }
      });
    }])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      // HOME
      // $routeProvider.when('/', {
      //   templateUrl: 'templates/splash',
      //   publicAccess: true
      // });

      // COURSES
      $routeProvider.when('/welcome', {
        templateUrl: 'templates/splash',
        publicAccess: true
      });

      $routeProvider.when('/', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });

      $routeProvider.when('/course-catalog', {
        templateUrl: 'templates/course-index',
        controller: 'CoursesIndexCtrl'
      });

      $routeProvider.when('/courses-new', {
        templateUrl: 'templates/course-new',
        controller: 'CoursesNewCtrl'
      });

      $routeProvider.when('/courses/:id', {
        templateUrl: 'templates/course-show',
        controller: 'CoursesShowCtrl'
      });

      $routeProvider.when('/courses-edit/:id', {
        templateUrl: 'templates/course-edit',
        controller: 'CoursesEditCtrl'
      });

      // PRODUCTS
      $routeProvider.when('/product-new', {
        templateUrl: 'templates/product-new',
        controller: 'ProductsNewCtrl'
      });

      $routeProvider.when('/product-showcase', {
        templateUrl: 'templates/product-index',
        controller: 'ProductsIndexCtrl',
        publicAccess: true
      });

      $routeProvider.when('/products/:id', {
        templateUrl: 'templates/product-show',
        controller: 'ProductsShowCtrl'
      });

      $routeProvider.when('/products-edit/:id', {
        templateUrl: 'templates/product-edit',
        controller: 'ProductsEditCtrl'
      });

      $routeProvider.when('/products-plan/:id', {
        templateUrl: 'templates/product-plan',
        controller: 'ProductsEditCtrl'
      });

      $routeProvider.when('/products/:id/business-model-canvas', {
        templateUrl: 'templates/business-model-canvas',
        controller: 'ProductsEditCtrl'
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
        templateUrl: 'templates/user-show',
        controller: 'UsersShowCtrl'
      });

      $routeProvider.when('/students', {
        templateUrl: 'templates/students',
        controller: 'StudentsIndexCtrl'
      });

      $routeProvider.when('/users/:id/feedback', {
        templateUrl: 'templates/feedback-new',
        controller: 'FeedbackNewCtrl'
      });

      $routeProvider.when('/instructor-dashboard', {
        templateUrl: 'templates/instructor-dashboard',
        controller: 'InstructorDashboardCtrl'
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
