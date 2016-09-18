'use strict';

/* COMPETENCE Controllers */

angular.module('courseboard')
  .controller('CompetencesIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/students').then(function (response) { 
      // students full names & _id
      $scope.userList = response.data;
    })
  }])

  .controller('CompetencesShowCtrl', ['$scope', '$http', '$auth', '$routeParams', 'Auth', 'GlobalAlert', function($scope, $http, $auth, $routeParams, Auth, GlobalAlert) {
    $http.get('/api/users/' + $routeParams.id).then(function (response) {
      $scope.user = response.data;

      $scope.competences = [
        // CHARACTER
        { name: 'Professionalism', level:0, kind: 'character'},
        { name: 'Teamwork', level:0, kind: 'character'},
        { name: 'Energy & Agility', level:0, kind: 'character'},
        { name: 'Leadership', level:0, kind: 'character'},
        { name: 'Emotional Intelligence', level:0, kind: 'character'},

        // CORE
        { name: 'Communication', level:0, kind: 'core' },
        { name: 'Productivity', level:0, kind: 'core' },
        { name: 'Product Management', level:0, kind: 'core' },
        { name: 'Code Craftsmanship', level:0, kind: 'core' },
        { name: 'Computer Science Fundamentals', level:0, kind: 'core' },
        { name: 'Product Development & Entrepreneurship', level:0, kind: 'core' },

        // ELECTIVE
        { name: 'iOS', level:0 , kind: 'elective'},
        { name: 'JavaScript, Node, npm, ExpressJS', level:0 , kind: 'elective'},
        { name: 'JavaScript, Front End Frameworks', level:0 , kind: 'elective'},
        { name: 'Ruby & Ruby on Rails (backend)', level:0 , kind: 'elective'},
        { name: 'Python & Flask', level:0 , kind: 'elective'},
        { name: 'Devices/Embedded Systems', level:0 , kind: 'elective'},
        { name: 'Machine Learning', level:0 , kind: 'elective'},
        { name: 'Data Science & Visualization', level:0 , kind: 'elective'},
        { name: 'SQL Databases', level:0 , kind: 'elective'},
        { name: 'NoSQL Databases', level:0 , kind: 'elective'},
        { name: 'Deployment & Dev Ops', level:0 , kind: 'elective'},
        { name: 'TDD', level:0 , kind: 'elective'},
        { name: 'Writing', level:0 , kind: 'elective'},
        { name: 'Public Speaking & Pitching', level:0 , kind: 'elective'},
        { name: 'Growth and Marketing', level:0 , kind: 'elective'},
        { name: 'Internet and Networking Fundamentals', level:0 , kind: 'elective'},
        { name: 'API Design', level:0 , kind: 'elective'},
        { name: 'Graphic Design', level:0, kind: 'elective' }
      ]

      $scope.competences = _.sortBy($scope.competences, ['name']);
      // for each of $scope.competences
      _.each($scope.competences, function (competence) { 
        _.each($scope.user.competences, function (userCompetence) {
          // if their names match, replace it
          if (competence.name == userCompetence.name) {
            var index = _.findIndex($scope.competences, competence);
            $scope.competences[index] = userCompetence;
          }
        })
      });
    })

    $scope.updateCompetence = function(competenceName, level, kind) {
      if (level >= 0 && level <= 5) {
        $http.put('/api/users/' + $scope.user._id + '/competences', { name: competenceName, level: level, kind: kind }).then(function (response) {
          var competence = _.find($scope.competences, { 'name': competenceName });
          competence.level = level;
        })        
      }
    }
  }]);
