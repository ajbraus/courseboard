'use strict';

/* ZOINKS Controllers */

angular.module('zoinks')
  .controller('ZoinkShowCtrl', ['$scope', '$routeParams', 'Zoink', 'socket', '$auth', 'Auth', function($scope, $routeParams, Zoink, socket, $auth, Auth) {
    var currentUser = Auth.currentUser()

    Zoink.get({ id: $routeParams.id }, function(data) {
      $scope.zoink = data
      socket.emit('publish:joinRoom', $scope.zoink);

      $scope.rsvped = currentUser._id.indexOf(_.pluck($scope.zoink.rsvps, '_id')) > -1
      $scope.invited = currentUser.email.indexOf($scope.zoink.invites) > -1
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

    // RSVP

    // RSVP IN
    $scope.rsvp = function() {
      var rsvp = { zoinkId: $routeParams.id, user: currentUser }
      socket.emit('publish:addRsvp', rsvp)
    }

    $scope.$on('socket:addRsvp', function (event, user) {
      console.log('Rsvp Added')
      $scope.$apply(function() {
        // ADD TO RSVPS
        $scope.zoink.rsvps.push(user);

        // REMOVE FROM INVITES (if in invites)
        var index = $scope.zoink.invites.indexOf(user.email);
        if (index > -1) {
          $scope.zoink.invites.splice(index, 1);
        }
        
        $scope.rsvped = true;
      });
    });

    // RSVP OUT
    $scope.unrsvp = function() {
      var rsvp = { zoinkId: $routeParams.id, user: currentUser }
      socket.emit('publish:rmRsvp', rsvp) 
    }

    $scope.$on('socket:rmRsvp', function (event, user) {
      console.log('Rsvp Removed')
      $scope.$apply(function() {
        // ADD BACK TO INVITES
        $scope.zoink.invites.push(user.email);

        // REMOVE FROM RSVPS
        var index = user._id.indexOf(_.pluck($scope.zoink.rsvps, '_id'));
        $scope.zoink.rsvps.splice(index, 1);

        $scope.rsvped = false;
      });
    });
    
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
      var reqs = { zoinkId: $routeParams.id, reqs: $scope.requirement };
      socket.emit('publish:addReq', reqs);
      $scope.requirement = [];
    };

    $scope.$on('socket:addReq', function (event, req) {
      console.log('Req Added')
      $scope.$apply(function() {
        // ADD TO REQS
        $scope.zoink.reqs.push(req.reqs);
        console.log('updated reqs on zoink', $scope.zoink);
      });
    });

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