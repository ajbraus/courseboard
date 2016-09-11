'use strict';

/* USER Controllers */

angular.module('courseboard')
  .controller('InstructorDashboardCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;
    });

    $scope.publishCourse = function(course) {
      $http.put('/api/courses/' + course._id + '/publish').then(
        function (response) {
          course.publishedAt = new Date();
          GlobalAlert.add('success', "Course published!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }

    $scope.unPublishCourse = function(course) {
      $http.put('/api/courses/' + course._id + '/unpublish').then(
        function (response) {
          course.publishedAt = null;
          GlobalAlert.add('success', "Course unpublished!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }
  }])

  .controller('ProfileCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/me').then(function(response) {
      $scope.user = response.data;

      // POSTS
      $http.get('/api/users/' + $scope.user._id + '/posts').then(function(response) {
        $scope.posts = response.data;
      });
    });
  }])

  .controller('CompetencesIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/me').then(function (response) {
      $scope.user = response.data;
    });

    // $http.get('/api/competences').then(function (response) {
    //   console.log(response)
    //   $scope.competences = response.data;
    // })

    $scope.incrementCompetence = function(competenceName) {
      $http.put('/api/users/' + $scope.user._id + '/competences', { name: competenceName }).then(function (response) {
        $scope.user = response.data;
      })
    }

    $scope.competences = [
      { name: 'Professionalism', level:0 },
      { name: 'Teamwork', level:0 },
      { name: 'Energy & Agility', level:0 },
      { name: 'Leadership', level:0 },
      { name: 'Emotional Intelligence', level:0 },
      { name: 'Communication', level:0 },
      { name: 'Productivity', level:0 },
      { name: 'Product Management', level:0 },
      { name: 'Code Craftsmanship', level:0 },
      { name: 'Computer Science Fundamentals', level:0 },
      { name: 'Product Development & Entrepreneurship', level:0 },
      { name: 'iOS', level:0 },
      { name: 'JavaScript, Node, npm, ExpressJS', level:0 },
      { name: 'JavaScript, Front End Frameworks', level:0 },
      { name: 'Ruby & Ruby on Rails (backend)', level:0 },
      { name: 'Python & Flask', level:0 },
      { name: 'Devices/Embedded Systems', level:0 },
      { name: 'Machine Learning', level:0 },
      { name: 'Data Science & Visualization', level:0 },
      { name: 'SQL Databases', level:0 },
      { name: 'NoSQL Databases', level:0 },
      { name: 'Deployment & Dev Ops', level:0 },
      { name: 'TDD', level:0 },
      { name: 'Writing', level:0 },
      { name: 'Public Speaking & Pitching', level:0 },
      { name: 'Growth and Marketing', level:0 },
      { name: 'Internet and Networking Fundamentals', level:0 },
      { name: 'API Design', level:0 },
      { name: 'Graphic Design', level:0 }
    ]
  }])

  .controller('UsersShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $routeParams, $auth, Auth, GlobalAlert) {
    $http.get('/api/users/' + $routeParams.id).then(
      function (response) {
        $scope.user = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      });

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

    // $scope.enroll = function(course) {
    //   $http.put('/api/courses/' + course._id + '/enroll').then(
    //     function (response) {
    //       course.enrolled = true;

    //       // $scope.course.students.push($rootScope.currentUser)
    //       GlobalAlert.add('success', "You've enrolled!", 3000);
    //     },
    //     function (response) {
    //       GlobalAlert.add('warning', response.data.message, 3000);
    //     }
    //   );
    // }

    // $scope.unenroll = function(course) {
    //   $http.put('/api/courses/' + course._id + '/unenroll').then(
    //     function (response) {
    //       course.enrolled = false;
    //       // var index = _.map($scope.course.students, '_id').indexOf($rootScope.currentUser._id)
    //       // $scope.course.students.splice(index, 1)
    //       GlobalAlert.add('success', "You've unenrolled!", 3000);
    //     },
    //     function (response) {
    //       GlobalAlert.add('warning', response.data.message, 3000);
    //     }
    //   );
    // }
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

  .controller('PasswordEditCtrl', ['$scope', '$http', '$auth', 'Auth', '$routeParams', '$location', 'GlobalAlert', function($scope, $http, $auth, Auth, $routeParams, $location, GlobalAlert) {
    console.log('in password edit ctrl');
    $scope.updatePassword = function() {
      $http.put('/auth/passwords/edit/' + $routeParams.token, $scope.user).then(
        function (response) {
          $location.path('/');
          GlobalAlert.add('success', "Password updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }]);
