angular.module('landingBuilder').directive('pageForm', function() {
    return {
        restrict: 'E',
        templateUrl: '/libs/landing-builder/directive/page-form-directive/page-form.html',
        bindToController: true
    };
});
