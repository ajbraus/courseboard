'use strict';

/* MAIN Controller */

angular.module('zoinks')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'Zoink', '$auth', '$http',  function($scope, $rootScope, $location, Zoink, $auth, $http) {


    // NEW ZOINK
    $scope.zoink = {};

    $scope.createZoink = function() {
      console.log('hello')
      var zoink = new Zoink($scope.zoink)
      zoink.$save(function(zoink) {
        $location.path('/zoinks/' + zoink._id)
        $('#new-zoink').modal('hide');
      });
    }

    // LOGIN/REGISTER
    $scope.signupMode = false;
    $scope.user = {};

    $scope.isAuthenticated = function() {
      $http.get('/api/me').then(function (data) {
        if (!!data.data) {
          $scope.currentUser = data.data;  
          $scope.zoinks = Zoink.query();
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
          // toastr.info('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          // toastr.error(response.data.message);
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(respone) {
          // toastr.success('You have successfully signed in');
          $auth.setToken(response.data.token);
          $('#login-modal').modal('hide');
          $scope.isAuthenticated();
          $scope.user = {};
        })
        .catch(function(response) {
          // toastr.error(response.data.message, response.status);
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          // toastr.success('You have successfully signed in with ' + provider);
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
          // toastr.info('You have been logged out');
          $auth.removeToken();
          $scope.currentUser = null;
          $location.path('/')
        });
    };
  }]);
