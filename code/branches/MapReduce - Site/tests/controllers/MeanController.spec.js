/**
 * Created by matthewmicallef on 29/05/2016.
 */

describe('MeanController', function() {

    var controller,
        scope,
        animationService;

    beforeEach(module('App'));
    beforeEach(inject(function($controller, $rootScope) {
        animationService = {
            reset: function() { }
        };

        spyOn(animationService, 'reset');

        scope = $rootScope.$new();
        controller = $controller('meanController', {
            $scope: scope,
            animationService: animationService
        });
    }));

    it('assigns an inputList to the scope', function() {
        expect(scope.inputList).toBeDefined();
    });

    it('assigns a userInput to the scope', function() {
        expect(scope.userInput).toBeFalsy();
    });

    it('assigns a pageClass to the scope', function() {
        expect(scope.pageClass).toBe('page-mean');
    });

    it('should call animationService.reset function', function() {
        expect(animationService.reset).toHaveBeenCalled();
    });

    describe('hasSelectedElements', function() {
        it('should return false', function() {
            var result = scope.hasSelectedElements();
            expect(result).toBeFalsy();
        });

        it('should return true if clicked', function() {

        });
    });
});