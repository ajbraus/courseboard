
'use strict';

/* Services */

angular.module('basic-auth.services', [])
  .factory('Question', ['$resource', '$window', function ($resource, $window) {
    return $resource($window.location.origin + '/api/questions/:id', { id: '@id' }, {
      update: { method: 'PUT' }
    });
  }])

  .factory('Answer', ['$resource', '$window', function ($resource, $window) {
    return $resource($window.location.origin + '/api/questions/:questionId/answers/:id', { questionid: '@questionId', id: '@id' }, {
      update: { method: 'PUT' }
    });
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