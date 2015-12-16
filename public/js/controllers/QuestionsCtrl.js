'use strict';

/* QUESTIONS Controllers */

angular.module('basic-auth')
  .controller('QuestionsIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'Question', function($scope, $http, $auth, Auth, Question) {
    $scope.questions = Question.query();
  }])

  .controller('QuestionsShowCtrl', ['$scope', '$http', '$routeParams', '$auth', 'Auth', 'Question', function($scope, $http, $routeParams, $auth, Auth, Question) {
    $scope.question = Question.get({ id: $routeParams.id });
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

  