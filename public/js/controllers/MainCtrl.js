'use strict';

/* MAIN Controller */

angular.module('basic-auth')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http',  function($scope, $rootScope, $location, $auth, $http) {

    // LOGIN/REGISTER
    $scope.signupMode = false;
    $scope.user = {};

    $scope.isAuthenticated = function() {
      $http.get('/api/me').then(function (data) {
        if (!!data.data) {
          $scope.currentUser = data.data;
        } else {
          $auth.removeToken();
        }
      }, function (data) {
        $auth.removeToken();
        $location.path('/');
      });
    };

    $scope.isAuthenticated();

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          console.log(response)
          $auth.setToken(response);
          $('#login-modal').modal('hide');
          $scope.isAuthenticated();
          $scope.user = {};
        })
        .catch(function(response) {
          console.log(response)
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(respone) {
          $auth.setToken(response.data.token);
          $('#login-modal').modal('hide');
          $scope.isAuthenticated();
          $scope.user = {};
        })
        .catch(function(response) {
          console.log(response)
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          $('#login-modal').modal('hide');
          $scope.isAuthenticated();
        })
        .catch(function(response) {
          console.log(response)
        });
    };

    $scope.logout = function() {
      $auth.logout()
        .then(function() {
          $auth.removeToken();
          $scope.currentUser = null;
          $location.path('/')
        });
    };
  }]);
