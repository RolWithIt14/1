(function (){
    'use strict';

    angular
        .module('landingBuilder')
        .directive('policyPreviewDirective', policyPreviewDirective);

    policyPreviewDirectiveController.$inject = ['$scope', '$sce'];
    function policyPreviewDirectiveController($scope, $sce) {
        $scope.item.html = $sce.trustAsHtml($scope.item.text);
    }

    function policyPreviewDirective () {
        return {
            restrict: 'E',
            bindToController: true,
            templateUrl: '/libs/landing-builder/directive/inputs-custom-directives/policy-preview-directive/policy-preview-directive.html',
            controller: policyPreviewDirectiveController,
            controllerAs: 'vm'
        }
    }

})();