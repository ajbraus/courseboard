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

    // $http.get('/api/users/' + $auth.getPayload().sub + '/questions').then(
    //   function (response) {
    //     $scope.questions = response.data;
    //   },
    //   function (response) {
    //     GlobalAlert.add('warning', response.data.message, 2000);
    //   });

    // $http.get('/api/users/' + $auth.getPayload().sub + '/answers').then(
    //   function (response) {
    //     $scope.answers = response.data;
    //   },
    //   function (response) {
    //     GlobalAlert.add('warning', response.data.message, 2000);
    //   });

  }])
