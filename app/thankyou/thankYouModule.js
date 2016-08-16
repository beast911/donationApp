'use strict';

window.thankYouModule = angular.module('donationApp.thankYou', ['ngRoute'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/thankyou', {
            templateUrl: 'thankyou/thankyou.html',
            controller: 'thankYouCtrl'
        });
    }
])

.controller('thankYouCtrl', ['$scope', 'DonationService', '$window',
    function($scope, DonationService, $window) {
        var init = function() {
            console.log("init called");
            var paymentCheckoutId = DonationService.getCheckoutIdToVerify();
            if (paymentCheckoutId !== "") {
                DonationService.verifyCheckout(paymentCheckoutId).then(function ok(response) {
                        __storeToLocalForRef(response.data);
                        $window.location.href = $window.location.origin + '/#!/donation';

                    },
                    function fail(error) {
                        // handle error response
                    });
            }

        }();
        var __storeToLocalForRef = function(data) {
            var userIdKey = DonationService.getUserToPass();
            var storeObject = {};
            storeObject.id = data.id;
            storeObject.amount = data.amount;
            storeObject.currency = data.currency;
            storeObject.buildNumber = data.buildNumber;
            storeObject.timestamp = data.timestamp;
            storeObject.ndc = data.ndc;
            localStorage.setItem(userIdKey, JSON.stringify(storeObject));

        }
    }
]);