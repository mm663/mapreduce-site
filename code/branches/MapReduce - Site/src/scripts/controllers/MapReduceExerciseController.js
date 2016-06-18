/**
 * Created by matthewmicallef on 09/06/2016.
 */

var mapReduceExerciseController = function($scope, $timeout) {
    if($scope.name === "WordCount") {
        if($scope.type === "Mapper") {
            $timeout(function() {
                WordCountExercise.Mapper.run();
            }, 100);
        } else if ($scope.type === 'Combiner') {
            $timeout(function() {
                WordCountExercise.Combiner.run();
            }, 100);
        } else if ($scope.type === "ShuffleAndSort") {
            $timeout(function() {
                WordCountExercise.ShuffleAndSort.run();
            }, 100);
        } else if ($scope.type === "Reducer") {
            $timeout(function() {
                WordCountExercise.Reducer.run();
            }, 100);
        }
    }
};