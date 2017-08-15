angular.module('landingBuilder')
  .directive('dobUsPreviewDirective', function () {
    return {
      restrict: 'E',
      bindToController: true,
      templateUrl: '/libs/landing-builder/directive/inputs-custom-directives/dob-us-preview-directive/dob-us-preview-directive.html',
      controller: function ($scope) {

        $scope.dob = {};

        $scope.compileDate = function () {
          if ($scope.dob.day && $scope.dob.month && $scope.dob.year) {
            $scope.formModel[$scope.item.name] = $scope.dob.year + '-' + $scope.dob.month + '-' + $scope.dob.day;
          } else {
            $scope.formModel[$scope.item.name] = '';
          }
        };

        if ($scope.formModel.birthDate !== null) {
          var dataObj = new Date($scope.formModel.birthDate);
          if (angular.isDate(dataObj) === true && angular.isDate(dataObj) !== 'Invalid Date') {
            $scope.dob.year = dataObj.getFullYear();
            $scope.dob.month = dataObj.getMonth();
            $scope.dob.day = dataObj.getDate();

            $scope.dob.month = $scope.dob.month < 10 ? ('0' + $scope.dob.month) : $scope.dob.month;

            $scope.compileDate();
          }
        }

      }
    };
  });
