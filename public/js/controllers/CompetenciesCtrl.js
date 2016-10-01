'use strict';

/* COMPETENCE Controllers */

angular.module('courseboard')
  .controller('CompetenciesIndexCtrl', ['$scope', '$http', '$auth', 'Auth', 'GlobalAlert', function($scope, $http, $auth, Auth, GlobalAlert) {
    $http.get('/api/students').then(function (response) { 
      // students full names & _id
      $scope.userList = response.data;
    })
  }])

  .controller('CompetenciesShowCtrl', ['$scope', '$http', '$auth', '$routeParams', 'Auth', 'GlobalAlert', function($scope, $http, $auth, $routeParams, Auth, GlobalAlert) {
    $http.get('/api/users/' + $routeParams.id).then(function (response) {
      $scope.user = response.data;

      $scope.competencies = [
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
        { name: 'JavaScript, Backend', level:0 , kind: 'elective'},
        { name: 'JavaScript, Frontend', level:0 , kind: 'elective'},
        { name: 'Ruby & Ruby on Rails', level:0 , kind: 'elective'},
        { name: 'Python & Flask', level:0 , kind: 'elective'},
        { name: 'Devices/Embedded Systems', level:0 , kind: 'elective'},
        { name: 'Machine Learning', level:0 , kind: 'elective'},
        { name: 'Data Science & Visualization', level:0 , kind: 'elective'},
        { name: 'SQL Databases', level:0 , kind: 'elective'},
        { name: 'NoSQL Databases', level:0 , kind: 'elective'},
        { name: 'Deployment & Dev Ops', level:0 , kind: 'elective'},
        { name: 'TDD', level:0 , kind: 'elective'},
        { name: 'API Design', level:0 , kind: 'elective'},
        { name: 'Graphic Design', level:0, kind: 'elective' }
      ]

      $scope.competencies = _.sortBy($scope.competencies, ['name']);
      // for each of $scope.competencies
      _.each($scope.competencies, function (competency) { 
        _.each($scope.user.competencies, function (userCompetency) {
          // if their names match, replace it
          if (competency.name == userCompetency.name) {
            var index = _.findIndex($scope.competencies, competency);
            $scope.competencies[index] = userCompetency;
          }
        })
      });
    })

    $scope.updateCompetency = function(competencyName, level, kind) {
      if (level >= 0 && level <= 5) {
        $http.put('/api/users/' + $scope.user._id + '/competencies', { name: competencyName, level: level, kind: kind }).then(function (response) {
          var competency = _.find($scope.competencies, { 'name': competencyName });
          competency.level = level;
        })        
      }
    }
  }]);
