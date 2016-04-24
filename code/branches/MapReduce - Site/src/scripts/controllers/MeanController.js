/**
 * Created by matthewmicallef on 17/04/2016.
 */

var meanController = function($scope, animationService) {
    $scope.inputList = [];
    $scope.userInput = false;
    $scope.pageClass = 'page-mean';

    animationService.reset();

    $scope.addToList = function() {
        //1. Get text in key and integer
        var k = document.getElementById('meanKeyInput').value;
        var i = document.getElementById('meanIntegerInput').value;
        $scope.inputList.push({key: k, values: i});

        //2. Create span with bootstrapper label classes and append span to well.
        var well = document.getElementById('meanInputList');
        var span = document.createElement('span');
        span.className = 'label label-default';
        span.innerHTML = "Key: '" + k + "' Integer: " + i;
        well.appendChild(span);

        if(!$scope.userInput) {
            $scope.userInput = true;
        }
    };
};