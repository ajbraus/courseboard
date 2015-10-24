'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('MainCtrl', ['$scope', '$rootScope', 'Auth', 'Zoink',  function($scope, $rootScope, Auth, Zoink) {
    $scope.zoinks = Zoink.query();

    $scope.signupMode = false;
    $scope.user = {};

    Auth.isLoggedIn();

    $rootScope.$on('loggedIn', function() {
      $scope.loggedIn = true;
    })

    $scope.login = function() {
       $scope.err = null;
       console.log('logging in')

       if (Auth.assertValidLoginAttempt($scope.user)) {
          ref.authWithPassword($scope.user, function(error, authData) {
            if (error) { 
              $scope.err = Auth.handleAuthError(error);
            } else {
              $rootScope.$broadcast('loggedIn');
              $scope.$apply(function() {
                $('#login-modal').modal('hide');
              });
            }
          });
       }
    };

    $scope.createAccount = function() {
      $scope.err = Auth.assertValidLoginAttempt($scope.user);

      if (!$scope.err) {
        ref.createUser({
          email: $scope.user.email,
          password: $scope.user.password
        }, function(error, userData) {
          if (error) {
            $scope.err = Auth.handleAuthError(error);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            ref.authWithPassword({
              email: $scope.user.email,
              password: $scope.user.password
            }, function(error, authData) {
              Auth.isLoggedIn(authData);
              $scope.$apply(function() {
                $('#login-modal').modal('hide');
              });
            })
          }
        });
      }
    };

    $scope.logout = function() {
       ref.unauth();
       $scope.loggedIn = false
    };

    $scope.toggleSidenav = function() {
       $scope.$broadcast('toggleSidenav');
    }
  }])

  .controller('NewZoinkCtrl', ['$scope', '$location', 'Zoink', 'Auth', function($scope, $location, Zoink, Auth) {
    $scope.zoink = {};
    var currentUser = Auth.isLoggedIn();
    $scope.createZoink = function() {
      var zoink = new Zoink($scope.zoink)
      zoink.$save(function(err, zoink) {
        $location.path('/zoinks/' + zoink._id)
        $('#new-zoink').modal('hide');
      });
    }

  }])

  .controller('ZoinkShowCtrl', ['$scope', '$routeParams', 'Zoink', 'Auth', function($scope, $routeParams, Zoink, Auth) {
    $scope.zoink = Zoink.get({ id: $routeParams.id });
    
    $scope.showSidenav = true;
    $scope.$on('toggleSidenav', function() {
      $scope.showSidenav = !$scope.showSidenav;
    })


    $scope.toggleNewInvite = function() {
      $scope.newInvite = !$scope.newInvite;
    }

    $scope.addInvite = function() {

    }

    $scope.rsvp = function() {

    }


    // CARPOOLS

    $scope.joinCar = function(carpool) {
      // TODO
      // carpool.push(currenUser);
    }

    $scope.claimRequirement = function(requirement) {
      // TODO
      // requirement.owner.push(currentUser);
      // display owner in template
    }

    // CARPOOLS
    $scope.toggleNewCarpool = function() {
      $scope.newCarpool = !$scope.newCarpool;
    }
    $scope.addCarpool = function() {
      // carpool.driver = currentUser;
      $scope.zoink.carpools.unshift($scope.carpool)
      $scope.newCarpool = false;
      $scope.carpool = {};
    }

    // REQUIREMENTS
    $scope.toggleNewRequirement = function() {
      $scope.newRequirement = !$scope.newRequirement;
    }
    $scope.addRequirement = function() {
      $scope.zoink.requirements.unshift($scope.requirement)
      $scope.newRequirement = false;
      $scope.requirement = {};
    }

    // TODOS
    $scope.toggleNewTodo = function() {
      $scope.newTodo = !$scope.newTodo;
    }
    $scope.addTodo = function() {
      $scope.zoink.todos.unshift($scope.todo)
      $scope.newTodo = false;
      $scope.todo = {};
    }
 
  }])

   ;