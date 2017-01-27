'use strict';

/* ADMIN Controller */

angular.module('courseboard')
  .controller('AdminCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'Competencies', 'GlobalAlert', function ($scope, $rootScope, $location, $auth, $http, Competencies, GlobalAlert) {
    if (!$scope.currentUser.admin) {
      $location.path('/');
    } else {
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

    $scope.publishCourse = function(course) {
      $http.put('/api/courses/' + course._id + '/publish').then(
        function (response) {
          course.publishedAt = new Date();
          GlobalAlert.add('success', "Course published!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }

    $scope.unPublishCourse = function(course) {
      $http.put('/api/courses/' + course._id + '/unpublish').then(
        function (response) {
          course.publishedAt = null;
          GlobalAlert.add('success', "Course unpublished!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }
    
  }]);
