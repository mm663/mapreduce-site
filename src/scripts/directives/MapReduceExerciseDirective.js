/**
 * Created by matthewmicallef on 09/06/2016.
 */

var mapReduceExerciseDirective = function() {
    return {
        restrict: 'E',
        scope: {
            name: '@name',
            type: '@type'
        },
        replace: true,
        templateUrl: "templates/MapReduceExercise.html",
        controller: mapReduceExerciseController
    };
};