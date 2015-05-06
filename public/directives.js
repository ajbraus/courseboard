/*
 * DIRECTIVES
 */

'use strict';

angular.module('myApp.directives', ['myApp.services'])
  
  .directive('currentTime', function($timeout, $filter) {
    return {
      restrict: 'E',
      replace: true,
      template: '<span class="current-time">{{currentTime}}</span>',
      scope: {
        localtz: '=',
      },
      link: function($scope, $element, $attr) {
        $timeout(function checkTime() {
          if($scope.localtz) {
            $scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
          }
          $timeout(checkTime, 500);
        });
      }
    }
   })
  
  .directive('clickOnce', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var replacementText = attrs.clickOnce;

        element.bind('click', function() {
          $timeout(function() {
            if (replacementText) {
              element.html(replacementText);
            }
            element.attr('disabled', true);
            $timeout(function() {
              element.attr('disabled', false);
              element.html("Try Again");
            }, 2000);
          }, 0);
        });
      }
    };
  }])
  
  .directive('capitalize', function() {
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
  })

  .directive("fileread", [function () {
    return {
      scope: {
          fileread: "="
      },
      link: function (scope, element, attributes) {
        element.bind("change", function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileread = loadEvent.target.result;
            });
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  }])

  .directive('currency', function () {
    return {
      require: 'ngModel',
      link: function(elem, $scope, attrs, ngModel){
        ngModel.$formatters.push(function(val){
          if (val) {
            return '$' + val
          }
        });
        ngModel.$parsers.push(function(val){
          if (val) {
            return val.replace(/^\$/, '')
          }
        });
      }
    }
  })
  
  .directive('isFocused', function($timeout) {
    return {
      scope: { trigger: '@isFocused' },
      link: function(scope, element) {
        scope.$watch('trigger', function(value) {
          if(value === "true") {
            $timeout(function() {
              element[0].focus();

              element.on('blur', function() {
                element[0].focus();
              });
            });
          }

        });
      }
    };
  })

  .directive('titleCase', function(){ //TODO DOES NOT WORK http://stackoverflow.com/questions/14419651/angularjs-filters-on-ng-model-in-an-input
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
  });
