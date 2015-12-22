'use strict';

/* USER Controllers */

angular.module('basic-auth')
  .controller('ProfileCtrl', ['$scope', '$http', '$auth', 'Auth', function($scope, $http, $auth, Auth) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
    });

    $http.get('/api/users/' + $auth.getPayload().sub + '/questions')
      .then(function (response) {
        $scope.questions = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });

  }])

  .controller('UsersShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', function($scope, $http, $routeParams, $auth, Auth) {

    $http.get('/api/users/' + $routeParams.id)
      .then(function (response) {
        $scope.user = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });


    $http.get('/api/users/' + $routeParams.id + '/questions')
      .then(function (response) {
        console.log(response);
        $scope.questions = response.data;
      })
      .catch(function (response) {
        console.log(response);
      });
  }])

  .controller('SettingsCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
    });

    $scope.updateUser = function() {
      $http.put('/api/me', $scope.user)
        .then(function (response) {
          console.log(response)
          $location.path('/profile')
        })
        .catch(function (response) {
          console.log(response)
        })
    }
  }])

  .controller('UsersShowCtrl', ['$scope', '$http', '$auth', 'Auth', '$routeParams', function($scope, $http, $auth, Auth, $routeParams) {
    $http.get('/api/users/' + $routeParams.id).then(function(response) {
      $scope.user = response.data;
    });
  }])

  .controller('PasswordNewCtrl', ['$scope', '$http', '$auth', 'Auth', '$location', '$routeParams', function($scope, $http, $auth, Auth, $location, $routeParams) {
    $('.dropdown.open .dropdown-toggle').dropdown('toggle');

    $scope.requestPassword = function() {
      $http.post('/auth/passwords', $scope.user)
        .then(function (response) {
          console.log(response);
          $scope.user = {};
          $location.path('/');
        })
        .catch(function (response) {
          console.log(response);
        })
    }
  }])

  .controller('PasswordEditCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    console.log('in password edit ctrl')
    // $http.put('/auth/passwords/edit/' + $routeParams.token)
    //   .then(function (response) {
    //     console.log(response);
    //     $location.path('/');
    //   })
    //   .catch(function (response) {
    //     console.log(response);
    //   })
  }]);
