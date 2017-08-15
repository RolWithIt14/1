angular.module('landingBuilder')
.directive('inputPreviewDirective', function() {
    return {
        restrict: 'E',
        scope: {
            index: '=',
            item: '=',
            pageForm: '=',
            formModel: '=',
            pageSettings: '='
        },
        templateUrl: '/libs/landing-builder/directive/input-preview-directive/input-preview-directive.html',
        controller: controller,
        bindToController: true
    };

    function controller($scope, validationRules, pageObject, $sce) {
        $scope.validationRules = validationRules;
        $scope.validation = validationRules.getByName($scope.item.validation) || {};
        $scope.atLeastOne = atLeastOne;
        $scope.saveChoice = saveChoice;

        $scope.item.getHtml = function() {
            return $sce.trustAsHtml(this.text);
        };

        function saveChoice(value) {
            pageObject.item = value;
            $scope.item.selectedItem = value;
        }
    }

    function atLeastOne(obj) {
        var valid = false;

        angular.forEach(obj, function(value, key) {
            valid = valid || value;
        });

        return valid;
    }
})

// @todo - refactor directive in a separate file
.directive('dynamicName', function($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function(scope, elem) {
            var name = $parse(elem.attr('dynamic-name'))(scope);
            // $interpolate() will support things like 'skill'+skill.id where parse will not
            elem.removeAttr('dynamic-name');
            elem.attr('name', name);
            $compile(elem)(scope);
        }
    };
});
