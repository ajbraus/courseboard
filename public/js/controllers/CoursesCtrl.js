'use strict';

/* COURSES Controller */

angular.module('courseboard')
    .controller('CourseIndexCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'GlobalAlert',
      function ($scope, $rootScope, $location, $auth, $http, GlobalAlert) {

    $http.get('/api/courses').then(
      function (response) {
        $scope.courses = response.data;
    });

  }]);
