'use strict';

/* Controllers */

angular.module('zoinks.controllers', [])
  .controller('MainCtrl', ['$scope', '$rootScope', '$location', 'Auth', 'Zoink', '$auth',  function($scope, $rootScope, $location, Auth, Zoink, $auth) {
    // ZOINKS
    $scope.zoinks = Zoink.query();

    // NEW ZOINK
    $scope.zoink = {};
    var currentUser = Auth.currentUser();
    console.log(currentUser)

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

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.loggedIn = $scope.isAuthenticated();

    $rootScope.$on('loggedIn', function() {
      $scope.loggedIn = true;
    });

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
          // toastr.info('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          // toastr.error(response.data.message);
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          // toastr.success('You have successfully signed in');
          $rootScope.$broadcast('loggedIn');
          $scope.$apply(function() {
            $('#login-modal').modal('hide');
          });
        })
        .catch(function(response) {
          // toastr.error(response.data.message, response.status);
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          // toastr.success('You have successfully signed in with ' + provider);
          $location.path('/');
        })
        .catch(function(response) {
          // toastr.error(response.data.message);
        });
    };

    $scope.logout = function() {
      $auth.logout()
        .then(function() {
          // toastr.info('You have been logged out');
          $location.path('/');
        });
    };
  }])

  .controller('ZoinkShowCtrl', ['$scope', '$routeParams', 'Zoink', 'Auth', 'socket', function($scope, $routeParams, Zoink, Auth, socket) {
    Zoink.get({ id: $routeParams.id }, function(data) {
      $scope.zoink = data
      socket.emit('publish:joinRoom', $scope.zoink);
    });

    $scope.$on('socket:joinRoom', function (event, clientsCount) {
      $scope.clientsCount = clientsCount;
    })

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