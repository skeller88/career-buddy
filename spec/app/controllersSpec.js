describe('Unit: HomeCtrl', function() {
    beforeEach(module('myApp'));

    var ctrl, $scope;

    beforeEach(inject(function($controller, _$httpBackend_, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('HomeCtrl', {
            $scope: scope
        });
    }));

    it('should get career names', function() {
        scope.getCareerNames();
        assert.equal(scope.careerNamesLength, 1074)
    })
})