'use strict';

/* QUESTIONS Controllers */

angular.module('basic-auth')
  .controller('QuestionsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'Question', function($scope, $http, $auth, Auth, Question) {
    $scope.questions = Question.query();
  }])

  .controller('QuestionsShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'Question', 'Answer', function($scope, $http, $routeParams, $auth, Auth, Question, Answer) {
    Question.get({ id: $routeParams.id }, function (question) {
      $scope.question = question;

      $scope.isCurrentUsersQuestion = false;
      if ($scope.question.user._id == $auth.getPayload().sub) {
        $scope.isCurrentUsersQuestion = true;
      }
    });

    $scope.questions = Question.query();

    $scope.answers = Answer.query({ questionId: $routeParams.id })

    $scope.createAnswer = function() {
      var answer = new Answer($scope.answer);
      answer.$save({ questionId: $scope.question._id }).then(
        function (response) {
          console.log(response)
          $scope.answers.push(response);
          $scope.answer = {};

          // ADDING REPUTATION
          $rootScope.currentUser.rep = $rootScope.currentUser.rep + 10
        }, 
        function (response) {
          console.log(response)
        }
      );
    }

    // $scope.createQuestionComment = function() {
    //   $scope.comment.type = "question";
    //   var comment = new Comment($scope.comment);
    //   comment.$save({ parentId: $scope.question._id }).then(
    //     function (response) {
    //       $scope.question.comments.push(response);
    //     },
    //     function (response) {
    //       console.log(response)
    //     }
    //   );
    // }

    // $scope.createAnswerComment = function(answer) {
    //   $scope.comment.type = "answer";
    //   var comment = new Comment($scope.comment);
    //   comment.$save({ parentId: $scope.answer._id }).then(
    //     function (response) {
    //       $scope.answer.comments.push(response);
    //     },
    //     function (response) {
    //       console.log(response)
    //     }
    //   );
    // }

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

  .controller('QuestionsNewCtrl', ['$scope', '$rootScope', '$http', '$auth', 'Auth', 'Question', '$location', function($scope, $rootScope, $http, $auth, Auth, Question, $location) {
    $scope.question = {};

    $scope.createQuestion = function() {
    	var question = new Question($scope.question);
    	question.$save().then(
    		function (response) {
          // ADDING REPUTATION
          $rootScope.currentUser.rep = $rootScope.currentUser.rep + 5

    			$location.path('/questions/' + response._id)
    		}, 
    		function (response) {
    			console.log(response);
    		}
    	);
    }
  }]);

  