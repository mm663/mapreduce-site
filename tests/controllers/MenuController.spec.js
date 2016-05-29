/**
 * Created by matthewmicallef on 29/05/2016.
 */

describe('MenuController', function() {

    var controller,
        scope,
        animationService;

    beforeEach(module('App'));
    beforeEach(inject(function($controller, $rootScope) {
        animationService = {
            toggleUseCombiners: function() { },
            toggleShowPartitioners: function() { }
        };

        spyOn(animationService, 'toggleUseCombiners');
        spyOn(animationService, 'toggleShowPartitioners');

        scope = $rootScope.$new();
        controller = $controller('menuController', {
            $scope: scope,
            animationService: animationService
        });
    }));

    it('assigns a showLoader to the scope', function() {
        expect(scope.showLoader).toBeFalsy();
    });

    it('assigns a mapperPerLine to the scope', function() {
        expect(scope.mapperPerLine).toBeFalsy();
    });

    it('assigns a showMenu to the scope', function() {
        expect(scope.showMenu).toBeTruthy();
    });

    describe('toggleMapperPerLine', function() {
        it('toggles the value of mapperPerLine', function() {
            scope.toggleMapperPerLine();
            expect(scope.mapperPerLine).toBeTruthy();
        });
    });

    xdescribe('toggleMenu', function() {
        it('toggles the value of showMenu', function() {
            scope.toggleMenu();
            expect(scope.showMenu).toBeFalsy();
            //TODO: Check how to pass jQuery.
        });
    });

    describe('toggleUseCombiners', function() {
        it('calls animationService.toggleUseCombiners()', function() {
            scope.toggleUseCombiners();
            expect(animationService.toggleUseCombiners).toHaveBeenCalled();
        });
    });

    describe('toggleShowPartitioners', function() {
        it('calls animationService.toggleShowPartitioners()', function() {
            scope.toggleShowPartitioners();
            expect(animationService.toggleShowPartitioners).toHaveBeenCalled();
        });
    });

    xdescribe('runMapReduce', function() {
        it('', function() {
            //TODO: Later.
        });
    });
});