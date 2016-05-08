/**
 * Created by matthewmicallef on 28/04/2016.
 */

var animationService;
var mapJSAVPairs = [];
var combinerJSAVPairs = [];
var partitionJSAVPairs = [];
var sasJSAVPairs = [];
var reduceJSAVPairs = [];
var jsavInstances = [];

var RelativeFrequencies = {
    setAnimationService: function(service) {
        animationService = service;
    },
    runRelativeFrequenciesMapReduce: function(
        mapperCount,
        reducerCount,
        mapperPerLine,
        userInput
    ) {
        RelativeFrequencies.reset();

        console.log("Starting Relative Frequencies MapReduce");

        var mapperInput = "";
        if(mapperPerLine) {
            mapperInput = RelativeFrequencies.processInput(userInput, true, -1);
        } else {
            mapperInput = RelativeFrequencies.processInput(userInput, false, Number(mapperCount));
        }

        //Map
        RelativeFrequencies.map(mapperInput);
        var sasInput = mapJSAVPairs;

        //Combine
        if(animationService.isUsingCombiners()) {
            RelativeFrequencies.combine(mapJSAVPairs);
            sasInput = combinerJSAVPairs;
        }

        //Partition
        if(animationService.isUsingCombiners()) {
            RelativeFrequencies.partition(combinerJSAVPairs, mapperInput.length, Number(reducerCount));
        } else {
            RelativeFrequencies.partition(mapJSAVPairs, mapperInput.length, Number(reducerCount));
        }

        sasInput = partitionJSAVPairs;

        //Shuffle and Sort
        RelativeFrequencies.shuffleAndSort(sasInput);

        //Reduce
        RelativeFrequencies.reduce(sasJSAVPairs, Number(reducerCount));

        //Update animationService with all JSAV instances
        if(jsavInstances) {
            animationService.setJSAVInstances(jsavInstances);
        }
    },
    processInput: function(input, mapperPerLine, mapperCount) {
        var newLineSplit = Utils.MapReduce.trimAllEntries(input.split("\n"));
        if(mapperPerLine) {
            return newLineSplit;
        } else {
            var splitLength = newLineSplit.length;
            if(splitLength > 1) {
                var mapperShare = Math.floor(splitLength / mapperCount);
                var mapperInput = [];
                var mapperId = -1;

                for(var i = 0; i < splitLength; i++) {
                    if((i % mapperShare) === 0 && (mapperId + 1 !== mapperCount)) {
                        mapperId++;
                    }

                    if(mapperInput[mapperId] === undefined) {
                        mapperInput[mapperId] = newLineSplit[i];
                    } else {
                        mapperInput[mapperId] += " \n " + newLineSplit[i]
                    }
                }

                return mapperInput;
            } else {
                //Otherwise split by number of words
                var slicedInput = Utils.MapReduce.getInputsByChunk(input, mapperCount);
                return Utils.MapReduce.trimAllEntries(slicedInput);
            }
        }
    },
    map: function(input) {
        for(var i = 0; i < input.length; i++) {
            var mapperId = Utils.JSAV.createHtmlElement("Mapper", i + 1);
            var av = new JSAV(mapperId);

            av.label("This mapper runs on a single node.");

            //Step 1
            av.label("Initial mapper Input:");
            var wordsInChunk = Utils.MapReduce.trimAllEntries(input[i].split("\n"));
            var wordsArr = [];
            for(var a = 0; a < wordsInChunk.length; a++) {
                var temp = wordsInChunk[a].split(" ");
                for(var b = 0; b < temp.length; b++) {
                    wordsArr.push(temp[b]);
                }
            }
            var initMapArray = av.ds.array(wordsArr);
            initMapArray.layout();
            av.displayInit();
            av.step();

            //Step 2
            av.label("For every word, two key-value pairs are created.");
            av.label("One as (w, *) and the other with the proper co-occurrence pair as shown below:");

            var highlightCounter = 0;
            for(var j = 0; j < wordsInChunk.length; j++) {
                var currentLine = wordsInChunk[j];
                var splitLine = currentLine.split(" ");

                for(var k = 0; k < splitLine.length; k++) {
                    if(highlightCounter > 0) {
                        initMapArray.unhighlight(highlightCounter - 1);
                    }

                    initMapArray.highlight(highlightCounter);
                    highlightCounter++;

                    var neighbors = RelativeFrequencies.getNeighbors(currentLine, splitLine[k]);

                    if(neighbors.length > 0) {
                        for(var l = 0; l < neighbors.length; l++) {
                            var pair1 = Utils.JSAV.createKeyValuePair(av, "(" + splitLine[k] + ", *)", 1);
                            pair1.mapperId = (i + 1);
                            pair1.addIDContainer("Mapper", pair1.mapperId);
                            mapJSAVPairs.push(pair1);
                            pair1.layout();

                            var pair2 = Utils.JSAV.createKeyValuePair(av, "(" + splitLine[k] + ", " + neighbors[l] +  ")", 1);
                            pair2.mapperId = (i + 1);
                            pair2.addIDContainer("Mapper", pair2.mapperId);
                            mapJSAVPairs.push(pair2);
                            pair2.layout();

                            av.step();
                        }
                    } else {
                        av.label(splitLine[k] + " does not have any neighbors.");
                        av.step();
                    }
                }
            }

            jsavInstances.push(av);
            av.recorded();
        }
    },
    getNeighbors: function(line, word) {
        //Neighbors of a word are all words on the same line.
        var neighbors = [];
        var lineSplit = line.split(" ");
        var wordInstanceCounter = 0;
        for(var i = 0; i < lineSplit.length; i++) {
            if(lineSplit[i] !== word) {
                neighbors.push(lineSplit[i]);
            } else {
                if(wordInstanceCounter === 1) {
                    neighbors.push(lineSplit[i]);
                }

                wordInstanceCounter++;
            }
        }

        return neighbors;
    },
    combine: function(input) {
        //Pairs of the form (w, u) & (u, w) will be combined
        var mapperCount = jsavInstances.length;

        for(var i = 0; i < mapperCount; i++) {
            var combinerId = Utils.JSAV.createHtmlElement("Combiner", i + 1);
            var av = new JSAV(combinerId);

            av.label("A combiner is created for every mapper. Swapped pairs will be combined.");

            //Step 1
            var filteredInput = input.filter(function(mapJSAVPairs) {
                return mapJSAVPairs.mapperId == (i + 1);
            });

            var processedKeys = [];
            var pairs = [];
            for(var j = 0; j < filteredInput.length; j++) {
                var index = RelativeFrequencies.arrayContainsPair(processedKeys, filteredInput[j]._pairData.key);
                if((processedKeys.length > 0) && index > -1) {
                    pairs[index].values = String(Number(pairs[index].values) + 1);
                } else {
                    processedKeys.push(filteredInput[j]._pairData.key);
                    pairs.push({
                        key: filteredInput[j]._pairData.key,
                        values: filteredInput[j]._pairData.values,
                        mapperId: (i + 1)
                    });
                }
            }

            for (var j = 0; j < pairs.length; j++) {
                var pair = Utils.JSAV.createKeyValuePair(av, pairs[j].key, pairs[j].values);
                pair.mapperId = pairs[j].mapperId;
                pair.combinerId = (i + 1);
                pair.addIDContainer("Mapper", (i + 1));
                combinerJSAVPairs.push(pair);
                pair.layout();
                av.step();
            }

            jsavInstances.push(av);
            av.recorded();
        }
    },
    partition: function(input, numberOfMappers, numberOfReducers) {
        /*
         The number of partitions (not partitioners) is equal to the number of reducers.
         Hash value of the key, module the number of reducers
         */

        partitionJSAVPairs = input;
        var key = "";
        var hashedString = "";
        var reducerId = -1;

        for(var i = 0; i < partitionJSAVPairs.length; i++) {
            key = partitionJSAVPairs[i]._pairData.key;
            hashedString = Utils.MapReduce.hashCode(RelativeFrequencies.getPartOfKey(key, 1));
            reducerId = Math.abs(hashedString % numberOfReducers) + 1;
            partitionJSAVPairs[i].reducerId = reducerId;
        }

        for(var i = 0; i < numberOfMappers; i++) {
            var partitionerId = Utils.JSAV.createHtmlElement("Partitioner", i + 1);
            var av = new JSAV(partitionerId);

            //Step 1
            if(!animationService.isUsingCombiners()) {
                av.label("Every partitioner receives data from every mapper. Using data from Mapper " + (i + 1));
            } else {
                av.label("Every partitioner receives data from every combiner. Using data from Combiner " + (i + 1));
            }

            av.step();

            av.label("Key is hashed and the reducer identity obtained.");
            for(var j = 0; j < partitionJSAVPairs.length; j++) {
                if(partitionJSAVPairs[j].mapperId === (i + 1)) {
                    //av.label("Key " + partitionJSAVPairs[j]._pairData.key + " assigned to reducer : " + partitionJSAVPairs[j].reducerId);
                    var pair = Utils.JSAV.createKeyValuePair(av, partitionJSAVPairs[j]._pairData.key, partitionJSAVPairs[j]._pairData.values);
                    pair.addIDContainer("Reducer", partitionJSAVPairs[j].reducerId);
                    pair.addIDContainer("Mapper", partitionJSAVPairs[j].mapperId);
                    pair.layout();
                    av.step();
                }
            }

            if(animationService.isShowingPartitioners()) {
                jsavInstances.push(av);
                av.recorded();
            }
        }
    },
    shuffleAndSort: function(input) {
        var sasArray = [];

        for(var i = 0; i < input.length; i++) {
            var key = input[i]._pairData.key;
            var values = input[i]._pairData.values;
            var keyPos = Utils.MapReduce.lookupArrayByKey(sasArray, key);

            if(keyPos > -1) {
                sasArray[keyPos].values += ", " + values;
            } else {
                sasArray.push({
                    key: key,
                    values: values,
                    mapperId: input[i].mapperId,
                    reducerId: input[i].reducerId
                });
            }
        }

        sasArray = Utils.MapReduce.sortByKey(sasArray, "key");

        var sasId = Utils.JSAV.createHtmlElement("ShuffleAndSort", "");
        var av = new JSAV(sasId);

        //Step 1
        av.label("The shuffle and sort gathers all mapper outputs.");
        av.step();

        //Step 2
        av.label("The values from all pairs are all placed together in one pair.");

        for(var i = 0; i < sasArray.length; i++) {
            var pair = Utils.JSAV.createKeyValuePair(av, sasArray[i].key, sasArray[i].values);
            pair.mapperId = sasArray[i].mapperId;
            pair.reducerId = sasArray[i].reducerId;
            pair.addIDContainer("Reducer", sasArray[i].reducerId);
            pair.addIDContainer("Mapper", sasArray[i].mapperId);
            sasJSAVPairs.push(pair);
            pair.layout();
            av.step();
        }

        jsavInstances.push(av);
        av.recorded();
    },
    reduce: function(input, numberOfReducers) {
        //TODO: Continue from here. Check all reducer logic.
        var pairCount = input.length;

        for(var i = 0; i < numberOfReducers; i++) {
            var reducerId = Utils.JSAV.createHtmlElement("Reducer", (i + 1));
            var av = new JSAV(reducerId);

            //Step 1
            av.label("Reducer receives data and counts the values to obtain a total word count.");
            av.step();

            var marginal = 0;
            for(j = 0; j < pairCount; j++) {
                if(input[j].reducerId === (i + 1)) {
                    var pairValuesTotal = Utils.MapReduce.getPairValuesTotal(input[j]._pairData.values);
                    var x = RelativeFrequencies.getPartOfKey(input[j]._pairData.key, 2);
                    if(x === "*") {
                        marginal = pairValuesTotal;
                    } else {
                        var pair = Utils.JSAV.createKeyValuePair(av,
                            input[j]._pairData.key,
                            (pairValuesTotal + "/" +  marginal + " => " + (pairValuesTotal / marginal).toFixed(2))
                        );
                        pair.addIDContainer("Reducer", input[j].reducerId);
                        pair.layout();
                        av.step();
                    }
                }
            }

            jsavInstances.push(av);
            av.recorded();
        }
    },
    arrayContainsPair: function(array, key) {
        for (var i = 0; i < array.length; i++) {
            if(RelativeFrequencies.getKeyEquality(array[i], key)) {
                return i;
            }
        }

        return -1;
    },
    getPartOfKey: function(key, part) {
        var keySplit = key.split(',');
        if(part === 1) {
            return keySplit[0].split('(')[1].trim();
        } else if (part === 2) {
            return keySplit[1].split(')')[0].trim();
        }
    },
    getKeyEquality: function(key1, key2) {
        var word1 = RelativeFrequencies.getPartOfKey(key1, 1);
        var word2 = RelativeFrequencies.getPartOfKey(key1, 2);

        var keyPart1 = RelativeFrequencies.getPartOfKey(key2, 1);
        var keyPart2 = RelativeFrequencies.getPartOfKey(key2, 2);

        if(word1 === keyPart1 && word2 === keyPart2) {
            return true;
        }
    },
    reset: function() {
        mapJSAVPairs = [];
        combinerJSAVPairs = [];
        partitionJSAVPairs = [];
        sasJSAVPairs = [];
        reduceJSAVPairs = [];
        jsavInstances = [];
    }
};