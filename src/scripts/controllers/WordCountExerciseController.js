var wordCountExerciseController = function($scope) {
    $ = jQuery;

    const MAPPER_TOTAL_SCORE = 4;
    const COMBINER_TOTAL_SCORE = 3;
    const SHUFFLE_AND_SORT_TOTAL_SCORE = 2;
    const REDUCER_TOTAL_SCORE = 3;

    $scope.pageClass = 'page-exercises-wordcount';
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
            $scope.totalScore = COMBINER_TOTAL_SCORE;
        } else if ($scope.currentExercise === 'Combiner') {
            $scope.currentExercise = 'ShuffleAndSort';
            $scope.totalScore = SHUFFLE_AND_SORT_TOTAL_SCORE;
        } else if ($scope.currentExercise === 'ShuffleAndSort') {
            $scope.currentExercise = 'Reducer';
            $scope.totalScore = REDUCER_TOTAL_SCORE;
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
        var pairKeys = document.getElementsByClassName('jsav-pair-key');
        var pairValues = document.getElementsByClassName('jsav-pair-values');

        if(pairKeys[0].innerHTML === 'hello') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[0], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[0], false);
        }

        if(pairKeys[1].innerHTML === 'world') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[1], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[1], false);
        }

        if(pairValues[0].innerHTML === '1') {
            Utils.Exercise.toggleElementCorrectness(pairValues[0], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[0], false);
        }

        if(pairValues[1].innerHTML === '1') {
            Utils.Exercise.toggleElementCorrectness(pairValues[1], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[1], false);
        }

        if(correctCounter === MAPPER_TOTAL_SCORE) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkCombinerAnswers = function() {
        var correctCounter = 0;
        var pairs = document.getElementsByClassName('jsav-pair');

        if($(pairs[0]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[0], true);
            correctCounter++;
        }

        if($(pairs[1]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[1], true);
            correctCounter++;
        }

        if($(pairs[2]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[2], false);
        }

        if($(pairs[3]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[3], false);
        }

        if($(pairs[4]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[4], false);
        }

        if($(pairs[5]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[5], false);
        }

        if($(pairs[6]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[6], true);
            correctCounter++;
        }

        if(correctCounter === COMBINER_TOTAL_SCORE) {
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

    var checkShuffleAndSortAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');

        if(pairValues[3].innerHTML === '3') {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], false);
        }

        if(pairValues[4].innerHTML === '2') {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], false);
        }

        if(correctCounter === SHUFFLE_AND_SORT_TOTAL_SCORE) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkReducerAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');

        if(pairValues[3].innerHTML === '3') {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[3], false);
        }

        if(pairValues[4].innerHTML === '1') {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], false);
        }

        if(pairValues[5].innerHTML === '2') {
            Utils.Exercise.toggleElementCorrectness(pairValues[5], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[5], false);
        }

        if(correctCounter === REDUCER_TOTAL_SCORE) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };
};

//TODO: Maybe use this score here to show score. (make currentCorrectCounter on scope)