'use strict';

/* ZOINKS Controllers */

angular.module('zoinks')
  .controller('ProfileCtrl', ['$scope', '$http', 'Zoink', 'Invite', '$auth', 'Auth', function($scope, $http, Zoink, Invite, $auth, Auth) {
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });
    $scope.zoinks = Zoink.query();
    $scope.invites = Invite.query();
  }]);