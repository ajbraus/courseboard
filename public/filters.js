/*
 * FILTERS
 */

angular.module('myApp.filters', [])
  // A simple relative timestamp filter
    .filter('relativets', function() {
      return function(value) {
        var value = new Date(value)
        var now = new Date();
        var diff = now - value;

        // ms units
        var second = 1000;
        var minute = second * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var year =  day * 365;
        var month = day * 30;

        var unit = day;
        var unitStr = 'd';
        if(diff > year) {
          unit = year;
          unitStr = 'y';
        } else if(diff > day) {
          unit = day;
          unitStr = 'd';
        } else if(diff > hour) {
          unit = hour;
          unitStr = 'h';
        } else if(diff > minute) {
          unit = minute;
          unitStr = 'm';
        } else {
          unit = second;
          unitStr = 's';
        }

        var amt = Math.ceil(diff / unit);
        return amt + '' + unitStr;
      }
    })