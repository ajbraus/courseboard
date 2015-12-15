'use strict';

/* QUESTIONS Controllers */

angular.module('basic-auth')
  .controller('QuestionsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'Question', function($scope, $http, $auth, Auth, Question) {
    $scope.questions = Question.query()
  }]);