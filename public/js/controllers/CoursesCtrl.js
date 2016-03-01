'use strict';

/* COURSES Controller */

angular.module('courseboard')
    .controller('CoursesCtrl', ['$scope', '$rootScope', '$location', '$auth', '$http', 'GlobalAlert', function ($scope, $rootScope, $location, $auth, $http, GlobalAlert) {
        $scope.courses_info = ['Name', 'Instructor', 'Description', 'Duration'];

        $scoe.courses = [
            { name: 'Data Structures', instructor: 'Alan Davis', description: 'write badass data structures algorithms while I try to trick you with syntax errors', duration: '10 weeks' },
            { name: 'iOS', instructor: 'Benji Encz', description: 'make cool iOS apps', duration: '12 weeks' },
            { name: 'Ruby on Rails', instructor: 'Andy Tiffany', description: 'make cool web apps', duration: '8 weeks' }
        ]
    }
