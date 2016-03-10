'use strict';

/* USER Controllers */

angular.module('courseboard')
  .controller('CoursesIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/courses').then(function(response) {
      console.log(response);
      $scope.courses = response.data;
    });
  }])

  .controller('CoursesNewCtrl', ['$scope', '$http', '$auth', 'Auth', '$location', 'GlobalAlert', function($scope, $http, $auth, Auth, $location, GlobalAlert) {
    $scope.createCourse = function() {
      $http.post('/api/courses', $scope.course).then(function(response) {
        console.log(response);
        // NAVIGATE TO COURSES INDEX
        $location.path('/courses');
      });      
    }
  }]);