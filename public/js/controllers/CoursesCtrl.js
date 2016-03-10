'use strict';

/* USER Controllers */

angular.module('courseboard')
  .controller('CoursesCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/courses').then(function(response) {
      $scope.courses = response.data;
    });
    // $scope.courses = [
    //   {title: "fero sucks hey"},
    //   {title: "so does abe"}
    // ]

  }])

  .controller('CoursesNewCtrl', ['$scope', '$http', 'GlobalAlert', '$location', function($scope, $http, GlobalAlert, $location) {
    $scope.createCourse = function() {
      $http.post('/api/courses', $scope.course).then(
        function (response) {
          $scope.course = {};
          $location.path('/courses'); 
          GlobalAlert.add('success', "Create course request sent", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }
  }])

  .controller('CourseShowCtrl', ['$scope', '$http', '$routeParams', 'GlobalAlert', function($scope, $http, $routeParams, GlobalAlert) {
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        $scope.course = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });

  }])

  .controller('CourseEditCtrl', ['$scope', '$http', '$routeParams', '$location', 'GlobalAlert', function($scope, $http, $routeParams, $location, GlobalAlert) {
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        $scope.course = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
    });

    $scope.updateCourse = function() {
      $http.put('/api/courses-edit/' + $routeParams.id, $scope.course).then(
        function (response) {
          $location.path('/courses-edit/' + $scope.course._id)
          GlobalAlert.add('success', "Course updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    $scope.deleteCourse = function() {
      $http.delete('/api/courses-edit/' + $routeParams.id).then(
        function (response) {
          $location.path('/courses');
          GlobalAlert.add('success', "Course deleted", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

  }])


