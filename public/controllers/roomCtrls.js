angular.module('myApp')
  .controller('RoomIndexCtrl', function ($scope, $rootScope, Post, Socket, $routeParams, $location) {
    $scope.room = { name: '' };
    
    $scope.enterRoom = function() {
      $scope.$emit('enter.room', $scope.room.name);
      $location.path("/" + $scope.room.name);
    }
  });