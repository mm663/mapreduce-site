/**
 * Created by matthewmicallef on 05/04/2016.
 */

var mapReduceController = function($scope, animationService) {
    $scope.toggleMapReduceSection = function(sectionName) {
        var element = document.getElementById(sectionName);
        if(element) {
            if(element.clientHeight === 0) {
                $(element).slideDown("slow");

                var canvas = element.getElementsByClassName("jsavcanvas");
                if(canvas) {
                    $(canvas[0]).scrollintoview();
                }
            } else {
                $(element).slideUp("slow");
            }
        }
    };

    $scope.showCombiners = function() {
        return animationService.isUsingCombiners();
    };

    $scope.showPartitioners = function() {
        return animationService.isShowingPartitioners();
    };
};