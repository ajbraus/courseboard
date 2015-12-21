'use strict';

/* ADMIN Controller */

angular.module('basic-auth')
  .controller('AdminCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http',  function($scope, $rootScope, $location, $auth, $http) {
    if (!$scope.currentUser.admin) {
      $location.path('/');
    } else {
      $http.get('/api/admin/unconfirmed-users').then(
        function (response) {
          $scope.unconfirmedUsers = response.data;
        },
        function (response) {
          console.log(response);
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
          console.log(response);
        }
      )
    }
  }]);
