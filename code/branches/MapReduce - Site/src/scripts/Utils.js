/**
 * Created by matthewmicallef on 21/02/2016.
 */

const JSAV_COMPONENT_TEMPLATE =
    "<div id='{{ID}}'>" +
        "<h4>{{NAME}}</h4>" +
        "<div class='jsavcontrols'></div>" +
        "<span class='jsavcounter'></span>" +
        "<p class='jsavoutput jsavline'></p>" +
        "<div class='jsavcanvas'></div>" +
    "</div>";

var Utils = {
    MapReduce: {
        getInputsByChunk: function(input, mapperCount) {
            const SPACE = " ";

            if(input) {
                var chunksArray = [];
                var counter = 0;

                //Fixme: assuming only spaces between words
                var inputSplit = input.split(" ");
                var mapperSize = Math.floor(inputSplit.length / mapperCount);

                for(var i = 0; i < inputSplit.length; i++) {
                    if(i !== 0 && ((i % mapperSize) === 0)) {
                        counter++;
                    }

                    if(counter === mapperCount) {
                        counter -= 1;
                    }

                    if (chunksArray[counter] === undefined) {
                        chunksArray[counter] = inputSplit[i];
                    } else {
                        chunksArray[counter] += SPACE + inputSplit[i];
                    }
                }

                return chunksArray;
            }

            return null;
        },
        hashCode: function(value) {
            var hash = 0;

            if (value.length == 0)
                return hash;

            for (var i = 0; i < value.length; i++) {
                var char = value.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }

            return Math.abs(hash);
        },
        sortByKey: function(array, key) {
            return array.sort(function(a, b) {
                //Sorts array by key
                var x = a[key];
                var y = b[key];

                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        lookupArrayByKey: function(array, key) {
            for(var i = 0, len = array.length; i < len; i++) {
                if(array[i].key === key) {
                    return i; //Returns position of found key.
                }
            }
            return -1; //Key not found
        },
        reset: function() {
            document.getElementById("mapperContainer").innerHTML = "";
            document.getElementById("combinerContainer").innerHTML = "";
            document.getElementById("partitionerContainer").innerHTML = "";
            document.getElementById("sasContainer").innerHTML = "";
            document.getElementById("reducerContainer").innerHTML = "";
        }
    },
    JSAV: {
        createHtmlElement: function(type, count) {
            var container;

            if(type === "Mapper") {
                container = document.getElementById("mapperContainer");
            } else if(type === "Reducer") {
                container = document.getElementById("reducerContainer");
            } else if (type === "ShuffleAndSort") {
                container = document.getElementById("sasContainer");
            } else if (type === "Combiner") {
                container = document.getElementById("combinerContainer");
            } else if (type === "Partitioner") {
                container = document.getElementById("partitionerContainer");
            }

            if(container) {
                var id = type + count;
                var name = type + " " + count;

                var idDiv = document.createElement("div");
                idDiv.id = id;

                var h4 = document.createElement("h4");
                h4.innerHTML = name;
                idDiv.appendChild(h4);

                var settingsAnchor = document.createElement("a");
                settingsAnchor.className = "jsavsettings";
                settingsAnchor.href = "#";
                settingsAnchor.innerHTML = "Settings";
                idDiv.appendChild(settingsAnchor);

                var jsavControlsDiv = document.createElement("div");
                jsavControlsDiv.className = "jsavcontrols";
                idDiv.appendChild(jsavControlsDiv);

                var span = document.createElement("span");
                span.className = "jsavcounter";
                idDiv.appendChild(span);

                var p = document.createElement("p");
                p.className = "jsavoutput jsavline";
                idDiv.appendChild(p);

                var jsavCanvasDiv = document.createElement("div");
                jsavCanvasDiv.className = "jsavcanvas";
                idDiv.appendChild(jsavCanvasDiv);

                container.appendChild(idDiv);
            }

            return id;
        },
        createKeyValuePair: function(av, key, values) {
            var pair = {key: key, values: values};

            return av.ds.keyValuePair(pair);
        }
    }
};