'use strict';

/* COMPETENCE Controllers */

angular.module('courseboard')
  .controller('StudentsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/students').then(function (response) { 
      // students full names & _id
      $scope.userList = response.data;
    })
  }])

  .controller('FeedbackNewCtrl', ['$scope', '$http', '$auth', '$routeParams', '$location', 'Auth', 'Competencies', 'GlobalAlert', function($scope, $http, $auth, $routeParams, $location, Auth, Competencies, GlobalAlert) {
    $scope.feedback = {
      body:"",
      competencies: []
    }

    $http.get('/api/users/' + $routeParams.id).then(function (response) {
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
          // $scope.competencies = _.sortBy($scope.competencies, ['name']);
        })
      });
    })

    $scope.createFeedback = function() {
      // grab competencies with levels < 0
      $scope.feedback.competencies = _.filter($scope.competencies, function (c) { return c.level > 0 })
      console.log($scope.feedback.competencies);
      // send body & competencies to POST /api/user/:id/feedback
      $http.post('/api/user/' + $scope.user.id + '/feedback', $scope.feedback).then(
        function (response) {
          $scope.feedback = {};
          $location.path('/users/' + $scope.user._id);
          GlobalAlert.add('success', "Feedback saved", 2000);
        },
        function (response) {
          console.log(response);
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    // $scope.updateCompetency = function(competencyName, level, kind) {
    //   if (level >= 0 && level <= 5) {
    //     $http.put('/api/users/' + $scope.user._id + '/competencies', { name: competencyName, level: level, kind: kind }).then(function (response) {
    //       var competency = _.find($scope.competencies, { 'name': competencyName });
    //       competency.level = level;
    //     })        
    //   }
    // }
  }]);
