'use strict';

/* COMPETENCIES Controllers */

angular.module('courseboard')
  .controller('CompetenciesEditCtrl', ['$routeParams', '$rootScope', '$scope', 'Competencies', '$http', '$auth', '$location', 'Auth', 'GlobalAlert', function($routeParams, $rootScope, $scope, Competencies, $http, $auth, $location, Auth, GlobalAlert) {
    $scope.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };
    
    if ($routeParams.id) {
      var userId = $routeParams.id;
    } else {
      var userId = $rootScope.currentUser._id;
    }

    $scope.feedback = {
      body:"",
      competencies: []
    }

    $http.get('/api/users/' + userId).then(function (response) {
      $scope.user = response.data;

      //MASTER COMPETENCIES LIST LIVES IN SERVICES.JS
      console.log(Competencies.all)
      console.log($scope.user.competencies)
      
      $scope.competencies = Competencies.all      
      _.each(Competencies.all, function (competency) { 
        _.each($scope.user.competencies, function (userCompetency) {
          // if their names match, replace it
          if (competency.name == userCompetency.name) {
            var index = _.findIndex($scope.competencies, competency);
            $scope.competencies[index] = userCompetency;
          }
        })
      });
    })

    $scope.updateCompetencies = function() {
      // grab competencies with levels < 0
      $scope.feedback.competencies = _.filter($scope.competencies, function (c) { return c.level > 0 })
      
      // send body & competencies to POST /api/user/:id/feedback
      $http.put('/api/user/' + $scope.user.id + '/competencies', $scope.feedback).then(
        function (response) {
          $scope.feedback = {};
          $location.path('/');
          GlobalAlert.add('success', "Feedback logged and sent", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }])