'use strict';

/* QUESTIONS Controllers */

angular.module('ga-qa')
  .controller('QuestionsIndexCtrl', ['$scope', '$http', '$location', '$auth', 'Auth', 'Question', 'GlobalAlert', function($scope, $http, $location, $auth, Auth, Question, GlobalAlert) {
    if ($auth.isAuthenticated()) {
      $scope.questions = Question.query();
    }

    $scope.pageChanged = function() {
      // $location.path('/').search({pages: $scope.questions.page});
      $http.get('/api/questions?pages=' + $scope.questions.page).then(
        function (response) {
          $scope.questions = response.data;
        },
        function (response) {
          GlobalAlert.add('warning', response.message, 2000);
        })
    }

  }])

  .controller('QuestionsSearchCtrl', ['$scope', '$http', '$rootScope', '$routeParams', function ($scope, $http, $rootScope, $routeParams) {
    $scope.questions = {};
    $rootScope.term = $routeParams.term;

    $http.get('/api/search', { params: { term: $routeParams.term } }).then(
      function (response) {
        $scope.questions.docs = response.data;
        $scope.questions.total = 1;
      },
      function (response) {
        console.log(response);
      });
  }])

  .controller('QuestionsShowCtrl', ['$scope', '$http', '$rootScope', '$routeParams', '$auth', 'Auth', 'Question', 'GlobalAlert', 'Answer', function($scope, $http, $rootScope, $routeParams, $auth, Auth, Question, GlobalAlert, Answer) {
    Question.get({ id: $routeParams.id }, function (question) {
      $scope.question = question;

      $scope.isCurrentUsersQuestion = false;
      if ($scope.question.user._id == $auth.getPayload().sub) {
        $scope.isCurrentUsersQuestion = true;
      }
      $scope.question.hasVoted = $scope.question.votes.indexOf($rootScope.currentUser._id) >= 0;
    });

    Answer.query({ questionId: $routeParams.id }, function (answers) {
      $scope.answers = answers;
      angular.forEach($scope.answers, function(answer) {
        answer.hasVoted = answer.votes.indexOf($rootScope.currentUser._id) >= 0;
      })      
    })

    $scope.voteQuestionUp = function() {
      if (!$scope.question.hasVoted) {
        $http.post('/api/questions/' + $scope.question._id + '/vote-up').then(
          function (response) {
            $scope.question.votes.push($rootScope.currentUser._id);
            $scope.question.hasVoted = true;
          },
          function (response) {
            GlobalAlert.add('warning', response.message, 2000)
          })
      }
    }

    $scope.voteAnswerUp = function(answer) {
      if (!answer.hasVoted) {
        $http.post('/api/answers/' + answer._id + '/vote-up').then(
          function (response) {
            answer.votes.push($rootScope.currentUser._id);
            answer.hasVoted = true;

            console.log(response)
          },
          function (response) {
            GlobalAlert.add('warning', response.message, 2000);
          });
      }
    }

    $scope.questions = Question.query();

    $scope.createAnswer = function() {
      var answer = new Answer($scope.answer);
      answer.$save({ questionId: $scope.question._id }).then(
        function (response) {
          console.log(response)
          $scope.answers.push(response);
          $scope.answer = {};

          // ADDING REPUTATION
          $rootScope.currentUser.rep = $rootScope.currentUser.rep + 10

          GlobalAlert.add('success', "Answer posted", 2000);
        }, 
        function (response) {
          GlobalAlert.add('warning', response.message, 2000);
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

    $http.get('/api/gif').then(
      function (response) {
        console.log(response)
        $scope.gif = response.data;
      },
      function (response) {
        console.log(response)
      })
  }])

  .controller('QuestionsEditCtrl', ['$scope', '$http', '$location', '$routeParams', '$auth', 'Auth', 'Question', 'GlobalAlert', function($scope, $http, $location, $routeParams, $auth, Auth, Question, GlobalAlert) {
    $scope.editQuestion = true;
    $scope.question = Question.get({ id: $routeParams.id });
    
    $scope.createQuestion = function() {
      var question = new Question($scope.question);
      question.$update({id: question._id}).then(
        function (response) {
          $location.path('/questions/' + response._id)

          GlobalAlert.add('success', "Question updated", 2000);
        }, 
        function (response) {
          GlobalAlert.add('warning', response.message, 2000);
        }
      );
    }
  }])

  .controller('QuestionsNewCtrl', ['$scope', '$rootScope', '$auth', 'Auth', 'Question', 'GlobalAlert', '$location', function($scope, $rootScope, $auth, Auth, Question, GlobalAlert, $location) {
    $scope.question = {};

    $scope.createQuestion = function() {
    	var question = new Question($scope.question);
    	question.$save().then(
    		function (response) {
          // ADDING REPUTATION
          $rootScope.currentUser.rep = $rootScope.currentUser.rep + 5

    			$location.path('/questions/' + response._id)

          GlobalAlert.add('success', "Question posted", 2000);
    		}, 
    		function (response) {
    			GlobalAlert.add('warning', response.message, 2000);
    		}
    	);
    }
  }]);

  