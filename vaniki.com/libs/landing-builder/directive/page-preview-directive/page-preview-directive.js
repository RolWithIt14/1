angular
    .module('landingBuilder')
    .directive('pagePreviewDirective', function() {

    var controller = function($state, pageObject, $scope, $http, toastr, urlHelper, $rootScope, $interval, $sce) {
        var vm = this;
        vm.pageObject = pageObject.getObject();
        vm.formModel = vm.pageObject.formModel;
        vm.state = $state.current.name;
        vm.signUp = signUp;

        $scope.loader = false;

        vm.submitForm = function() {
            vm.formModel.projectId = urlHelper.getUrlParam('projectId');
            vm.formModel.supplierId = urlHelper.getUrlParam('supplierId');
            vm.formModel.landingId = urlHelper.getUrlParam('landingId');
            vm.formModel.campaignId = urlHelper.getUrlParam('campaignId');
            vm.formModel.subId = urlHelper.getUrlParam('subId');
            vm.formModel.backTo = urlHelper.getUrlParam('backTo');

            if(urlHelper.getUrlParam('item') != null){
                vm.formModel.item = urlHelper.getUrlParam('item');
            }

            if(urlHelper.getUrlParam('clickId') != null){
                vm.formModel.clickId = urlHelper.getUrlParam('clickId');
            }

            var preview = location.href.indexOf('/preview') >- 1;

            var checkValid = $interval(function () {
                if($rootScope.validationPhone !== false) {
                  $scope.loader = false;
                  $interval.cancel(checkValid);
                  checkBeforeSignUp();
                }
            }, 1000);

            function checkBeforeSignUp() {
                var validAddress = true;
                if (angular.isDefined(vm.formModel.addressLine) &&
                    (
                        (
                            !angular.isDefined(vm.formModel.address) ||
                            !angular.isDefined(vm.formModel.postcode) ||
                            vm.formModel.address === '' ||
                            vm.formModel.postcode === ''
                        )
                    )
                ) {
                    $scope.isWrong = false;
                    validAddress = false;
                }

                if (validAddress && (!angular.isDefined($scope.pageForm) || $scope.pageForm.$valid && preview !== true)) {
                    $scope.loader = true;
                    signUp();
                } else {
                    $scope.loader = false;
                }
            }

        };

        function signUp() {
            $http({
                url: '/sign-up',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: vm.formModel
            })
              .then(function(response) {
                  var prePixel;
                  if(response.data.item === 'lifeProtected') {
                      prePixel = '<div>' + response.data.pixel + '</div>';
                      vm.formModel.pixel = $sce.trustAsHtml(prePixel);
                      $(".promo").hide();
                      $(".content--complaints").hide();
                      $(".content--home").hide();
                      $(".content--faqs").hide();
                      $(".content--thanks").show();
                  } else if(response.data.item === 'Debt') {
                      prePixel = '<div>' + response.data.pixel + '</div>';
                      vm.formModel.pixel = $sce.trustAsHtml(prePixel);
                      $(".promo").hide();
                      $(".content--complaints").hide();
                      $(".content--home").hide();
                      $(".content--faqs").hide();
                      $(".content--thanks").show();
                  } else if (response.data.item === 'UK'){
                      $('.section--question--04').slideUp();
                      $('.penultimate').slideUp();
                      $('.winners-info').slideUp();
                      $('.finished').slideDown();
                  } else if (response.data.item === 'Funeral'){
                      prePixel = '<div>' + response.data.pixel + '</div>';
                      vm.formModel.pixel = $sce.trustAsHtml(prePixel);
                      $('.content').hide();
                      $('.info').hide();
                      $('.logo').hide();
                      $('.content--thanks').slideDown();
                  } else if (response.data.item === 'Claims'){
                      prePixel = '<div>' + response.data.pixel + '</div>';
                      vm.formModel.pixel = $sce.trustAsHtml(prePixel);
                      $('.content').hide();
                      $('.info').hide();
                      $('.logo').hide();
                      $('.content--thanks').slideDown();
                  } else {
                      followBackToOfferboard();
                  }
              })
              .catch(function(error) {
                  if (error.data && error.data.backTo) {
                      followBackToOfferboard(error.data.backTo);
                  }

                  if (null === urlHelper.getUrlParam('backTo')) {
                      if (error.status === 302) {
                          window.location.href = error.data.url;
                      } else {
                          var message = error.statusText;
                          toastr.error(message);
                      }
                  }
              });
        }

        function followBackToOfferboard(backTo) {
            if (null !== backTo) {
                window.location = backTo;
            } else if (urlHelper.getUrlParam('backTo')) {
                window.location = urlHelper.getUrlParam('backTo');
            }
        }
    };

    return {
        restrict: 'EA',
        replace: true,
        scope: {

        },
        controller: controller,
        controllerAs: 'lp',
        bindToController: true,
        templateUrl: '/libs/landing-builder/directive/page-preview-directive/page-preview-directive.html',
    };
})

.directive('parseHtml', function() {
    return {
        restrict: 'EA',
        scope: {
            element: '=element',
            elementType: '=elementType'
        },
        controller: function($interpolate, $compile, $scope, $element) {

            function compile() {
                $element.empty();

                if (!$scope.element) {
                    return;
                }

                var compiled;

                if ($scope.elementType === 'css') {
                    compiled = $interpolate($scope.element)($scope.$parent);
                } else {
                    compiled = $compile($scope.element)($scope.$parent);
                }

                $element.append(compiled);
                $scope.$applyAsync();
            }

            compile();

            $scope.$watch(
                function() {
                    return $scope.element;
                },
                function(a,b){
                    a != b && compile();
                }
            );
        }
    };
});
