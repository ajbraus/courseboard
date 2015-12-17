'use strict';

/* QUESTIONS Controllers */

angular.module('basic-auth')
  .controller('QuestionsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'Question', function($scope, $http, $auth, Auth, Question) {
    $scope.questions = Question.query();
  }])

  .controller('QuestionsShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'Question', 'Answer', function($scope, $http, $routeParams, $auth, Auth, Question, Answer) {
    console.log($routeParams.id)
    Question.get({ id: $routeParams.id }, function (question) {
      $scope.question = question;

      $scope.isCurrentUsersQuestion = false;
      if ($scope.question.user == $auth.getPayload().sub) {
        $scope.isCurrentUsersQuestion = true;
      }
    });

    $scope.createAnswer = function() {
      var answer = new Answer($scope.answer);
      answer.$save({ questionId: $scope.question._id }).then(
        function (response) {
          $scope.question.answers.push(response);
        }, 
        function (response) {
          console.log(response)
        }
      );
    }
  }])

  .controller('QuestionsEditCtrl', ['$scope', '$http', '$location', '$routeParams', '$auth', 'Auth', 'Question', function($scope, $http, $location, $routeParams, $auth, Auth, Question) {
    $scope.editQuestion = true;
    $scope.question = Question.get({ id: $routeParams.id });
    $scope.createQuestion = function() {
      var question = new Question($scope.question);
      question.$update({id: question._id}).then(
        function (response) {
          $location.path('/questions/' + response._id)
        }, 
        function (response) {
          console.log(response);
        }
      );
    }
  }])

  .controller('QuestionsNewCtrl', ['$scope', '$http', '$auth', 'Auth', 'Question', '$location', function($scope, $http, $auth, Auth, Question, $location) {
    $scope.question = {};

    $scope.createQuestion = function() {
    	var question = new Question($scope.question);
    	question.$save().then(
    		function (response) {
    			$location.path('/questions/' + response._id)
    		}, 
    		function (response) {
    			console.log(response);
    		}
    	);
    }
  }]);

  