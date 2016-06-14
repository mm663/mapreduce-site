/**
 * Created by matthewmicallef on 09/06/2016.
 */

var av,
    words = [],
    pairs = [],
    exercise,
    mapperJSAVArray,
    sasArray,
    currentPairElement,
    pair1,
    pair2,
    pair3,
    pair4,
    pair5,
    pair6;

const popUpHTML = "<div style='text-align: center;'>" +
    "<div style='margin-top: 5px'>Insert {{TYPE}}</div>" +
    "<input id='pairValueInput' type='text' style='margin-top: 5px'>" +
    "<button onclick='WordCountExercise.Mapper.pairDialogClickHandler()'>OK</button>" +
    "</div>";

var WordCountExercise = {
    Mapper: {
        run: function() {
            Utils.JSAV.createExerciseContainer("Mapper");
            av = new JSAV("mapReduceExercise");
            av.recorded();

            exercise = av.exercise(
                WordCountExercise.Mapper.modelSolution,
                WordCountExercise.Mapper.initialize,
                {},
                {feedback: "atend"}
            );
            exercise.reset();
        },
        initialize: function() {
            if (mapperJSAVArray || pair1 || pair2) {
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

            //Get Pair Key Elements
            var pair1Key = $(pair1.element[0].getElementsByClassName('jsav-pair-key')[0]);
            var pair2Key = $(pair2.element[0].getElementsByClassName('jsav-pair-key')[0]);

            //Get Pair Values Elements
            var pair1Values = $(pair1.element[0].getElementsByClassName('jsav-pair-values')[0]);
            var pair2Values = $(pair2.element[0].getElementsByClassName('jsav-pair-values')[0]);

            pair1Key.click({type: 'key'}, WordCountExercise.Mapper.pairClickHandler);
            pair2Key.click({type: 'key'}, WordCountExercise.Mapper.pairClickHandler);

            pair1Values.click({type: 'values'}, WordCountExercise.Mapper.pairClickHandler);
            pair2Values.click({type: 'values'}, WordCountExercise.Mapper.pairClickHandler);

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
            modeljsav.umsg('Step 1: Change key of first pair to hello');
            modeljsav.step();

            WordCountExercise.changePairField(pair1.element, 'values', '1');
            modeljsav.umsg('Step 2: Change value of first pair to 1');
            modeljsav.step();

            answerPairs.push(pair1);

            WordCountExercise.changePairField(pair2.element, 'key', 'world');
            modeljsav.umsg('Step 3: Change key of second pair to world');
            modeljsav.step();

            WordCountExercise.changePairField(pair2.element, 'values', '1');
            modeljsav.umsg('Step 4: Change value of second pair to 1');
            modeljsav.step();

            answerPairs.push(pair2);

            return answerPairs;
        },
        pairClickHandler: function(element) {
            currentPairElement = element.toElement;

            var html = popUpHTML;

            if (element.data.type === 'key') {
                html = html.replace('{{TYPE}}', 'Key');
            } else if (element.data.type === 'values') {
                html = html.replace('{{TYPE}}', 'Values');
            }

            JSAV.utils.dialog(html, {
                width: '20%',
                dialogClass: 'exerciseDialog',
                closeText: 'Close'
            });
        },
        pairDialogClickHandler: function() {
            var inputValue = document.getElementById('pairValueInput').value;
            currentPairElement.innerHTML = inputValue;
            exercise.gradeableStep();
        }
    },
    ShuffleAndSort: {
        run: function() {
            Utils.JSAV.createExerciseContainer("Reducer");
            av = new JSAV("mapReduceExercise");
            av.recorded();

            exercise = av.exercise(
                WordCountExercise.ShuffleAndSort.modelSolution,
                WordCountExercise.ShuffleAndSort.initialize,
                {},
                {feedback: "atend"}
            );
            exercise.reset();
        },
        initialize: function() {
            if(sasArray || pair1 || pair2) {
                sasArray.clear();
                pair1.clear();
                pair2.clear();
                pair3.clear();
                pair4.clear();
                pair5.clear();
                pair6.clear();
            }

            av.umsg('Assume that the input set has now changed and is the one below (notice MapperID). <br>' +
                'Specify the values and reducer IDs of the given pairs. <br>' +
                'Input: ');

            //TODO: Normal array with words here.
            words = ["hello", "world", "how", "are", "you", "hello"];
            sasArray = av.ds.array(words);

            pair1 = Utils.JSAV.createKeyValuePair(av, 'hello', '1');
            pair2 = Utils.JSAV.createKeyValuePair(av, 'world', '1');
            pair3 = Utils.JSAV.createKeyValuePair(av, 'how', '1');
            pair4 = Utils.JSAV.createKeyValuePair(av, 'are', '1');
            pair5 = Utils.JSAV.createKeyValuePair(av, 'you', '1');
            pair6 = Utils.JSAV.createKeyValuePair(av, 'hello', '1');
            //TODO: Add Reducer IDs to highlight.

            pairs.push(pair1);
            pairs.push(pair2);

            return pairs;
        },
        modelSolution: function(modeljsav) {}
    },
    Reducer: {
        run: function() {},
        initialize: function() {},
        modelSolution: function(modeljsav) {}
    }
};