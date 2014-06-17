'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('careerSelector', [function() {
    return {
      templateUrl: 'partials/multiselect.html',
      replace: true,
      scope: {
        selectOptions : {
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
        },
        selectedIds: []
      }
    }
  }]);
