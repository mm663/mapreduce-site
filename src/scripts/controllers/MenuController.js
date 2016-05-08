/**
 * Created by matthewmicallef on 05/04/2016.
 */

var menuController = function($scope, animationService, $timeout) {
    $scope.showLoader = false;
    $scope.mapperPerLine = false;

    $scope.toggleMapperPerLine = function() {
        $scope.mapperPerLine = !$scope.mapperPerLine;
    };

    $scope.toggleMenu = function() {
        $scope.showMenu = !$scope.showMenu;
        if($scope.showMenu) {
            $("#menuOptions").slideUp("slow");
        } else {
            $("#menuOptions").slideDown("slow");
        }
    };

    $scope.toggleUseCombiners = function() {
        animationService.toggleUseCombiners();
    };

    $scope.toggleShowPartitioners = function() {
        animationService.toggleShowPartitioners();
    };

    $scope.runMapReduce = function() {
        Utils.MapReduce.reset();

        $scope.showLoader = true;

        $timeout(function() {
            if($scope.name === "WordCount") {
                WordCount.setAnimationService(animationService);

                WordCount.runWordCountMapReduce(
                    document.getElementById("numberOfMappersInput").value,
                    document.getElementById("numberOfReducersInput").value,
                    $scope.mapperPerLine,
                    $scope.userInput
                );

                $scope.showLoader = false;
                animationService.toggleAnimationDisabled();
            } else if ($scope.name === "Mean") {
                Mean.setAnimationService(animationService);

                Mean.runMeanMapReduce(
                    document.getElementById("numberOfMappersInput").value,
                    document.getElementById("numberOfReducersInput").value,
                    $scope.mapperPerLine,
                    $scope.userInput
                );

                $scope.showLoader = false;
                animationService.toggleAnimationDisabled();
            } else if ($scope.name === "RelativeFrequencies") {
                RelativeFrequencies.setAnimationService(animationService);

                RelativeFrequencies.runRelativeFrequenciesMapReduce(
                    document.getElementById("numberOfMappersInput").value,
                    document.getElementById("numberOfReducersInput").value,
                    $scope.mapperPerLine,
                    $scope.userInput
                );

                $scope.showLoader = false;
                animationService.toggleAnimationDisabled();
            }

        }, 100);
    };
};