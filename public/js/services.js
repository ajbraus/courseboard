
'use strict';

/* Services */

angular.module('courseboard.services', [])
  // .factory('Answer', ['$resource', '$window', function ($resource, $window) {
  //   return $resource($window.location.origin + '/api/questions/:questionId/answers/:id', { questionid: '@questionId', id: '@id' }, {
  //     update: { method: 'PUT' }
  //   });
  // }])

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
        { name: 'UI/UX Design', level:0, kind: 'elective' }
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