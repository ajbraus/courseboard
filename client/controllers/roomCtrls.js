angular.module('myApp')
  .controller('RoomIndexCtrl', function ($scope, $rootScope, Post, Socket, $routeParams, $location) {
    $scope.room = { name: '' };

    $scope.enterRoom = function() {
      $rootScope.$emit('enteredRoom', $scope.room.name);
      $location.path("/" + $scope.room.name);
    }
  });