'use strict';

/* COURSE Controllers */

angular.module('courseboard')
  .controller('CoursesShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $routeParams, $auth, Auth, GlobalAlert) {
      $scope.courses = [
          { title: 'Data Structures', instructor: 'Alan Davis', description: 'I will trick you.' },
          { title: 'MEAN', instructor: 'Adam Braus', description: 'Make a courseboard!' },
          { title: 'Reddit on Rails', instructor: 'Andy Tiffany', description: 'Pair programming Reddit using Rails.' }
      ];

    //   $http.get('api/courses/').then(
    //       function (response) {
    //           $scope.courses = response.data;
    //       },
    //       function (response) {
    //           GlobalAlert.add('warning', response.data.message, 2000);
    //       }
    //   );
  }]);
