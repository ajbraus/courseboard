'use strict';

/* USER Controllers */

angular.module('courseboard')
  .controller('InstructorDashboardCtrl', ['$scope', '$http', '$auth', 'Course', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Course, Auth, GlobalAlert) {
    $http.get('/api/me')
      .success(function (response) {
        $scope.user = response;
      })
      .error(function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });


    $http.get('/api/admin/students')
      .success(function (response) {
        $scope.students = response;
      })
      .error(function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });

    $scope.publish = function(course) {
      Course.publish(course);
    }

    $scope.unpublish = function(course) {
      Course.unpublish(course);
    }
  }])

  .controller('ProfileCtrl', ['$scope', '$http', '$auth', '$location', 'Auth', 'GlobalAlert', function($scope, $http, $auth, $location, Auth, GlobalAlert) {
    if (!$auth.isAuthenticated()) {
      $location.path('/welcome')
    }

    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
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

    $scope.greaterThan = function(prop){
        return function(item){
          return item[prop] > new Date();
        }
    }

    // POSTS
    $http.get('/api/users/' + $routeParams.id + '/posts').then(function(response) {
      $scope.posts = response.data;
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

    $scope.enroll = function(course) {
      $http.put('/api/courses/' + course._id + '/enroll').then(
        function (response) {
          course.enrolled = true;

          // $scope.course.students.push($rootScope.currentUser)
          GlobalAlert.add('success', "You've enrolled!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }

    $scope.unenroll = function(course) {
      $http.put('/api/courses/' + course._id + '/unenroll').then(
        function (response) {
          course.enrolled = false;
          // var index = _.map($scope.course.students, '_id').indexOf($rootScope.currentUser._id)
          // $scope.course.students.splice(index, 1)
          GlobalAlert.add('success', "You've unenrolled!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }
  }])

  .controller('PasswordNewCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', '$location', '$routeParams', function($scope, $http, $auth, Auth, GlobalAlert, $location, $routeParams) {
    $('.dropdown.open .dropdown-toggle').dropdown('toggle');

    $scope.requestPassword = function() {
      $http.post('/auth/passwords', $scope.user).then(
        function (response) {
          $scope.user = {};
          $location.path('/welcome');
          GlobalAlert.add('success', "Password reset instructions sent", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        });
    }
  }])

  .controller('PasswordEditCtrl', ['$scope', '$http', '$auth', 'Auth', '$routeParams', '$location', 'GlobalAlert', function($scope, $http, $auth, Auth, $routeParams, $location, GlobalAlert) {
    console.log('in password edit ctrl');

    $scope.updatePassword = function() {
      $http.put('/auth/passwords/edit/' + $routeParams.token, $scope.user).then(
        function (response) {
          $location.path('/welcome');
          GlobalAlert.add('success', "Password updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }]);
