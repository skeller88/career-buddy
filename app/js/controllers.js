'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('HomeCtrl', ['$scope', function($scope) {
    $scope.selectOptions = {
        placeholder: "Select at least two careers...",
        dataTextField: "CareerName",
        dataValueField: "CareerCode",
        autoBind: false,
        dataSource: {
            type: "odata",
            serverFiltering: true,
            transport: {
                read: {
                    url: "http://career-buddy.herokuapp.com/careers",
                }
            }
        }
    };

    //stub
    // $scope.selectOptions = {
    //     placeholder: "Select at least two careers...",
    //     dataTextField: "ProductName",
    //     dataValueField: "ProductID",
    //     autoBind: false,
    //     dataSource: {
    //         type: "odata",
    //         serverFiltering: true,
    //         transport: {
    //             read: {
    //                 url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
    //             }
    //         }
    //     }
    // };

    $scope.selectedIds = [];

    $scope.compare = function(){
      console.log('this');
    }

  }])
  .controller('AboutCtrl', ['$scope', function($scope) {
    $scope.pageClass = "page-about";
  }])
  .controller('ContactCtrl', ['$scope', function($scope) {
    $scope.pageClass = "page-contact";
  }]);
