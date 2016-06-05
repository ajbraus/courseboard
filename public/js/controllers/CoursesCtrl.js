'use strict';

/* COURSE Controllers */

angular.module('courseboard')
  .controller('CoursesIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/courses').then(function(response) {
      $scope.courses = response.data;
    });

    // $http.get('/api/current-courses').then(function(response) {
    //   $scope.currentCourses = response.data;
    // });

    // $scope.upcomingCourses = function(c) {
    //   // return true if course havent started. currernt date > coures start date
    //   return new Date() < new Date(c.startsOn)
    // }

    // $scope.currentCourses = function(c) {
    //   // return true if we are in the middle of the course
    //   return new Date(c.startsOn) <= new Date() && new Date(c.endsOn) >= new Date()
    // }

    // $scope.pastCourses = function(c) {
    //   return new Date() > new Date(c.endsOn)
    // }

  }])

  .controller('CoursesNewCtrl', ['$scope', '$rootScope', '$http', 'GlobalAlert', '$location', function($scope, $rootScope, $http, GlobalAlert, $location) {
    $scope.course = {
      duration: 0,
      instructor: $rootScope.currentUser.role == "Instructor" ? $rootScope.currentUser._id : null,
      objectives: ["", "", ""]
    }
    // var monthNames = ["January", "February", "March", "April", "May", "June",
    //   "July", "August", "September", "October", "November", "December"
    // ];
    // $scope.course.startsOnMonth = monthNames[new Date().getMonth()];
    // $scope.course.startsOnDay = new Date().getDate().toString();
    // $scope.course.startsOnYear = new Date().getFullYear().toString();



    $http.get('/api/instructors').then(function(response) {
      $scope.instructors = response.data;
    });

    $scope.addObjectiveField = function() {
      $scope.course.objectives.push("");
    }

    $scope.rmObjectiveField = function(index) {
      $scope.course.objectives.splice(index, 1)
    }

    $scope.startsOpen = function() {
      $scope.starts.opened = true;
    };
    
    $scope.starts = {
      opened: false
    };

    $scope.endsOpen = function() {
      $scope.ends.opened = true;
    };
    
    $scope.ends = {
      opened: false
    };

    $scope.createCourse = function() {
      $scope.course.endsOn = new Date($scope.course.endsOnMonth + " " + $scope.course.endsOnDay + " " + $scope.course.endsOnYear)
      $scope.course.startsOn = new Date($scope.course.startsOnMonth + " " + $scope.course.startsOnDay + " " + $scope.course.startsOnYear)
      if ($scope.course.endsOn > $scope.course.startsOn) {
        $http.post('/api/courses', $scope.course).then(
          function (response) {
            $scope.course = {};
            $location.path('/courses');
            GlobalAlert.add('success', "Create course request sent", 2000);
          },
          function (response) {
            console.log(response);
            GlobalAlert.add('warning', response.data.message, 2000);
          }
        );
      } else {
        GlobalAlert.add('warning', "Course end date must be after start date", 2000);
      }
    }
  }])

  .controller('CoursesShowCtrl', ['$scope', '$rootScope', 'lodash', '$http', '$routeParams', 'GlobalAlert', function($scope, $rootScope, lodash, $http, $routeParams, GlobalAlert) {
    $scope.isCoursesLoaded = false;
    
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        $scope.course = response.data;
        $scope.isCoursesLoaded = true;

        var index = _.map($scope.course.students, '_id').indexOf($rootScope.currentUser._id)
        $scope.enrolled = index > -1
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      }
    );

    $http.get('/api/courses/' + $routeParams.id + "/posts").then(
      function (response) {
        $scope.posts = response.data;
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      }
    );

    $scope.enroll = function() {
      $http.put('/api/courses/' + $routeParams.id + '/enroll').then(
        function (response) {
          $scope.enrolled = true;
          $scope.course.students.push($rootScope.currentUser)
          GlobalAlert.add('success', "You've enrolled!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.createPost = function() {
      $http.post('/api/courses/' + $scope.course._id + '/posts', $scope.post).then(
        function (response) {
          $scope.post = {};
          $scope.posts.unshift(response.data)

          GlobalAlert.add('success', "Post created successfully!", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    $scope.deletePost = function(post) {
      $http.delete('/api/courses/' + $scope.course._id + '/posts/' + post._id).then(
        function (response) {
          // remove the post from $scope.course
          _.remove($scope.posts, function(coursePost) {
            return post._id == coursePost._id
          })

          GlobalAlert.add('success', "Post removed successfully!", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      )
    }
  }])

  .controller('CoursesEditCtrl', ['$scope', '$http', '$routeParams', '$location', 'GlobalAlert', function($scope, $http, $routeParams, $location, GlobalAlert) {
    $http.get('/api/courses/' + $routeParams.id).then(
      function (response) {
        
        $scope.course = response.data;
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        $scope.course.startsOnMonth = monthNames[new Date($scope.course.startsOn).getMonth()];
        $scope.course.startsOnDay = new Date($scope.course.startsOn).getDate().toString();
        $scope.course.startsOnYear = new Date($scope.course.startsOn).getFullYear().toString();

        $scope.course.endsOnMonth = monthNames[new Date($scope.course.endsOn).getMonth()];
        $scope.course.endsOnDay = new Date($scope.course.endsOn).getDate().toString();
        $scope.course.endsOnYear = new Date($scope.course.endsOn).getFullYear().toString();

        $scope.course.instructor = response.data.instructor._id 
      },

      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      }
    );

    $scope.addObjectiveField = function() {
      $scope.course.objectives.push("");
    }

    $scope.rmObjectiveField = function(index) {
      $scope.course.objectives.splice(index, 1)
    }
    
    $http.get('/api/instructors').then(function(response) {
      $scope.instructors = response.data;
    });

    $scope.dateOptions = {
       formatYear: 'yy',
       maxDate: new Date(2020, 5, 22),
       minDate: new Date()
       // startingDay: 1
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];


    $scope.updateCourse = function() {
      $scope.course.endsOn = new Date($scope.course.endsOnMonth + " " + $scope.course.endsOnDay + " " + $scope.course.endsOnYear)
      $scope.course.startsOn = new Date($scope.course.startsOnMonth + " " + $scope.course.startsOnDay + " " + $scope.course.startsOnYear)

      $http.put('/api/courses/' + $routeParams.id, $scope.course).then(
        function (response) {
          $location.path('/courses/' + $scope.course._id)
          GlobalAlert.add('success', "Course updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    $scope.deleteCourse = function() {
      $http.delete('/api/courses/' + $routeParams.id).then(
        function (response) {
          $location.path('/courses');
          GlobalAlert.add('success', "Course deleted", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }]);