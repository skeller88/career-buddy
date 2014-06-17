'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('MyCtrl', ['$scope', function($scope) {
    $scope.selectOptions = {
        placeholder: "Select products...",
        dataTextField: "ProductName",
        dataValueField: "ProductID",
        autoBind: false,
        dataSource: {
            type: "odata",
            serverFiltering: true,
            transport: {
                read: {
                    url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
                }
            }
        }
    };
    $scope.selectedIds = [];
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
