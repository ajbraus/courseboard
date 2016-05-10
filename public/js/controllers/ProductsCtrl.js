'use strict';

/* PRODUCT Controllers */

angular.module('courseboard')
  .controller('ProductsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/products').then(function(response) {
      $scope.products = response.data;
    });

  }])

  .controller('ProductsNewCtrl', ['$scope', '$rootScope', '$http', 'GlobalAlert', '$location', function($scope, $rootScope, $http, GlobalAlert, $location) {
    $scope.product = {}

    $http.get('/api/instructors').then(function(response) {
      $scope.instructors = response.data;
    });

   
    $scope.createProduct = function() {
      console.log($scope.product)
      $http.post('/api/products', $scope.product).then(
        function (response) {
          $scope.product = {};
          $location.path('/products');
          GlobalAlert.add('success', "Create product request sent", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }])

  .controller('ProductsShowCtrl', ['$scope', '$rootScope', 'lodash', '$http', '$routeParams', 'GlobalAlert', function($scope, $rootScope, lodash, $http, $routeParams, GlobalAlert) {
    // $scope.isCoursesLoaded = false;

    // $scope.product = {
    //   title: 'My Cool Product',
    //   description: 'I put the radio on the Internet with my cool product and am now a billionaire and I invest in super cool apps like this one. Being almost a billionaire isnt enough and I drink fancy tequilla and accidentally press the delete button when I gift the fancy tequila which makes my investment go to shit b/c I accidentally deleted 50% of a clients data.',
    //   contributors: [{username: 'lesliekimm'}]
    // }

    // console.log($scope.product)
    
    $http.get('/api/products/' + $routeParams.id).then(
      function (response) {
        $scope.product = response.data;
        $scope.isCoursesLoaded = true;

        var index = _.map($scope.product.students, '_id').indexOf($rootScope.currentUser._id)
        $scope.enrolled = index > -1
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      }
    );

    $scope.enroll = function() {
      $http.put('/api/products/' + $routeParams.id + '/enroll').then(
        function (response) {
          $scope.enrolled = true;
          $scope.product.students.push($rootScope.currentUser)
          GlobalAlert.add('success', "You've enrolled!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }
  }])

  .controller('ProductsEditCtrl', ['$scope', '$http', '$routeParams', '$location', 'GlobalAlert', function($scope, $http, $routeParams, $location, GlobalAlert) {
    $http.get('/api/products/' + $routeParams.id).then(
      function (response) {
        $scope.product = response.data;
        $scope.product.instructor = response.data.instructor._id 
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      }
    );

    $scope.addObjectiveField = function() {
      $scope.product.objectives.push("");
    }

    $scope.rmObjectiveField = function(index) {
      $scope.product.objectives.splice(index, 1)
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
      $http.put('/api/products/' + $routeParams.id, $scope.product).then(
        function (response) {
          $location.path('/products/' + $scope.product._id)
          GlobalAlert.add('success', "Course updated", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    $scope.deleteCourse = function() {
      $http.delete('/api/products/' + $routeParams.id).then(
        function (response) {
          $location.path('/products');
          GlobalAlert.add('success', "Course deleted", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }]);