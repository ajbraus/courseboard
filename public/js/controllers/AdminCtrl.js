'use strict';

/* ADMIN Controller */

angular.module('ga-qa')
  .controller('AdminCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'GlobalAlert', function ($scope, $rootScope, $location, $auth, $http, GlobalAlert) {
    if (!$scope.currentUser.admin) {
      $location.path('/');
    } else {
      $http.get('/api/admin/unconfirmed-users')
        .success(function (response) {
          $scope.unconfirmedUsers = response;
        })
        .error(function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }

    $http.get('/api/all-tags').then(
      function (response) {
        $scope.tags = response.data
      }, 
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      })

    $scope.createTag = function() {
      $http.post('/api/tags', $scope.tag).then(
        function (response) {
          $scope.tag = {};
          $scope.tags.push(response.data)
          GlobalAlert.add('success', "Tag Created", 2000);
        }, 
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        })
    }

    $scope.confirmUser = function(user, index) {
      $http.put('/api/admin/confirm/' + user._id).then(
        function (response) {
          $scope.unconfirmedUsers.splice(index, 1);
          GlobalAlert.add('success', "User confirmed", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      )
    }
  }]);
