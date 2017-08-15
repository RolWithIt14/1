angular
  .module('landingBuilder')
  .directive('postcodePreviewDirective', function () {
    return {
      restrict: 'E',
      templateUrl: '/libs/landing-builder/directive/inputs-custom-directives/postcode-preview-directive/postcode-preview-directive.html',
      controller: function ($scope, $http, validationRules) {
        $scope.validation = validationRules.getByName($scope.item.validation);

        $scope.checkPostcode = function() {
            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': 'hSQxEK0zUcbFj0CPkLeih1wNwL5vqDei'
                },
                method: 'POST',
                params: {
                    code: $scope.formModel[$scope.item.name]
                },
                url: $scope.validation.validationUrl
            }).then(
            function (response) {
              $scope.postcodeOptions = response.data.list;
              $scope.pageForm[$scope.item.name].$setValidity('backendCheck', true);
            },
            function() {
              $scope.pageForm[$scope.item.name].$setValidity('backendCheck', false);
            }
          );
        };

        $scope.updatePostcode = function() {
            $http({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': 'hSQxEK0zUcbFj0CPkLeih1wNwL5vqDei'
                },
                method: 'POST',
                params: {},
                url: 'http://validation.unnik-iq.com/address?code=' + $scope.selectedPostcode
            }).then(
                function (response) {
                    var addr = '';
                    if (response.data.address.addressLine1.length > 0) {
                        addr = response.data.address.addressLine1;
                    }
                    if (response.data.address.addressLine2.length > 0) {
                        addr = addr + ', ' + response.data.address.addressLine2;
                    }
                    if (response.data.address.addressLine3.length > 0) {
                        addr = addr + ', ' + response.data.address.addressLine3;
                    }

                    $scope.formModel.town = response.data.address.locality;
                    $scope.formModel.country = 'United Kingdom';
                    $scope.formModel.county = response.data.address.province;
                    $scope.formModel.address = addr;
                }
            ).catch(
                function () {
                    $scope.formModel.town = $scope.selectedPostcode.town;
                    $scope.formModel.country = 'United Kingdom';
                    $scope.formModel.county = $scope.selectedPostcode.county;
                    $scope.formModel.address = $scope.selectedPostcode.line1 + ', ' + $scope.selectedPostcode.line2;
                });
        };

        if (typeof($scope.formModel.postcode) !== 'undefined') {
          $scope.checkPostcode();
        }
      }
    };
  });
