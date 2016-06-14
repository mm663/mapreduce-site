/**
 * Created by matthewmicallef on 09/06/2016.
 */

var mapReduceExerciseController = function($scope) {
    if($scope.name === "WordCount") {
        if($scope.type === "Mapper") {
            WordCountExercise.Mapper.run();
        } else if ($scope.type === "ShuffleAndSort") {
            WordCountExercise.ShuffleAndSort.run();
        }
    }
};