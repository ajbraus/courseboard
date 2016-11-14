
'use strict';

/* Services */

angular.module('courseboard.services', [])
  // .factory('Answer', ['$resource', '$window', function ($resource, $window) {
  //   return $resource($window.location.origin + '/api/questions/:questionId/answers/:id', { questionid: '@questionId', id: '@id' }, {
  //     update: { method: 'PUT' }
  //   });
  // }])

  .factory('Course', ['$http', 'GlobalAlert', function ($http, GlobalAlert) {
    return {
      publish: function(course) {
        $http.put('/api/courses/' + course._id + '/publish').then(
          function (response) {
            course.publishedAt = new Date();
            GlobalAlert.add('success', "Course published!", 3000);
          },
          function (response) {
            GlobalAlert.add('warning', response.data.message, 3000);
          }
        );
      },

      unpublish: function(course) {
        $http.put('/api/courses/' + course._id + '/unpublish').then(
          function (response) {
            course.publishedAt = null;
            GlobalAlert.add('success', "Course unpublished!", 3000);
          },
          function (response) {
            GlobalAlert.add('warning', response.data.message, 3000);
          }
        );
      }
    }
  }])
  .factory('Competencies', [function () {
    return {
      all: [
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
        { name: 'CS Fundamentals', level:0, kind: 'core' },
        { name: 'Product Dev', level:0, kind: 'core' },

        // ELECTIVE
        { name: 'iOS', level:0 , kind: 'elective'},
        { name: 'Backend JS', level:0 , kind: 'elective'},
        { name: 'Frontend JS', level:0 , kind: 'elective'},
        { name: 'HTML/CSS/JS', level:0 , kind: 'elective'},
        { name: 'API Design', level:0 , kind: 'elective'},
        { name: 'Ruby on Rails', level:0 , kind: 'elective'},
        { name: 'Flask', level:0 , kind: 'elective'},
        { name: 'Python', level:0 , kind: 'elective'},
        { name: 'Devices/IoT', level:0 , kind: 'elective'},
        { name: 'ML & AI', level:0 , kind: 'elective'},
        { name: 'Data Science', level:0 , kind: 'elective'},
        { name: 'SQL DB', level:0 , kind: 'elective'},
        { name: 'NoSQL DB', level:0 , kind: 'elective'},
        { name: 'Dev Ops', level:0 , kind: 'elective'},
        { name: 'TDD', level:0 , kind: 'elective'},
        { name: 'UI/UX', level:0, kind: 'elective' },
        { name: 'Writing', level:0, kind: 'elective' }
      ]
    }
  }])

  .factory('Auth', ['$auth', function ($auth) {
    return {
      currentUser: function() {
        var user = $auth.getPayload();
        var currentUser = {
          _id: user.sub,
          email: user.email,
          picture: user.picture,
          displayName: user.displayName
        }
        return currentUser;
      }
    }
  }])

  .factory('GlobalAlert', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    var alertService;
    $rootScope.globalAlerts = [];
    return alertService = {
      add: function(type, msg, timeout) {
        $rootScope.globalAlerts = [];
        $rootScope.globalAlerts.push({
          type: type,
          msg: msg,
          close: function() {
            return alertService.closeAlert(this);
          }
        });
        if (timeout) {
          $timeout(function(){
            alertService.closeAlert(this);
          }, timeout);
        }
      },
      closeAlert: function(alert) {
        return this.closeAlertIdx($rootScope.globalAlerts.indexOf(alert));
      },
      closeAlertIdx: function(index) {
        return $rootScope.globalAlerts.splice(index, 1);
      },
      clear: function(){
        $rootScope.globalAlerts = [];
      }
    };
  }]);
