/**
 * Created by matthewmicallef on 21/02/2016.
 */

var animationService;
var mapJSAVPairs = [];
var combinerJSAVPairs = [];
var partitionJSAVPairs = [];
var sasJSAVPairs = [];
var reduceJSAVPairs = [];
var jsavInstances = [];

var WordCount = {
    setAnimationService: function(service) {
        animationService = service;
    },
    runWordCountMapReduce: function(
        mapperCount,
        reducerCount,
        mapperPerLine,
        userInput
    ) {

        WordCount.reset();

        console.log("Starting Word Count MapReduce");

        var mapperInput = "";
        if(mapperPerLine) {
            mapperInput = WordCount.processInput(userInput, true, -1);
        } else {
            mapperInput = WordCount.processInput(userInput, false, Number(mapperCount));
        }

        //Map
        var mapJSAVPairs = WordCount.map(mapperInput);
        var sasInput = mapJSAVPairs;

        //Combine
        var combinerJSAVPairs;
        if(animationService.isUsingCombiners()) {
            combinerJSAVPairs = WordCount.combine(mapJSAVPairs);
            sasInput = combinerJSAVPairs;
        }

        //Partition
        var partitionJSAVPairs;
        if(animationService.isUsingCombiners()) {
            partitionJSAVPairs = WordCount.partition(combinerJSAVPairs, mapperInput.length, Number(reducerCount));
        } else {
            partitionJSAVPairs = WordCount.partition(mapJSAVPairs, mapperInput.length, Number(reducerCount));
        }

        sasInput = partitionJSAVPairs;

        //Shuffle and Sort
        var sasJSAVPairs = WordCount.shuffleAndSort(sasInput);

        //Reduce
        var reduceJSAVPairs = WordCount.reduce(sasJSAVPairs, Number(reducerCount));

        //Update animationService with all JSAV Instances.
        if(jsavInstances) {
            animationService.setJSAVInstances(jsavInstances);
        }
    },
    processInput: function(input, mapperPerLine, mapperCount) {
        if(mapperPerLine) {
            var newLineSplit = input.split("\n");
            return WordCount.trimAllEntries(newLineSplit);
        } else {
            var newLineSplit = WordCount.trimAllEntries(input.split("\n"));
            var splitLength = newLineSplit.length;
            if(splitLength > 1) {
                var mapperShare = Math.floor(splitLength / mapperCount);
                var mapperInput = [];
                var mapperId = -1;

                for(var i = 0; i < newLineSplit.length; i++) {
                    if((i % mapperShare) === 0) {
                        mapperId++;
                    }

                    if(mapperInput[mapperId] === undefined) {
                        mapperInput[mapperId] = newLineSplit[i];
                    } else {
                        mapperInput[mapperId] += " " + newLineSplit[i]
                    }
                }

                return mapperInput;
            } else {
                //Otherwise split by number of words
                var slicedInput = Utils.MapReduce.getInputsByChunk(input, mapperCount);
                return WordCount.trimAllEntries(slicedInput);
            }
        }
    },
    trimAllEntries: function(arrayToTrim) {
        for(var i = 0; i < arrayToTrim.length; i++) {
            arrayToTrim[i] = arrayToTrim[i].trim();
        }

        return arrayToTrim;
    },
    map: function(input) {
        for(var i = 0; i < input.length; i++) {
            var mapperId = Utils.JSAV.createHtmlElement("Mapper", i + 1);
            var av = new JSAV(mapperId);

            av.label("This mapper runs on a single node.");

            //Step 1
            av.label("Initial Mapper Input:");
            var wordsInChunk = input[i].split(" ");
            var initMapArray = av.ds.array(wordsInChunk);
            initMapArray.layout();
            av.displayInit();
            av.step();

            //Step 2
            av.label("For every word, a new key-value pair is created.");
            av.label("The below list is the mapper output.");

            for(var j = 0; j < wordsInChunk.length; j++) {
                if(j > 0) {
                    initMapArray.unhighlight(j - 1);
                }

                initMapArray.highlight(j);
                var key = wordsInChunk[j].replace(/(\r\n|\n|\r)/gm,"");
                var pair = Utils.JSAV.createKeyValuePair(av, key, 1);
                pair.mapperId = (i + 1); //Identifying which pair belongs to which mapper.
                pair.addIDContainer("Mapper", pair.mapperId);

                mapJSAVPairs.push(pair);
                pair.layout();

                av.step();
            }

            jsavInstances.push(av);
            av.recorded();
        }

        return mapJSAVPairs;
    },
    combine: function(input) {
        var mapperCount = jsavInstances.length;

        for(var i = 0; i < mapperCount; i++) {
            var combinerId = Utils.JSAV.createHtmlElement("Combiner", i + 1);
            var av = new JSAV(combinerId);
            av.label("A combiner is created for every mapper to perform local aggregation.");

            //Step 1
            av.label("This is done by performing word count within every mapper");

            var filteredInput = input.filter(function(mapJSAVPairs) {
                return mapJSAVPairs.mapperId == (i + 1);
            });

            var processedKeys = [];
            var pairs = [];
            for (var j = 0; j < filteredInput.length; j++) {
                if((processedKeys.length > 0) && (processedKeys.indexOf(filteredInput[j]._pairData.key) > -1)) {
                    for(var k = 0; k < pairs.length; k++) {
                        if(pairs[k].key === filteredInput[j]._pairData.key) {
                            var combinerValues = Number(pairs[k].values);
                            combinerValues += 1;
                            pairs[k].values = String(combinerValues);
                        }
                    }
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

        return combinerJSAVPairs;
    },
    partition: function(input, numberOfMappers, numberOfReducers) {
        /*
        The number of partitions (not partitioners) is equal to the number of reducers.
        Hash value of the key, module the number of reducers
         */

        var pairs = input;
        var key = "";
        var hashedString = "";
        var reducerId = -1;

        for(var i = 0; i < pairs.length; i++) {
            key = pairs[i]._pairData.key;
            hashedString = Utils.MapReduce.hashCode(key);
            reducerId = Math.abs(hashedString % numberOfReducers) + 1;
            pairs[i].reducerId = reducerId;
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
            for(var j = 0; j < pairs.length; j++) {
                if(pairs[j].mapperId === (i + 1)) {
                    av.label("Key " + pairs[j]._pairData.key + " assigned to reducer : " + pairs[j].reducerId);
                    var pair = Utils.JSAV.createKeyValuePair(av, pairs[j]._pairData.key, pairs[j]._pairData.values);
                    pair.addIDContainer("Reducer", pairs[j].reducerId);
                    pair.addIDContainer("Mapper", pairs[j].mapperId);
                    pair.layout();
                    av.step();
                }
            }

            if(animationService.isShowingPartitioners()) {
                jsavInstances.push(av);
                av.recorded();
            }
        }

        return pairs;
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

        return sasJSAVPairs;
    },
    reduce: function(input, numberOfReducers){
        var pairCount = input.length;

        for(var i = 0; i < numberOfReducers; i++) {
            var reducerId = Utils.JSAV.createHtmlElement("Reducer", (i + 1));
            var av = new JSAV(reducerId);

            //Step 1
            av.label("Reducer receives data and counts the values to obtain a total word count.");
            av.step();

            for(j = 0; j < pairCount; j++) {
                if(input[j].reducerId === (i + 1)) {
                    var valuesTotal = WordCount.getPairValuesTotal(input[j]._pairData.values);
                    var pair = Utils.JSAV.createKeyValuePair(av, input[j]._pairData.key, valuesTotal);
                    pair.addIDContainer("Reducer", input[j].reducerId);
                    pair.addIDContainer("Mapper", input[j].mapperId);
                    reduceJSAVPairs.push(pair);
                    pair.layout();
                    av.step();
                }
            }

            jsavInstances.push(av);
            av.recorded();
        }

        return reduceJSAVPairs;
    },
    getPairValuesTotal: function(values) {
        if(typeof(values) === "number") {
            return values;
        } else if(typeof(values) === "string") {
            var splitValues = values.split(",");
            var valueCount = 0;
            for(var i = 0; i < splitValues.length; i++) {
                valueCount += Number(splitValues[i]);
            }
            return valueCount;
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