/**
 * Created by matthewmicallef on 29/05/2016.
 */

describe('RelativeFrequenciesController', function() {

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
        controller = $controller('relativeFrequenciesController', {
            $scope: scope,
            animationService: animationService
        });
    }));

    it('assigns a pageClass to the scope', function() {
        expect(scope.pageClass).toBe('page-relativeFrequencies');
    });

    it('calls animationService.reset()', function() {
        expect(animationService.reset).toHaveBeenCalled();
    });
});