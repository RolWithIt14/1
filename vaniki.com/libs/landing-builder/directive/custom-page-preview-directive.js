(function () {
  'use strict';

  angular
    .module('landingBuilder')
    .directive('customPagePreviewDirective', customPagePreviewDirective);

  customPagePreviewDirectiveCtrl.$inject = ['pageObject', '$scope', '$http', 'urlHelper'];

  function customPagePreviewDirectiveCtrl(pageObject, $scope, $http, urlHelper) {

    var vm = this;
    vm.pageObject = pageObject.getObject();
    vm.formModel = vm.pageObject.formModel;

    vm.submitSubscriptionFormPhone = function () {
      vm.formModel.projectId = urlHelper.getUrlParam('projectId');
      vm.formModel.supplierId = urlHelper.getUrlParam('supplierId');
      vm.formModel.landingId = urlHelper.getUrlParam('landingId');
      vm.formModel.campaignId = urlHelper.getUrlParam('campaignId');
      vm.formModel.subId = urlHelper.getUrlParam('subId');

      if (vm.formModel.country === "Greek") {
        vm.formModel.serviceId = '1926ab24-f2a3-11e6-bd24-22000ac086b3';
      } else {
        vm.formModel.serviceId = 'e772e3d0-f2a2-11e6-bd24-22000ac086b3';
      }

      if(typeof vm.formModel.msisdn !== "undefined") {
        $http({
          url: 'http://api.unnik-iq.com/v1/subscribe/pin-request',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: vm.formModel
        })
          .then(function () {
            showNextSlide();
          })
      }

    };

    function showNextSlide() {
      $('.intro').slideUp();
      $('.section--question--01').slideUp();
      $('.penultimate').slideDown();
      $('.section--question--02').slideDown();
    }

    function showFinishedSlide() {
      $('.section--question--02').slideUp();
      $('.penultimate').slideUp();
      $('.finished').slideDown();
    }

    vm.submitSubscriptionFormPin = function () {
      vm.formModel.projectId = urlHelper.getUrlParam('projectId');
      vm.formModel.supplierId = urlHelper.getUrlParam('supplierId');
      vm.formModel.landingId = urlHelper.getUrlParam('landingId');
      vm.formModel.campaignId = urlHelper.getUrlParam('campaignId');
      vm.formModel.subId = urlHelper.getUrlParam('subId');

      if (vm.formModel.country === "Greek") {
        vm.formModel.serviceId = '1926ab24-f2a3-11e6-bd24-22000ac086b3';
      } else {
        vm.formModel.serviceId = 'e772e3d0-f2a2-11e6-bd24-22000ac086b3';
      }

      if (typeof vm.formModel.pin !== "undefined") {

        $http({
          url: 'http://api.unnik-iq.com/v1/subscribe/pin-verify',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: vm.formModel
        })
          .then(function () {
            showFinishedSlide();
          })
          .catch(function(error) {
              showFinishedSlide();
          });
      }
    }
  }

  function customPagePreviewDirective() {
    return {
      restrict: 'A',
      controller: customPagePreviewDirectiveCtrl,
      controllerAs: 'itemData',
      bindToController: true
    }
  }

})();


