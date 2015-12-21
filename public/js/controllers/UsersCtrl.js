'use strict';

/* USER Controllers */

angular.module('basic-auth')
  .controller('ProfileCtrl', ['$scope', '$http', '$auth', 'Auth', function($scope, $http, $auth, Auth) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
    });
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

  .controller('PasswordEditCtrl', ['$scope', '$http', '$auth', 'Auth', '$routeParams', function($scope, $http, $auth, Auth, $routeParams) {
    // $http.put('/auth/passwords/edit/' + $routeParams.token)
    //   .then(function (response) {
    //     console.log(response);
    //     $location.path('/');
    //   })
    //   .catch(function (response) {
    //     console.log(response);
    //   })
  }]);
