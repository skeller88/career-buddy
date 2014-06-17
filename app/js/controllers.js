'use strict';

/* Controllers */

angular.module('myApp.controllers', ["kendo.directives"])
  .controller('MyCtrl', ['$scope', function($scope) {
    $scope.selectOptions = {
        placeholder: "Select at least two careers...",
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

    $scope.compare = function(){
      console.log('this');
    }
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
