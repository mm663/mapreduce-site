var meanExerciseController = function($scope) {
    const MAPPER_TOTAL_SCORE = 3;
    const COMBINER_TOTAL_SCORE = 2;
    const SHUFFLE_AND_SORT_TOTAL_SCORE = 2;
    const REDUCER_TOTAL_SCORE = 2;

    $scope.pageClass = 'page-exercises-mean';
    $scope.currentExercise = 'Mapper';
    $scope.currentExerciseCorrect = false;
    $scope.totalScore = MAPPER_TOTAL_SCORE;
    $scope.currentScore = 0;

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
        $scope.currentScore = 0;
    };

    $scope.toggleCurrentExerciseCorrectness = function() {
        $scope.currentExerciseCorrect = !$scope.currentExerciseCorrect;
    };

    $scope.loadExercise = function(exerciseName) {
        if(exerciseName === 'Mapper') {
            $scope.totalScore = MAPPER_TOTAL_SCORE;
        } else if (exerciseName === 'Combiner') {
            $scope.totalScore = COMBINER_TOTAL_SCORE;
        } else if (exerciseName === 'ShuffleAndSort') {
            $scope.totalScore = SHUFFLE_AND_SORT_TOTAL_SCORE;
        } else if (exerciseName === 'Reducer') {
            $scope.totalScore = REDUCER_TOTAL_SCORE;
        }

        $scope.currentExercise =  exerciseName;
        $scope.currentScore = 0;
    };

    var checkMapperAnswers = function() {
        var correctCounter = 0;
        var pairs = document.getElementsByClassName('jsav-pair');

        if($(pairs[0]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[0], true);
            correctCounter++;
        }

        if($(pairs[1]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[1], false);
        }

        if($(pairs[2]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[2], false);
        }

        if($(pairs[3]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[3], true);
            correctCounter++;
        }

        if($(pairs[4]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[4], false);
        }

        if($(pairs[5]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[5], true);
            correctCounter++;
        }

        if(correctCounter === 3) {
            $scope.toggleCurrentExerciseCorrectness();
        } else {
            for (var i = 0; i < pairs.length; i++) {
                if($(pairs[i]).hasClass('incorrect')) {
                    $(pairs[i]).toggleClass('jsav-pair-highlight');
                }
            }
        }

        $scope.currentScore = correctCounter;
    };

    var checkCombinerAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');

        if(pairValues[3].innerHTML === 'pair(5, 2)' ||
           pairValues[3].innerHTML === 'pair(5,2)') {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], false);
        }

        if(pairValues[4].innerHTML === 'pair(2, 1)' ||
           pairValues[4].innerHTML === 'pair(2,1)') {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], false);
        }

        if(correctCounter === 2) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkShuffleAndSortAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');

        if(pairValues[3].innerHTML === 'pair(1, 1), pair(2, 1)' ||
           pairValues[3].innerHTML === 'pair(1, 1) pair(2, 1)') {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], false);
        }

        if(pairValues[4].innerHTML === 'pair(1, 1)' ||
            pairValues[4].innerHTML === 'pair(1,1)') {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], false);
        }

        if(correctCounter === 2) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkReducerAnswers = function() {
        var correctCounter = 0;
        var pairs = document.getElementsByClassName('jsav-pair');

        if($(pairs[2]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[2], false);
        }

        if($(pairs[3]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[3], true);
            correctCounter++;
        }

        if($(pairs[4]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[4], true);
            correctCounter++;
        }

        if($(pairs[5]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[5], false);
        }

        if(correctCounter === 2) {
            $scope.toggleCurrentExerciseCorrectness();
        } else {
            for (var i = 0; i < pairs.length; i++) {
                if($(pairs[i]).hasClass('incorrect')) {
                    $(pairs[i]).toggleClass('jsav-pair-highlight');
                }
            }
        }

        $scope.currentScore = correctCounter;
    };
};