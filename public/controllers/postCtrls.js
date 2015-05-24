/*
 * POST CONTROLLERS
 */

'use strict';

angular.module('myApp')
  .controller('PostIndexCtrl', function ($scope, $rootScope, Post, Socket, $routeParams, $cookies, $location) {
    $scope.order = '-created_at';
    $scope.orderButton = "Newest"

    $scope.switchOrder = function() {
      if ($scope.order == '-created_at') {
        console.log("vote_count")
        $scope.order = '-votes_count';
        $scope.orderButton = "Votes"
      }  else {
        console.log("created_at")
        $scope.order = '-created_at'
        $scope.orderButton = "Newest"
      }
    }

    $scope.room = { name: $routeParams.room_name };
    $scope.room_name = "#" + $routeParams.room_name
    
    $scope.enterRoom = function() {
      $rootScope.$emit('enter.room', $scope.room.name);
      $location.path("/" + $scope.room.name);
    }

    // GET POSTS
    $scope.posts = Post.query({ "room_name": $routeParams.room_name });

    $scope.post = { "room_name": $routeParams.room_name };

    // PUBLISH POST
    $scope.$on('socket:broadcast.post', function (event, post) {
      if (post.room_name.toLowerCase() == $routeParams.room_name.toLowerCase()) {
        $scope.$apply(function() {
          $scope.posts.unshift(post);     
        });
      };
    });

    $scope.alreadyVoted =  function(post, direction){
      if (direction === 'up') {
        return $scope.vup_ids.indexOf(post._id) > -1  
      } else if (direction === 'down') {
        return $scope.vdp_ids.indexOf(post._id) > -1
      }
    }

    $scope.publishPost = function () {
      console.log($scope.post)
      Socket.emit('publish.post', $scope.post);
      $scope.post.body = ''     
    };


    if (!$cookies.vup_ids) {
      $scope.vup_ids = [];
    } else {
      $scope.vup_ids = JSON.parse($cookies.vup_ids);
    }

    if (!$cookies.vdp_ids) {
      $scope.vdp_ids = [];
    } else {
      $scope.vdp_ids = JSON.parse($cookies.vdp_ids);
    }

    // click vote up
    // if already voted up, return nil
    // else emit vote_up.post
    // on response 
    // if already voted down, remove from vdp_ids
    // else add to vup_ids

    // VOTE UP
    $scope.voteUp = function (post) {
      if ($scope.vup_ids.indexOf(post._id) > -1 ) {
        console.log('already voted up')
        console.log($scope.vup_ids)
      } else {
        Socket.emit("vote_up.post", { id: post._id });

        if ($scope.vdp_ids.indexOf(post._id) > -1) {
          //remove from vote down ids
          $scope.vdp_ids = _.without($scope.vdp_ids, post._id);
          $cookies.vdp_ids = JSON.stringify($scope.vdp_ids);
        } else {
          // Add and save voted down ids to cookie
          $scope.vup_ids.push(post._id)
          $cookies.vup_ids = JSON.stringify($scope.vup_ids);
        }

      }
    }

    $scope.$on('socket:broadcast.vote_up', function (event, post) {
      var post = _.findWhere($scope.posts, {_id: post._id});
      // INCREMENT VOTE_COUNT
      post.votes_count = ++post.votes_count
    });

    $scope.voteDown = function (post) {
      if ($scope.vdp_ids.indexOf(post._id) > -1 ) {
        console.log('already voted down')
        console.log($scope.vdp_ids)
      } else {
        Socket.emit("vote_down.post", { id: post._id });  
        
        if ($scope.vup_ids.indexOf(post._id) > -1) {
          //remove from vote up ids
          $scope.vup_ids = _.without($scope.vup_ids, post._id);
          $cookies.vup_ids = JSON.stringify($scope.vup_ids);
        } else {
          $scope.vdp_ids.push(post._id)
          $cookies.vdp_ids = JSON.stringify($scope.vdp_ids);
        }
      }
    }

    $scope.$on('socket:broadcast.vote_down', function (event, post) {
      var post = _.findWhere($scope.posts, {_id: post._id});
      // DECREMENT vote_count
      post.votes_count = --post.votes_count
    });


    // Socket.on('user:left', function (data) {
    //   $scope.messages.push({
    //     user: 'chatroom',
    //     text: 'User ' + data.name + ' has left.'
    //   });
    //   var i, user;
    //   for (i = 0; i < $scope.users.length; i++) {
    //     user = $scope.users[i];
    //     if (user === data.name) {
    //       $scope.users.splice(i, 1);
    //       break;
    //     }
    //   }
    // });
    
  });