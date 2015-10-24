'use strict';

/* Controllers */

angular.module('zoinks.controllers', [])
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'Auth', 'Zoink',  function($scope, $rootScope, $location, Auth, Zoink) {
    // ZOINKS
    $scope.zoinks = Zoink.query();

    // NEW ZOINK
    $scope.zoink = {};
    var currentUser = Auth.isLoggedIn();

    $scope.createZoink = function() {
      console.log('hello')
      var zoink = new Zoink($scope.zoink)
      zoink.$save(function(zoink) {
        $location.path('/zoinks/' + zoink._id)
        $('#new-zoink').modal('hide');
      });
    }

    // LOGIN/REGISTER
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

  .controller('ZoinkShowCtrl', ['$scope', '$routeParams', 'Zoink', 'Auth', 'socket', function($scope, $routeParams, Zoink, Auth, socket) {
    $scope.zoink = Zoink.get({ id: $routeParams.id });


    // INVITES

    // NEW INVITE
    $scope.toggleNewInvite = function() {
      $scope.newInvite = !$scope.newInvite;
    }

    $scope.invite = {zoinkId: $routeParams.id}
    $scope.addInvite = function() {
      if (($scope.zoink.invites.indexOf($scope.invite.email) == -1)) {
        socket.emit('publish:addInvite', $scope.invite)
        $scope.invite.email = '';
        $scope.toggleNewInvite();
      } else {
        alert($scope.invite.email + " is already invited.")
      }
    }

    $scope.$on('socket:addInvite', function (event, invite) {
      // if (invite.zoinkId == $scope.zoink._id) {
        $scope.$apply(function() {
          $scope.zoink.invites.push(invite);
        });
      // };
    });

    // REMOVE INVITE
    $scope.rmInvite = function(email) {
      var invite = { zoinkId: $routeParams.id, email: email }
      socket.emit('publish:rmInvite', invite)
    }

    $scope.$on('socket:rmInvite', function (event, invite) {
      // if (invite.zoinkId == $scope.zoink._id) {
        $scope.$apply(function() {
          var index = $scope.zoink.invites.indexOf(invite);
          $scope.zoink.invites.splice(index, 1);
        });
      // };
    });

    
    // CHAT

    // ADD MESSAGE
    $scope.message = {zoinkId: $routeParams.id}
    $scope.addMessage = function() {
      socket.emit('publish:addMessage', $scope.message)
    }

    $scope.$on('socket:addMessage', function (event, message) {
      console.log('message added')
      // if (invite.zoinkId == $scope.zoink._id) {
        $scope.$apply(function() {
          $scope.zoink.messages.push(message);
          $scope.message.content = '';
        });
      // };
    });

    // REMOVE MESSAGE
    $scope.rmMessage = function(content) {
      var message = { zoinkId: $routeParams.id, content: content }
      socket.emit('publish:rmMessage', message)
    }

    $scope.$on('socket:rmMessage', function (event, message) {
      // if (invite.zoinkId == $scope.zoink._id) {
        $scope.$apply(function() {
          var index = $scope.zoink.messages.indexOf(message);
          $scope.zoink.messages.splice(index, 1);
        });
      // };
    });


    // RSVP TO ZOINK
    $scope.rsvp = function() {
      socket.emit('publish.rsvp')
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