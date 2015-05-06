/*
 * POST CONTROLLERS
 */

'use strict';

angular.module('myApp')
  .controller('PostIndexCtrl', function ($scope, Post, Socket, $routeParams) {
    // SET ROOMNAME
    $scope.roomName = "#" + $routeParams.roomName

    // JOIN OR CREATE ROOM BY ROOMNAME
    // Socket.join($routeParams.roomName, function (){
    //   console.log('joined ' + $routeParams.roomName)
    // });

    // GET POSTS
    $scope.posts = Post.query({ "roomName": $routeParams.roomName });

    $scope.post = { "roomName": $routeParams.roomName };

    // PUBLISH POST
    $scope.$on('socket:broadcast.post', function (event, post) {
      $scope.$apply(function() {
        $scope.posts.unshift(post);
        $scope.post.body = ''          
      })
    });

    $scope.publishPost = function () {
      console.log($scope.post)
      Socket.emit('publish.post', $scope.post);
    };

    // VOTE UP
    $scope.$on('socket:broadcast.vote_up', function (event, post) {
      var post = _.findWhere($scope.posts, {_id: post._id});
      post.votes_count = ++post.votes_count
    });

    $scope.voteUp = function (post) {
      console.log("voting up")
      Socket.emit("vote_up.post", { id: post._id });
    }

    $scope.$on('socket:broadcast.vote_down', function (event, post) {
      var post = _.findWhere($scope.posts, {_id: post._id});
      post.votes_count = --post.votes_count
    });

    $scope.voteDown = function (post) {
      Socket.emit("vote_down.post", { id: post._id });
    }

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