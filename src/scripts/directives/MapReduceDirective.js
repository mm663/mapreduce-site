/**
 * Created by matthewmicallef on 16/04/2016.
 */

var mapReduceDirective = function() {
    return {
        restrict: 'E',
        scope: { },
        replace: true,
        templateUrl: "templates/MapReduce.html",
        controller: mapReduceController
    };
};