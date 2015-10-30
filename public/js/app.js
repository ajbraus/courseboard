'use strict';

// Declare app level module which depends on filters, and services
angular.module('zoinks', ['zoinks.filters', 
                         'zoinks.services', 
                         'zoinks.directives', 
                         'ngResource',
                         'ngTouch', 
                         'btford.socket-io',
                         'ngSanitize', 
                         'ngRoute',
                         'satellizer'])

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
