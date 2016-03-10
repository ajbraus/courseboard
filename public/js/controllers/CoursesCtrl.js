'use strict';

/* COURSE Controllers */

angular.module('courseboard')
  .controller('CoursesShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $routeParams, $auth, Auth, GlobalAlert) {
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        $scope.user = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });


    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        console.log(response);
        $scope.questions = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });
  }]);
