var wordCountExerciseController = function($scope) {
    $scope.pageClass = 'page-exercises-wordcount';
    $scope.currentExercise = 'ShuffleAndSort';
    $scope.currentExerciseCorrect = false;

    $scope.checkAnswers = function() {
      if($scope.currentExercise === 'Mapper') {
          checkMapperAnswers();
      }
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

    var toggleElementCorrectness = function(element, correct) {
        if(correct) {
            if(element.className.indexOf(' incorrect') !== -1) {
                element.className = element.className.replace('incorrect', 'correct');
            } else {
                element.className += ' correct';
            }
        } else if(!correct) {
            if(element.className.indexOf(' correct') !== -1) {
                element.className = element.className.replace('correct', 'incorrect');
            } else {
                element.className += ' incorrect';
            }
        }
    };
};