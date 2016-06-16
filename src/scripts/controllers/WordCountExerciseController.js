var wordCountExerciseController = function($scope) {
    $scope.pageClass = 'page-exercises-wordcount';
    $scope.currentExercise = 'Mapper';
    $scope.currentExerciseCorrect = false;

    $scope.checkAnswers = function() {
      if($scope.currentExercise === 'Mapper') {
          checkMapperAnswers();
      } else if ($scope.currentExercise === 'ShuffleAndSort') {
          checkShuffleAndSortAnswers();
      }
    };

    $scope.loadNextExercise = function() {
        if($scope.currentExercise === 'Mapper') {
            $scope.currentExercise = 'ShuffleAndSort';
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
            toggleElementCorrectness(pairKeys[0], true);
            correctCounter++;
        } else {
            toggleElementCorrectness(pairKeys[0], false);
        }

        if(pairKeys[1].innerHTML === 'world') {
            toggleElementCorrectness(pairKeys[1], true);
            correctCounter++;
        } else {
            toggleElementCorrectness(pairKeys[1], false);
        }

        if(pairValues[0].innerHTML === '1') {
            toggleElementCorrectness(pairValues[0], true);
            correctCounter++;
        } else {
            toggleElementCorrectness(pairValues[0], false);
        }

        if(pairValues[1].innerHTML === '1') {
            toggleElementCorrectness(pairValues[1], true);
            correctCounter++;
        } else {
            toggleElementCorrectness(pairValues[1], false);
        }

        if(correctCounter === 4) {
            $scope.toggleCurrentExerciseCorrectness();
        }
    };

    var checkShuffleAndSortAnswers = function() {
        var correctCounter = 0;
        var pairValues = document.getElementsByClassName('jsav-pair-values');
        var pairIDContainers = document.getElementsByClassName('idContainer');

        for(var i = 0; i < pairValues.length; i++) {
            if(i !== 0 && pairValues[i].innerHTML === '1') {
                toggleElementCorrectness(pairValues[i], true);
                correctCounter++;
            } else if(i === 0 &&
                (pairValues[i].innerHTML === '1, 1' ||
                 pairValues[i].innerHTML === '1,1')) {
                toggleElementCorrectness(pairValues[i], true);
                correctCounter++;
            } else {
                toggleElementCorrectness(pairValues[i], false);
            }
        }

        var sortAnswerArray = [2, 4, 3, 1, 5];

        for(var i = 0; i < pairIDContainers.length; i++) {
            if(pairIDContainers[i].innerHTML.indexOf(sortAnswerArray[i]) !== -1) {
                toggleElementCorrectness(pairIDContainers[i], true);
                correctCounter++;
            } else {
                toggleElementCorrectness(pairIDContainers[i], false);
            }
        }

        if(correctCounter === 10) {
            $scope.toggleCurrentExerciseCorrectness();
        }
    };

    var toggleElementCorrectness = function(element, correct) {
        if(correct) {
            if(element.className.indexOf(' incorrect') !== -1) {
                element.className = element.className.replace('incorrect', 'correct');
            } else if(element.className.indexOf(' incorrect') === -1) {
                element.className += ' correct';
            }
        } else if(!correct) {
            if(element.className.indexOf(' correct') !== -1) {
                element.className = element.className.replace('correct', 'incorrect');
            } else if(element.className.indexOf(' incorrect') === -1) {
                element.className += ' incorrect';
            }
        }
    };
};

//TODO: Maybe use this score here to show score. (make currentCorrectCounter on scope)