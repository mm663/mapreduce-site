/**
 * Created by matthewmicallef on 09/06/2016.
 */

var av,
    words = [],
    pairs = [],
    exercise,
    mapperJSAVArray,
    mapperhighlightedCount = 0,
    currentPairElement,
    pair1,
    pair2;

var WordCountExercise = {
    run: function() {
        Utils.JSAV.createExerciseContainer("Mapper");
        av = new JSAV("mapReduceExercise");
        av.recorded();

        exercise = av.exercise(this.modelSolution, this.initialize, {}, {feedback: "atend"});
        exercise.reset();
    },
    initialize: function() {
        if(mapperJSAVArray) {
            mapperhighlightedCount = 0;
            mapperJSAVArray.clear();
            pairs = [];
            pair1.clear();
            pair2.clear();
        }

        av.umsg("Step 1: Consider the below list of words as input to the Mapper." +
            "</br> Click on the empty pairs below and change their values accordingly, to reflect those created by the mapper?");

        words = ["hello", "world"];
        mapperJSAVArray = av.ds.array(words);

        pair1 = Utils.JSAV.createKeyValuePair(av, '-', '-');
        pair2 = Utils.JSAV.createKeyValuePair(av, '-', '-');
        pair1.click(WordCountExercise.pairClickHandler);
        pair2.click(WordCountExercise.pairClickHandler);
        pairs.push(pair1);
        pairs.push(pair2);

        return pairs;
    },
    modelSolution: function(modeljsav) {
        var answerPairs = [];

        var pair1 = Utils.JSAV.createKeyValuePair(modeljsav, '-', '-');
        pair1.click(WordCountExercise.pairClickHandler);

        var pair2 = Utils.JSAV.createKeyValuePair(modeljsav, '-', '-');
        pair2.click(WordCountExercise.pairClickHandler);

        modeljsav.displayInit();

        WordCountExercise.changePairField(pair1.element, 'key', 'hello');
        modeljsav.umsg('Change key of first pair to hello');
        modeljsav.step();

        WordCountExercise.changePairField(pair1.element, 'values', '1');
        modeljsav.umsg('Change value of first pair to 1');
        modeljsav.step();

        answerPairs.push(pair1);

        WordCountExercise.changePairField(pair2.element, 'key', 'world');
        modeljsav.umsg('Change key of second pair to world');
        modeljsav.step();

        WordCountExercise.changePairField(pair2.element, 'values', '1');
        modeljsav.umsg('Change value of second pair to 1');
        modeljsav.step();

        answerPairs.push(pair2);

        return answerPairs;
    },
    pairClickHandler: function(element) {
        currentPairElement = element;

        var html =
            "<div style='text-align: center;'>" +
                "<div style='margin-top: 5px'>Insert Value</div>" +
                "<input type='radio' name='pairChoice' value='key'> Key <br>" +
                "<input type='radio' name='pairChoice' value='values'> Value <br>" +
                "<input id='pairValueInput' type='text' placeholder='Insert Value Here' style='margin-top: 5px'>" +
                "<button onclick='WordCountExercise.pairDialogClickHandler()'>OK</button>" +
            "</div>";

        JSAV.utils.dialog(html, {
            width: '20%',
            dialogClass: 'exerciseDialog',
            closeText: 'Close'
        });
    },
    pairDialogClickHandler: function() {
        var pairChoice = $('input[name=pairChoice]:checked').val()
        var inputValue = document.getElementById('pairValueInput').value;

        if(pairChoice === 'key') {
            WordCountExercise.changePairField(currentPairElement, 'key', inputValue);
        } else if(pairChoice === 'values') {
            WordCountExercise.changePairField(currentPairElement, 'values', inputValue);
        }
    },
    changePairField: function(currentElement, part, newValue) {
        var element;

        if(part === 'key') {
            element = currentElement[0].getElementsByClassName('jsav-pair-key');
        } else if (part === 'values') {
            element = currentElement[0].getElementsByClassName('jsav-pair-values');
        }

        element[0].innerHTML = newValue;
        exercise.gradeableStep();
    }
};