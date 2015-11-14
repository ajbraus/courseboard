'use strict';

// Declare app level module which depends on filters, and services
angular.module('basic-auth', [
                         'basic-auth.services',
                         'ngRoute',
                         'ngResource',
                         'satellizer',
                         ])

    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'templates/splash'
      });

      $routeProvider.when('/profile', {
        templateUrl: 'templates/profile',
        controller: 'ProfileCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/'});

      $locationProvider.html5Mode(true);
    }])

    .config(function($authProvider) {
      $authProvider.facebook({
        clientId: '1184762851540712'
      });
      $authProvider.google({
        clientId: '1018771082011-nrcc6ejmh0n2coh166fdmncch5dnhj9q.apps.googleusercontent.com'
      });

      // Facebook
      $authProvider.facebook({
        url: '/auth/facebook',
        authorizationEndpoint: 'https://www.facebook.com/v2.3/dialog/oauth',
        redirectUri: (window.location.origin || window.location.protocol + '//' + window.location.host) + '/',
        requiredUrlParams: ['display', 'scope'],
        scope: ['email'],
        scopeDelimiter: ',',
        display: 'popup',
        type: '2.0',
        popupOptions: { width: 580, height: 400 }
      });

      // Google
      $authProvider.google({
        url: '/auth/google',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
        redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
        requiredUrlParams: ['scope'],
        optionalUrlParams: ['display'],
        scope: ['profile', 'email'],
        scopePrefix: 'openid',
        scopeDelimiter: ' ',
        display: 'popup',
        type: '2.0',
        popupOptions: { width: 452, height: 633 }
      });
    });
