'use strict';

/* Feedback Controllers */

angular.module('courseboard')
  .controller('StudentsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/students').then(function (response) { 
      // students full names & _id
      $scope.userList = response.data;
    })
  }])

  .controller('FeedbackNewCtrl', ['$rootScope', '$scope', '$http', '$auth', '$routeParams', '$location', 'Auth', 'Competencies', 'GlobalAlert', function($rootScope, $scope, $http, $auth, $routeParams, $location, Auth, Competencies, GlobalAlert) {
  
    if ($routeParams.id) {
      var userId = $routeParams.id;
    } else {
      var userId = $rootScope.currentUser._id;
    }

    $scope.feedback = {
      body:""
    }

    $scope.createFeedback = function() {
      $http.post('/api/user/' + $rootScope.currentUser.id + '/feedback', $scope.feedback).then(
        function (response) {
          $scope.feedback = {};
          $location.path('/');
          GlobalAlert.add('success', "Goal or Feedback Created", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }]);
