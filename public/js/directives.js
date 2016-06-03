'use strict';

/* DIRECTIVES */

angular.module('courseboard.directives', ['courseboard.services'])

  .directive('dateDropdown', [function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/date-dropdown.html',
      scope: {
        month: "=",
        day: "=",
        year: "="
      }
    }
  }])

  .directive('capitalize', [function() {
     return {
       require: 'ngModel',
       link: function(scope, element, attrs, modelCtrl) {
          var capitalize = function(inputValue) {
             if(inputValue == undefined) inputValue = '';
             var capitalized = inputValue.toUpperCase();
             if(capitalized !== inputValue) {
                modelCtrl.$setViewValue(capitalized);
                modelCtrl.$render();
              }         
              return capitalized;
           }
           modelCtrl.$parsers.push(capitalize);
           capitalize(scope[attrs.ngModel]);  // capitalize initial value
       }
     };
  }])

  .directive('titleCase', [function(){ //TODO DOES NOT WORK http://stackoverflow.com/questions/14419651/angularjs-filters-on-ng-model-in-an-input
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function (inputValue) {
          if (inputValue) {
            var words = inputValue.split(' ');
            for (var i = 0; i < words.length; i++) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
            var transformedInput = words.join(' ');
            if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
            }         

            return transformedInput;     
          }    
        });
      }
    };
  }])
  