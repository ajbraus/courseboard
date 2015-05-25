angular.module('myApp')
  .controller('RoomIndexCtrl', function ($scope, $rootScope, $location) {
    $scope.room_name = ''
    
    $scope.enterRoom = function() {
      $location.path("/" + $scope.room_name);
    }
  });