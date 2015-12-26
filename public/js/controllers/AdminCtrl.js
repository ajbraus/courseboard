'use strict';

/* ADMIN Controller */

angular.module('ga-qa')
  .controller('AdminCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'Alert', function($scope, $rootScope, $location, $auth, $http, Alert) {
    if (!$scope.currentUser.admin) {
      $location.path('/');
    } else {
      $http.get('/api/admin/unconfirmed-users').then(
        function (response) {
          $scope.unconfirmedUsers = response.data;
        },
        function (response) {
          Alert.add('warning', response.message, 2000);
        }
      );
    }

    $scope.confirmUser = function(user, index) {
      $http.put('/api/admin/confirm/' + user._id).then(
        function (response) {
          $scope.unconfirmedUsers.splice(index, 1);
          console.log(response);
        },
        function (response) {
          Alert.add('warning', response.message, 2000);
        }
      )
    }
  }]);
