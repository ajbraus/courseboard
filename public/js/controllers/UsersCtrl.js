'use strict';

/* USER Controllers */

angular.module('ga-qa')
  .controller('ProfileCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
    });

    $http.get('/api/users/' + $auth.getPayload().sub + '/questions').then(
      function (response) {
        $scope.questions = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });

    $http.get('/api/users/' + $auth.getPayload().sub + '/answers').then(
      function (response) {
        $scope.answers = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });

  }])

  .controller('UsersShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $routeParams, $auth, Auth, GlobalAlert) {

    $http.get('/api/users/' + $routeParams.id).then(
      function (response) {
        $scope.user = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });


    $http.get('/api/users/' + $routeParams.id + '/questions').then(
      function (response) {
        console.log(response);
        $scope.questions = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });
  }])

  .controller('SettingsCtrl', ['$scope', '$http', '$location', 'GlobalAlert', function($scope, $http, $location, GlobalAlert) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
    });

    $scope.updateUser = function() {
      $http.put('/api/me', $scope.user).then(
        function (response) {
          console.log(response)
          $location.path('/profile')
          GlobalAlert.add('success', "User updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        })
    }
  }])

  .controller('UsersShowCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', '$routeParams', function($scope, $http, $auth, Auth, GlobalAlert, $routeParams) {
    $http.get('/api/users/' + $routeParams.id).then(function(response) {
      $scope.user = response.data;
    });
  }])

  .controller('PasswordNewCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', '$location', '$routeParams', function($scope, $http, $auth, Auth, GlobalAlert, $location, $routeParams) {
    $('.dropdown.open .dropdown-toggle').dropdown('toggle');

    $scope.requestPassword = function() {
      $http.post('/auth/passwords', $scope.user).then(
        function (response) {
          $scope.user = {};
          $location.path('/'); 
          GlobalAlert.add('success', "Password reset instructions sent", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }
  }])

  .controller('PasswordEditCtrl', ['$scope', '$http', '$routeParams', 'GlobalAlert', function($scope, $http, $routeParams, GlobalAlert) {
    console.log('in password edit ctrl')
    $http.put('/auth/passwords/edit/' + $routeParams.token).then(
      function (response) {
        $location.path('/');
        GlobalAlert.add('success', "Password updated", 2000);
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      })
  }]);
