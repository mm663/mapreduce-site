/**
 * Created by matthewmicallef on 17/04/2016.
 */

var animationService;
var mapJSAVPairs = [];
var combinerJSAVPairs = [];
var partitionJSAVPairs = [];
var sasJSAVPairs = [];
var reduceJSAVPairs = [];
var jsavInstances = [];

var Mean = {
    setAnimationService: function(service) {
        animationService = service;
    },
    runMeanMapReduce: function(
        mapperCount,
        reducerCount,
        mapperPerLine,
        userInput
    ) {

        Mean.reset();

        console.log("Starting Mean MapReduce");

        //Get Mapper Input by splitting number of pairs among number of mappers.
        var mapperInput = Mean.processInput(userInput, Number(mapperCount));

        //Map
        var mapJSAVPairs = Mean.map(mapperInput, Number(mapperCount));
        var sasInput = mapJSAVPairs;

        //Combine
        var combinerJSAVPairs;
        if(animationService.isUsingCombiners()) {
            combinerJSAVPairs = Mean.combine(mapJSAVPairs);
            sasInput = combinerJSAVPairs;
        }

        //Partition
        var partitionJSAVPairs;
        if(animationService.isUsingCombiners()) {
            partitionJSAVPairs = Mean.partition(combinerJSAVPairs, Number(mapperCount), Number(reducerCount));
        } else {
            partitionJSAVPairs = Mean.partition(mapJSAVPairs, Number(mapperCount), Number(reducerCount));
        }

        sasInput = partitionJSAVPairs;

        //Shuffle and Sort
        var sasJSAVPairs = Mean.shuffleAndSort(sasInput);

        //Reduce
        var reduceJSAVPairs = Mean.reduce(sasJSAVPairs, Number(reducerCount));

        //Update animationService with all JSAV Instances.
        if(jsavInstances) {
            animationService.setJSAVInstances(jsavInstances);
        }
    },
    processInput: function(input, mapperCount) {
        var mapperShare = Math.floor(input.length / mapperCount);
        var mapperId = 0;
        var mapperInput = input;

        for (var i = 0; i < input.length; i++) {
            if((i % mapperShare) === 0) {
                mapperId++;
            }

            if(mapperId > mapperCount) {
                mapperId = mapperCount;
            }

            mapperInput[i].mapperId = mapperId;
        }

        return mapperInput;
    },
    map: function(input, mapperCount) {
        var arrCounter = 0;

        for(var i = 0; i < mapperCount; i++) {
            var mapperId = Utils.JSAV.createHtmlElement("Mapper", i + 1);
            var av = new JSAV(mapperId);

            av.label("This mapper runs on a single node.");

            //Step 1
            av.label("Mapper Input:");

            var arr = [];
            var arrCounter = 0;
            for (var j = 0; j < input.length; j++) {
                if(input[j].mapperId === i + 1) {
                    arr[arrCounter] = "K: " + input[j].key + " V: " + input[j].values;
                    arrCounter++;
                }
            }
            var jsavArr = av.ds.array(arr);
            jsavArr.layout();
            av.displayInit();
            av.step();

            //Step 2
            av.label("For every pair, a new key-value pair is created. " +
                     "The below list is the mapper output.");

            for(var j = 0; j < input.length; j++) {
                if(input[j].mapperId === i + 1) {
                    if(arrCounter > 0) {
                        jsavArr.unhighlight(j - 1);
                    }

                    jsavArr.highlight(j);
                    arrCounter++;
                    var key = input[j].key;
                    var values = input[j].values;
                    var pair = Utils.JSAV.createKeyValuePair(av, key, "pair(" + values + ", 1)");
                    pair.mapperId = input[j].mapperId;
                    pair.addIDContainer("Mapper", pair.mapperId);
                    mapJSAVPairs.push(pair);
                    pair.layout();

                    av.step();
                }
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
            var filteredInput = input.filter(function(mapJSAVPairs) {
                return mapJSAVPairs.mapperId == (i + 1);
            });

            var processedKeys = [];
            var pairs = [];
            for (var j = 0; j < filteredInput.length; j++) {
                if((processedKeys.length > 0) && (processedKeys.indexOf(filteredInput[j]._pairData.key) > -1)) {
                    for(var k = 0; k < pairs.length; k++) {
                        if(pairs[k].key === filteredInput[j]._pairData.key) {
                            var pairSum = Number(Mean.getSumFromPair(pairs[k].values));
                            var pairCount = Number(Mean.getCountFromPair(pairs[k].values));
                            pairSum += Number(Mean.getSumFromPair(filteredInput[j]._pairData.values));
                            pairCount += Number(Mean.getCountFromPair(filteredInput[j]._pairData.values));
                            pairs[k].values = "pair(" + pairSum + ", " + pairCount + ")";
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
                pair.addIDContainer("Mapper", pair.mapperId);
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
    reduce: function(input, numberOfReducers) {
        var pairCount = input.length;

        for(var i = 0; i < numberOfReducers; i++) {
            var reducerId = Utils.JSAV.createHtmlElement("Reducer", (i + 1));
            var av = new JSAV(reducerId);

            //Step 1
            av.label("Reducer receives data and counts the values to obtain a total word count.");
            av.step();

            for(j = 0; j < pairCount; j++) {
                if(input[j].reducerId === (i + 1)) {
                    var valuesAverage = Mean.getPairValuesAverage(input[j]._pairData.values);
                    var pair = Utils.JSAV.createKeyValuePair(av, input[j]._pairData.key, valuesAverage);
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
    getSumFromPair: function(pair) {
        //Input: pair(2, 1)
        var content = pair.split('(');
        content = content[1].split(',');
        return content[0].trim();
    },
    getCountFromPair: function(pair) {
        //Input: pair(2, 1)
        var content = pair.split('(');
        content = content[1].split(',');
        return content[1].trim().substr(0, 1);
    },
    getPairValuesAverage: function(values) {
        var valuesSplit = values.split(', p');
        var sum = 0;
        var count = 0;

        for(var i = 0; i < valuesSplit.length; i++) {
            sum += Number(Mean.getSumFromPair(valuesSplit[i]));
            count += Number(Mean.getCountFromPair(valuesSplit[i]));
        }

        var average = (sum / count).toFixed(2);
        return average;
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