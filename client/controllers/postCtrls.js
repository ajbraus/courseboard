/*
 * POST CONTROLLERS
 */

'use strict';

angular.module('myApp')
  .controller('PostIndexCtrl', function ($scope, Post, Socket) {
    $scope.post = {};
    $scope.posts = Post.query();

    Socket.on('post.published', function (post) {
      $scope.posts.unshift(post);
    });

    Socket.on('post.voted_up', function (post) {
      var post = _.findWhere($scope.posts, {_id: post._id});
      post.votes_count = ++post.votes_count
    });

    Socket.on('post.voted_down', function (post) {
      var post = _.findWhere($scope.posts, {_id: post._id});
      post.votes_count = --post.votes_count
    });

    $scope.publishPost = function () {
      console.log($scope.post)
      Post.save({}, $scope.post, function (data) {
        $scope.post.body = ''  
      });
    };

    $scope.voteUp = function (post) {
      Post.vote_up({ id: post._id })
    }

    $scope.voteDown = function (post) {
      Post.vote_down({ id: post._id })
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