'use strict';

/* MAIN Controller */

angular.module('ga-qa')
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'Alert', function($scope, $rootScope, $location, $auth, $http, Alert) {

    $scope.search = function(term) { 
      $location.path('/search').search('term', term)
    }

    $scope.clearSearch = function() {
      $scope.questions = Question.query();
    }

    // LOGIN/REGISTER
    $scope.user = {};

    $scope.isAuthenticated = function() {
      $http.get('/api/me')
        .success(function (response) {
          if (!!response.data) {
            $rootScope.currentUser = response.data;
            $rootScope.currentUser.admin = $auth.getPayload().admin
          } else {
            $auth.removeToken();
          }
        })
        .error(function (response) {
          $auth.removeToken();
          $location.path('/');
        });
    };

    $scope.isAuthenticated();

    $scope.signup = function() {
      $auth.signup($scope.user)
        .success(function (response) {
          $('.dropdown.open .dropdown-toggle').dropdown('toggle');
          $scope.user = {};

          Alert.add('success', "Access requested", 2000);
        })
        .error(function (response) {
          Alert.add('warning', "Something went wrong while requesting access", 2000);
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .success(function(response) {
          $('.dropdown.open .dropdown-toggle').dropdown('toggle');
          $auth.setToken(response.data.token);
          $scope.isAuthenticated();
          $scope.user = {};

          Alert.add('success', "Logged In", 2000);
        })
        .error(function(response) {
          Alert.add('warning', "Something went wrong while loggin in", 2000);
        });
    };
    
    $scope.logout = function() {
      $auth.logout()
        .success(function() {
          $auth.removeToken();
          $rootScope.currentUser = null;
          $location.path('/')

          Alert.add('success', "Logged out", 2000);
        });
    };
  }]);
