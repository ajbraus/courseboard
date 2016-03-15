'use strict';

/* COURSE Controllers */

angular.module('courseboard')
  .controller('CoursesIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/courses').then(function(response) {
      $scope.courses = response.data;
    });

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

  .controller('CoursesShowCtrl', ['$scope', '$rootScope', 'lodash', '$http', '$routeParams', 'GlobalAlert', function($scope, $rootScope, lodash, $http, $routeParams, GlobalAlert) {
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        $scope.course = response.data;

        $scope.enrolled = ($rootScope.currentUser._id.indexOf(_.map($scope.course.students, '_id')) > -1)
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });

    $scope.enroll = function() {
      $http.put('/api/courses/' + $routeParams.id + '/enroll').then(
        function (response) {
          GlobalAlert.add('success', "You've enrolled!", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }

    $scope.unenroll = function() {
      $http.put('/api/courses/' + $routeParams.id + '/unenroll').then(
        function (response) {
          GlobalAlert.add('success', "You've unenrolled!", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }


  }])

  .controller('CoursesEditCtrl', ['$scope', '$http', '$routeParams', '$location', 'GlobalAlert', function($scope, $http, $routeParams, $location, GlobalAlert) {
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        $scope.course = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
    });

    $scope.updateCourse = function() {
      $http.put('/api/courses/' + $routeParams.id, $scope.course).then(
        function (response) {
          $location.path('/courses/' + $scope.course._id)
          GlobalAlert.add('success', "Course updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    $scope.deleteCourse = function() {
      $http.delete('/api/courses/' + $routeParams.id).then(
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
