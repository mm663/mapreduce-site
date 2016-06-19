var meanExerciseController = function() {
    $scope.pageClass = 'page-exercises-mean';
    $scope.currentExercise = 'Mapper';
    $scope.currentExerciseCorrect = false;

    $scope.checkAnswers = function() {
        if($scope.currentExercise === 'Mapper') {
            checkMapperAnswers();
        } else if ($scope.currentExercise === 'Combiner') {
            checkCombinerAnswers();
        } else if ($scope.currentExercise === 'ShuffleAndSort') {
            checkShuffleAndSortAnswers();
        } else if ($scope.currentExercise === 'Reducer') {
            checkReducerAnswers();
        }
    };

    $scope.loadNextExercise = function() {
        if($scope.currentExercise === 'Mapper') {
            $scope.currentExercise = 'Combiner';
        } else if ($scope.currentExercise === 'Combiner') {
            $scope.currentExercise = 'ShuffleAndSort'
        } else if ($scope.currentExercise === 'ShuffleAndSort') {
            $scope.currentExercise = 'Reducer';
        }

        $scope.currentExerciseCorrect = false;
    };

    $scope.toggleCurrentExerciseCorrectness = function() {
        $scope.currentExerciseCorrect = !$scope.currentExerciseCorrect;
    };

    var checkMapperAnswers = function() {

    };

    var checkCombinerAnswers = function() {

    };

    var checkShuffleAndSortAnswers = function() {

    };

    var checkReducerAnswers = function() {

    };
};