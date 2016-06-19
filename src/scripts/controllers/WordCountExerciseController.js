var wordCountExerciseController = function($scope) {
    $scope.pageClass = 'page-exercises-wordcount';
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

        if(correctCounter === 4) {
            $scope.toggleCurrentExerciseCorrectness();
        }
    };

    var checkCombinerAnswers = function() {
        var correctCounter = 0;
        var pairs = document.getElementsByClassName('jsav-pair');

        if(pairs[0].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[0], false);
            correctCounter--;
        }

        if(pairs[1].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[1], true);
            correctCounter++;
        }

        if(pairs[2].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[2], true);
            correctCounter++;
        }

        if(pairs[3].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[3], false);
            correctCounter--;
        }

        if(pairs[4].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[4], false);
            correctCounter--;
        }

        if(pairs[5].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[5], false);
            correctCounter--;
        }

        if(pairs[6].className.indexOf('jsav-pair-highlight') !== -1) {
            Utils.Exercise.toggleElementCorrectness(pairs[6], true);
            correctCounter++;
        }

        if(correctCounter === 3) {
            $scope.toggleCurrentExerciseCorrectness();
        } else {
            for (var i = 0; i < pairs.length; i++) {
                pairs[i].className = pairs[i].className.replace(' jsav-pair-highlight', '');
            }
        }
    };

    var checkShuffleAndSortAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');
        var pairIDContainers = document.getElementsByClassName('idContainer');

        for(var i = 0; i < pairValues.length; i++) {
            if(i !== 0 && pairValues[i].innerHTML === '1') {
                Utils.Exercise.toggleElementCorrectness(pairValues[i], true);
                correctCounter++;
            } else if(i === 0 &&
                (pairValues[i].innerHTML === '1, 1' ||
                 pairValues[i].innerHTML === '1,1')) {
                Utils.Exercise.toggleElementCorrectness(pairValues[i], true);
                correctCounter++;
            } else {
                Utils.Exercise.toggleElementCorrectness(pairValues[i], false);
            }
        }

        var sortAnswerArray = [2, 4, 3, 1, 5];

        for(var i = 0; i < pairIDContainers.length; i++) {
            if(pairIDContainers[i].innerHTML.indexOf(sortAnswerArray[i]) !== -1) {
                Utils.Exercise.toggleElementCorrectness(pairIDContainers[i], true);
                correctCounter++;
            } else {
                Utils.Exercise.toggleElementCorrectness(pairIDContainers[i], false);
            }
        }

        if(correctCounter === 10) {
            $scope.toggleCurrentExerciseCorrectness();
        }
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

        if(correctCounter === 3) {
            $scope.toggleCurrentExerciseCorrectness();
        }
    };
};

//TODO: Maybe use this score here to show score. (make currentCorrectCounter on scope)