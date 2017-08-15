angular.module('landingBuilder')
  .directive('addressPreviewDirective', function () {
    return {
      restrict: 'E',
      bindToController: true,
      templateUrl: '/libs/landing-builder/directive/inputs-custom-directives/address-preview-directive/address-preview-directive.html',
      controller: function ($scope, $http, validationRules) {
          $scope.isWrong = false;
          var timerId = setInterval(function(){
            if($('#addressLine').length > 0) {
                    var fields = [
                    { element: "addressLine", field: "addressLine" , mode: pca.fieldMode.SEARCH},
                    { element: "addressLine", field: "Label", mode: pca.fieldMode.POPULATE },
                    { element: "addressLineSelected", field: "Label", mode: pca.fieldMode.POPULATE },
                    { element: "addressSelectedShow", field: "Label", mode: pca.fieldMode.POPULATE }
                    ],
                    options = {
                        key: "FU45-WM12-YB36-HK76", minSearch: 5, search: { countries: "USA,CAN" }, 
                    },

                    control = new pca.Address(fields, options);

                    control.listen("focus", function (selection) {
                        $('#addressLineSelected').val('');
                        $('#addressSelectedShow').html('');
                        $('#addressLineSelected').val('');
                    });

                    control.listen("populate", function (selection) {
                        $scope.$apply(function () {
                            var selectedValue = angular.element('#addressLineSelected').val();
                            var value = angular.element('#addressLine').val();
                            
                            $scope.formModel.postcode = selection.PostalCode;
                            $scope.formModel.address = selection.Line1;
                            $scope.formModel.address2 = selection.Line2;
                            $scope.formModel.town = selection.City;
                            $scope.formModel.county = selection.ProvinceName;
                            $scope.formModel.country = selection.CountryName;
                            $scope.formModel.buildingName = selection.BuildingName;
                            $scope.formModel.buildingNumber = selection.BuildingNumber;
                            $scope.formModel.stateCode = selection.ProvinceCode;
                            $scope.formModel.streetName = selection.Street;
                            $scope.formModel.subBuilding = selection.SubBuilding;
                            
                            $scope.isWrong = (
                                selectedValue.length === 0 || (
                                selectedValue.length > 0 && selectedValue !== value)
                            );
                        });
                    });
                        

                    clearInterval(timerId);
            }
            }, 1000);
        
          
          $scope.wrongMessage = 'Please select valid address';

          $scope.validation = validationRules.getByName($scope.item.validation);

          $scope.clearAddress = function() {
              $scope.formModel.addressLine = '';
          };

          $scope.checkAddress = function() {
              var selectedValue = angular.element('#addressLineSelected').val();
              var value = angular.element('#addressLine').val();

              $scope.isWrong = 
                selectedValue.length === 0;
          };
      }
      
    };
  });
