/**
 * Created by matthewmicallef on 25/06/2016.
 */

var relativeFrequenciesExerciseController = function($scope) {
    const MAPPER_TOTAL_SCORE = 4;
    const COMBINER_TOTAL_SCORE = 4;
    const SHUFFLE_AND_SORT_TOTAL_SCORE = 6;
    const REDUCER_TOTAL_SCORE = 4;

    $scope.pageClass = 'page-exercises-relativefrequencies';
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

        if(pairKeys[0].innerHTML === '(hello, *)' ||
           pairKeys[0].innerHTML === '(hello,*)') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[0], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[0], false);
        }

        if(pairKeys[1].innerHTML === '(hello, world)' ||
            pairKeys[1].innerHTML === '(hello,world)') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[1], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[1], false);
        }

        if(pairKeys[2].innerHTML === '(world, *)' ||
            pairKeys[2].innerHTML === '(world,*)') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[2], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[2], false);
        }

        if(pairKeys[3].innerHTML === '(world, hello)' ||
            pairKeys[3].innerHTML === '(world,hello)') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[3], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[3], false);
        }

        if(correctCounter === 4) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkCombinerAnswers = function() {
        var correctCounter = 0;
        var pairKeys = document.getElementsByClassName('jsav-pair-key');
        var pairValues = document.getElementsByClassName('jsav-pair-values');

        if(pairKeys[4].innerHTML === '(hello, *)' ||
            pairKeys[4].innerHTML === '(hello, *)') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[4], false);
        }

        if(pairKeys[5].innerHTML === '(hello, hello)' ||
           pairKeys[5].innerHTML === '(hello,hello)') {
            Utils.Exercise.toggleElementCorrectness(pairKeys[5], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairKeys[5], false);
        }

        if(pairValues[4].innerHTML === '2') {
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

        if(correctCounter === 4) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkShuffleAndSortAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');
        var pairIDContainers = document.getElementsByClassName('idContainer');

        if(pairValues[4].innerHTML === '1') {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[4], false);
        }

        if(pairValues[5].innerHTML === '2, 3' ||
           pairValues[5].innerHTML === '2,3') {
            Utils.Exercise.toggleElementCorrectness(pairValues[5], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[5], false);
        }

        if(pairValues[6].innerHTML === '2') {
            Utils.Exercise.toggleElementCorrectness(pairValues[6], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairValues[6], false);
        }

        if(pairIDContainers[4].innerHTML.indexOf(2) !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairIDContainers[4], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairIDContainers[4], false);
        }

        if(pairIDContainers[5].innerHTML.indexOf(1) !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairIDContainers[5], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairIDContainers[5], false);
        }

        if(pairIDContainers[6].innerHTML.indexOf(3) !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairIDContainers[6], true);
            correctCounter++;
        } else {
            Utils.Exercise.toggleElementCorrectness(pairIDContainers[6], false);
        }

        if(correctCounter === 6) {
            $scope.toggleCurrentExerciseCorrectness();
        }

        $scope.currentScore = correctCounter;
    };

    var checkReducerAnswers = function() {
        var correctCounter = 0;
        var pairs = document.getElementsByClassName('jsav-pair');

        if($(pairs[4]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[4], true);
            correctCounter++;
        }

        if($(pairs[5]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[5], true);
            correctCounter++;
        }

        if($(pairs[6]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[6], false);
        }

        if($(pairs[7]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[7], true);
            correctCounter++;
        }

        if($(pairs[8]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[8], true);
            correctCounter++;
        }

        if($(pairs[9]).hasClass('jsav-pair-highlight')) {
            Utils.Exercise.toggleElementCorrectness(pairs[9], false);
        }

        if(correctCounter === 4) {
            $scope.toggleCurrentExerciseCorrectness();
        } else {
            for (var i = 0; i < pairs.length; i++) {
                if($(pairs[i]).hasClass(' incorrect')) {
                    $(pairs[i]).toggleClass('jsav-pair-highlight');
                }
            }
        }

        $scope.currentScore = correctCounter;
    };
};