describe('Unit: myApp.services', function() {
    var careersService, $rootScope, createController, $httpBackend;

    beforeEach(angular.mock.module('myApp'), [
        'ngAnimate',
        'ngMock',
        'ui.router',
        'ngResource',
        'kendo.directives',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers'
    ]);

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.expectGET('/careers/names').respond(
            [
                {career_name: 'nurse'}, 
                {career_name: 'doctor'}, 
                {career_name: 'lawyer'}
            ]
        );

        careersService = $injector.get('careersService');
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('HomeCtrl', {'$scope' : $rootScope });
        }; 
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('getCareerNames() - should get all career names', function() {
        var controller = createController();
        $httpBackend.flush(); 
    });

    it('getCareerNames - returns an array of objects with a career_name property', function() {
        careersService.getCareerNames().then(function(response) {
            var names = response.data;
            assert.equal(names.length, 3);
            assert.equal(names[0].career_name, 'nurse');
        });

        $httpBackend.flush();
    });
})