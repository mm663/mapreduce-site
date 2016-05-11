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
        WordCount.map(mapperInput);
        var sasInput = mapJSAVPairs;

        //Combine
        if(animationService.isUsingCombiners()) {
            WordCount.combine(mapJSAVPairs);
            sasInput = combinerJSAVPairs;
        }

        //Partition
        if(animationService.isUsingCombiners()) {
            WordCount.partition(combinerJSAVPairs, mapperInput.length, Number(reducerCount));
        } else {
            WordCount.partition(mapJSAVPairs, mapperInput.length, Number(reducerCount));
        }

        sasInput = partitionJSAVPairs;

        //Shuffle and Sort
        WordCount.shuffleAndSort(sasInput);

        //Reduce
        WordCount.reduce(sasJSAVPairs, Number(reducerCount));

        //Update animationService with all JSAV instances.
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
                        mapperInput[mapperId] += " " + newLineSplit[i]
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
            av.label("Mapper Input:");
            var wordsInChunk = input[i].split(" ");
            var initMapArray = av.ds.array(wordsInChunk);
            initMapArray.layout();
            av.displayInit();
            av.step();

            //Step 2
            av.label("For every word, a new key-value pair is created.");

            var code = av.code(["for all term t in ", " Emit(term t, count 1)"]);

            av.label("Mapper Output:");
            for(var j = 0; j < wordsInChunk.length; j++) {
                if(j > 0) {
                    initMapArray.unhighlight(j - 1);
                }

                initMapArray.highlight(j);
                code.setCurrentLine(1);
                av.step();

                var key = wordsInChunk[j].replace(/(\r\n|\n|\r)/gm,"");
                var pair = Utils.JSAV.createKeyValuePair(av, key, 1);
                pair.mapperId = (i + 1); //Identifying which pair belongs to which mapper.
                pair.addIDContainer("Mapper", pair.mapperId);

                mapJSAVPairs.push(pair);
                pair.layout();

                code.setCurrentLine(2);
                av.step();
            }

            jsavInstances.push(av);
            av.recorded();
        }
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
            hashedString = Utils.MapReduce.hashCode(key);
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
    reduce: function(input, numberOfReducers){
        var pairCount = input.length;

        for(var i = 0; i < numberOfReducers; i++) {
            var reducerId = Utils.JSAV.createHtmlElement("Reducer", (i + 1));
            var av = new JSAV(reducerId);
            var code = av.code(["for all count c in counts [c1, c2, ...]", " sum = sum + c", "Emit(term t, count c)"]);

            //Step 1
            av.label("Reducer receives data and counts the values to obtain a total word count.");
            av.step();

            for(j = 0; j < pairCount; j++) {
                if(input[j].reducerId === (i + 1)) {
                    code.setCurrentLine(1);
                    av.step();

                    //Code highlighting
                    var tempSplit = String(input[j]._pairData.values).split(",");
                    var umsg = "Key: " + input[j]._pairData.key + " => Count: ";
                    var first = true;
                    for(var a = 0; a < tempSplit.length; a++) {
                        if(first) {
                            umsg += tempSplit[a];
                            first = false;
                        } else {
                            umsg += " + " + tempSplit[a];
                        }

                        av.umsg(umsg);
                        code.setCurrentLine(2);
                        av.step();
                    }

                    //Actual Reducer Output
                    var valuesTotal = Utils.MapReduce.getPairValuesTotal(input[j]._pairData.values);
                    var pair = Utils.JSAV.createKeyValuePair(av, input[j]._pairData.key, valuesTotal);
                    pair.addIDContainer("Reducer", input[j].reducerId);
                    reduceJSAVPairs.push(pair);
                    pair.layout();

                    code.setCurrentLine(3);

                    av.step();
                }
            }

            jsavInstances.push(av);
            av.recorded();
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