angular.module('myApp')
  .controller('RoomIndexCtrl', function ($scope, $rootScope, Post, Socket, $routeParams, $location) {
    $scope.room = { name: '' };
    
    $scope.enterRoom = function() {
      $rootScope.$emit('enter.room', $scope.room.name);
      $location.path("/" + $scope.room.name);
    }
  });