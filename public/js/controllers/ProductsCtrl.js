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

    $http.get('/api/current-courses').then(function(response) {
      $scope.courses = response.data;
    });
   
    $scope.createProduct = function() {
      console.log($scope.product)
      $http.post('/api/products', $scope.product).then(
        function (response) {
          $scope.product = {};
          $location.path('/products/' + response.data._id);
          console.log($scope.product.contributors);
          GlobalAlert.add('success', "Successfully created product", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }])

  .controller('ProductsShowCtrl', ['$scope', '$rootScope', 'lodash', '$http', '$routeParams', '$window', '$location', 'GlobalAlert', function($scope, $rootScope, lodash, $http, $routeParams, $window, $location, GlobalAlert) {
    $scope.isProductsLoaded = false;
    
    $http.get('/api/products/' + $routeParams.id).then(
      function (response) {
        $scope.product = response.data;
        $scope.isProductsLoaded = true;

        
        // Find out if current user is a contributor
        var index = _.map($scope.product.contributors, '_id').indexOf($rootScope.currentUser._id)
        $scope.isContributor = index > -1
      },
      function (response) {
        GlobalAlert.add('warning', response.data.message, 2000);
      }
    );

    $scope.goToUrl = function(url) {
      console.log(url)
      $window.open(url);
    }

    // $http.get('/api/products/' + $routeParams.id + "/posts").then(
    //   function (response) {
    //     $scope.posts = response.data;
    //   },
    //   function (response) {
    //     GlobalAlert.add('warning', response.data.message, 2000);
    //   }
    // );

    $scope.join = function() {
      $http.put('/api/products/' + $routeParams.id + '/join').then(
        function (response) {
          $scope.isContributor = true;
          $scope.product.contributors.push($rootScope.currentUser)
          GlobalAlert.add('success', "You've joined!", 3000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 3000);
        }
      );
    }

    $scope.leave = function(product) {
      $http.put('/api/products/' + product._id + '/leave').then(
        function (response) {
          product.joined = false;
          GlobalAlert.add('success', "You've left the product team!", 3000);
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


    $scope.updateProduct = function() {
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

    $scope.deleteProduct = function() {
      $http.delete('/api/products/' + $routeParams.id).then(
        function (response) {
          $location.path('/products');
          GlobalAlert.add('success', "Product deleted", 2000);
        },
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }]);