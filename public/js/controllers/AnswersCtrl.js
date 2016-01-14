'use strict';

/* QUESTIONS Controllers */

angular.module('ga-qa')
  .controller('AnswersEditCtrl', ['$scope', '$http', '$location', '$routeParams', '$auth', 'Auth', 'Answer', 'GlobalAlert', function($scope, $http, $location, $routeParams, $auth, Auth, Answer, GlobalAlert) {
    Answer.get({ questionId: $routeParams.questionId, id: $routeParams.id }, function (response) {
      $scope.answer = response;
    });
    
    $scope.deleteAnswer = function(answer) {
      answer.$remove({ questionId: $routeParams.questionId, id: answer._id }).then(
        function (response) {
          $location.path('/questions/' + $routeParams.questionId)

          GlobalAlert.add('success', "Answer deleted", 2000);
        }, 
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }

    $scope.createAnswer = function() {
      var answer = new Answer($scope.answer);

      answer.$update({ questionId: $routeParams.questionId, id: answer._id }).then(
        function (response) {
          $location.path('/questions/' + $routeParams.questionId)

          GlobalAlert.add('success', "Answer updated", 2000);
        }, 
        function (response) {
          GlobalAlert.add('warning', response.data.message, 2000);
        }
      );
    }
  }])