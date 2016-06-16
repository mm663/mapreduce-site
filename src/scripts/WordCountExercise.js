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
    "<button onclick='WordCountExercise.Common.pairDialogClickHandler()'>OK</button>" +
    "</div>";

var WordCountExercise = {
    Common: {
        pairClickHandler: function(element) {
            currentPairElement = element.toElement;

            var html = popUpHTML;

            if (element.data.type === 'key') {
                html = html.replace('{{TYPE}}', 'Key');
            } else if (element.data.type === 'values') {
                html = html.replace('{{TYPE}}', 'Values');
            } else if (element.data.type === 'id') {
                html = html.replace('{{TYPE}}', 'ID');
            }

            JSAV.utils.dialog(html, {
                width: '20%',
                dialogClass: 'exerciseDialog',
                closeText: 'Close'
            });
        },
        pairDialogClickHandler: function() {
            var inputValue = document.getElementById('pairValueInput').value;

            if(currentPairElement.innerHTML.indexOf('ID') !== -1) {
                WordCountExercise.Common.changeField(currentPairElement, 'ID', inputValue);
            } else {
                WordCountExercise.Common.changeField(currentPairElement, 'pair', inputValue);
            }

            exercise.gradeableStep();
        },
        changeField: function(currentElement, part, newValue) {
            if(part === 'pair') {
                currentElement.innerHTML = newValue;
            } else if (part === 'ID') {
                currentElement.innerHTML= currentElement.innerHTML.replace('-', newValue);
            }

            exercise.gradeableStep();
        }
    },
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

            pair1Key.click({type: 'key'}, WordCountExercise.Common.pairClickHandler);
            pair2Key.click({type: 'key'}, WordCountExercise.Common.pairClickHandler);

            pair1Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);
            pair2Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);

            pairs.push(pair1);
            pairs.push(pair2);

            return pairs;
        },
        modelSolution: function(modeljsav) {
            var answerPairs = [];

            var pair1 = Utils.JSAV.createKeyValuePair(modeljsav, '-', '-');
            var pair2 = Utils.JSAV.createKeyValuePair(modeljsav, '-', '-');

            WordCountExercise.Common.changeField(pair1.element, 'key', 'hello');
            modeljsav.umsg('Step 1: Change key of first pair to hello');
            modeljsav.step();
            modeljsav.displayInit();

            WordCountExercise.Common.changeField(pair1.element, 'values', '1');
            modeljsav.umsg('Step 2: Change value of first pair to 1');
            modeljsav.step();
            answerPairs.push(pair1);

            WordCountExercise.Common.changeField(pair2.element, 'key', 'world');
            modeljsav.umsg('Step 3: Change key of second pair to world');
            modeljsav.step();

            WordCountExercise.Common.changeField(pair2.element, 'values', '1');
            modeljsav.umsg('Step 4: Change value of second pair to 1');
            modeljsav.step();
            answerPairs.push(pair2);

            return answerPairs;
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

            av.umsg('Assume that the input set has now changed and is the one below. <br>' +
                'Specify the pair values and sort order IDs of the given pairs. <br>' +
                '<br> Input: ');

            words = ["hello", "world", "how", "are", "you", "hello"];
            sasArray = av.ds.array(words);

            //Creating Pairs
            pair1 = Utils.JSAV.createKeyValuePair(av, 'hello', '-');
            pair2 = Utils.JSAV.createKeyValuePair(av, 'world', '-');
            pair3 = Utils.JSAV.createKeyValuePair(av, 'how', '-');
            pair4 = Utils.JSAV.createKeyValuePair(av, 'are', '-');
            pair5 = Utils.JSAV.createKeyValuePair(av, 'you', '-');

            //Adding ID Containers for Sort ID
            pair1.addIDContainer("Sort", '-');
            pair2.addIDContainer("Sort", '-');
            pair3.addIDContainer("Sort", '-');
            pair4.addIDContainer("Sort", '-');
            pair5.addIDContainer("Sort", '-');

            //Get Pair Values Elements
            var pair1Values = $(pair1.element[0].getElementsByClassName('jsav-pair-values')[0]);
            var pair2Values = $(pair2.element[0].getElementsByClassName('jsav-pair-values')[0]);
            var pair3Values = $(pair3.element[0].getElementsByClassName('jsav-pair-values')[0]);
            var pair4Values = $(pair4.element[0].getElementsByClassName('jsav-pair-values')[0]);
            var pair5Values = $(pair5.element[0].getElementsByClassName('jsav-pair-values')[0]);

            pair1Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);
            pair2Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);
            pair3Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);
            pair4Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);
            pair5Values.click({type: 'values'}, WordCountExercise.Common.pairClickHandler);

            var pair1SortID = $(pair1.element[0].getElementsByClassName('idContainer')[0]);
            var pair2SortID = $(pair2.element[0].getElementsByClassName('idContainer')[0]);
            var pair3SortID = $(pair3.element[0].getElementsByClassName('idContainer')[0]);
            var pair4SortID = $(pair4.element[0].getElementsByClassName('idContainer')[0]);
            var pair5SortID = $(pair5.element[0].getElementsByClassName('idContainer')[0]);

            pair1SortID.click({type: 'id'}, WordCountExercise.Common.pairClickHandler);
            pair2SortID.click({type: 'id'}, WordCountExercise.Common.pairClickHandler);
            pair3SortID.click({type: 'id'}, WordCountExercise.Common.pairClickHandler);
            pair4SortID.click({type: 'id'}, WordCountExercise.Common.pairClickHandler);
            pair5SortID.click({type: 'id'}, WordCountExercise.Common.pairClickHandler);

            pairs.push(pair1);
            pairs.push(pair2);
            pairs.push(pair3);
            pairs.push(pair4);
            pairs.push(pair5);

            return pairs;
        },
        modelSolution: function(modeljsav) {
            var answerPairs = [];

            //Creating pairs.
            var pair1 = Utils.JSAV.createKeyValuePair(modeljsav, 'hello', '-');
            var pair2 = Utils.JSAV.createKeyValuePair(modeljsav, 'world', '-');
            var pair3 = Utils.JSAV.createKeyValuePair(modeljsav, 'how', '-');
            var pair4 = Utils.JSAV.createKeyValuePair(modeljsav, 'are', '-');
            var pair5 = Utils.JSAV.createKeyValuePair(modeljsav, 'you', '-');

            //Adding ID Containers for Sort ID
            pair1.addIDContainer("Sort", '-');
            pair2.addIDContainer("Sort", '-');
            pair3.addIDContainer("Sort", '-');
            pair4.addIDContainer("Sort", '-');
            pair5.addIDContainer("Sort", '-');

            WordCountExercise.Common.changeField(pair1.element[0].getElementsByClassName('jsav-pair-values')[0], 'pair', '1, 1');
            WordCountExercise.Common.changeField(pair1.element[0].getElementsByClassName('SortId')[0], 'ID', '2');
            modeljsav.umsg('Step 1: Change values of first pair to 1, 1 and its sort order to 2.');
            modeljsav.step();
            answerPairs.push(pair1);
            modeljsav.displayInit();

            WordCountExercise.Common.changeField(pair2.element[0].getElementsByClassName('jsav-pair-values')[0], 'pair', '1');
            WordCountExercise.Common.changeField(pair2.element[0].getElementsByClassName('SortId')[0], 'ID', '4');
            modeljsav.umsg('Step 2: Change values of second pair to 1 and its sort order to 4');
            modeljsav.step();
            answerPairs.push(pair2);

            WordCountExercise.Common.changeField(pair3.element[0].getElementsByClassName('jsav-pair-values')[0], 'pair', '1');
            WordCountExercise.Common.changeField(pair3.element[0].getElementsByClassName('SortId')[0], 'ID', '3');
            modeljsav.umsg('Step 3: Change values of third pair to 1 and its sort order to 3');
            modeljsav.step();
            answerPairs.push(pair3);

            WordCountExercise.Common.changeField(pair4.element[0].getElementsByClassName('jsav-pair-values')[0], 'pair', '1');
            WordCountExercise.Common.changeField(pair4.element[0].getElementsByClassName('SortId')[0], 'ID', '1');
            modeljsav.umsg('Step 4: Change values of fourth pair to 1 and its sort order to 1');
            modeljsav.step();
            answerPairs.push(pair4);

            WordCountExercise.Common.changeField(pair5.element[0].getElementsByClassName('jsav-pair-values')[0], 'pair', '1');
            WordCountExercise.Common.changeField(pair5.element[0].getElementsByClassName('SortId')[0], 'ID', '5');
            modeljsav.umsg('Step 5: Change values of fifth pair to 1 and its sort order to 5');
            modeljsav.step();
            answerPairs.push(pair5);

            return answerPairs;
        }
    },
    Reducer: {
        run: function() {},
        initialize: function() {},
        modelSolution: function(modeljsav) {}
    }
};