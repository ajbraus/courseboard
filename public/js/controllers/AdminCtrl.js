'use strict';

/* ADMIN Controller */

angular.module('courseboard')
  .controller('AdminCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'GlobalAlert', function ($scope, $rootScope, $location, $auth, $http, GlobalAlert) {
    if (!$scope.currentUser.admin) {
      $location.path('/');
    } else {
      $http.get('/api/admin/students')
        .success(function (response) {
          $scope.students = response;
        })
        .error(function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        });

      $http.get('/api/admin/instructors')
        .success(function (response) {
          $scope.instructors = response;
        })
        .error(function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        });

      $http.get('/api/admin/courses')
        .success(function (response) {
          $scope.courses = response;
        })
        .error(function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }
  }]);
