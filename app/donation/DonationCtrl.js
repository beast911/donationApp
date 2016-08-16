donationModule.controller('DonationCtrl', ['$scope', 'DonationService', '$q',

    function($scope, DonationService, $q) {
        $scope.donatedBy = "";
        $scope.init = function() {
            localStorage.removeItem('temp_userId');
            localStorage.removeItem('temp_checkoutId')
        }();
        $scope.isNotValidNumber = function(number) {
            return number <= 100;
        };
        $scope.donate = function(event) {
            event.preventDefault();
            // check if allowed to send the form or not from localstorage
            if (__checkDonationAllowedFor($scope.donation.fromUserId)) {
                var deferred = $q.defer();
                $scope.donatedBy = $scope.donation.fromUserId;
                DonationService.getDonationService($scope.donation).then(function ok(response) {
                    DonationService.setUserToPass($scope.donatedBy);
                    __generatePaymentForm(response.data.id);
                }, function fail(error) {
                    // error scenario
                });
            }
        };
        var __checkDonationAllowedFor = function(user) {
            var storedObject = JSON.parse(localStorage.getItem(user));
            var SECONDS_DIFF_THRESHOLD = 60*60;
            if (storedObject !== null) {
                var donatedTime = new Date(storedObject.timestamp);
                var currentTime = new Date(new Date().toUTCString());
                var secondsDiff = Math.floor((currentTime - donatedTime)/1000);
                if (secondsDiff <= SECONDS_DIFF_THRESHOLD) {
                    return false;
                } else {
                    return true;
                }
            }
            return true;
        };

        var __generatePaymentForm = function(checkoutId) {
            DonationService.setCheckoutIdToVerify(checkoutId);
            var payScript = document.createElement('script');
            payScript.setAttribute('src', 'https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=' + checkoutId);
            document.head.appendChild(payScript);
            var donationForm = document.getElementById('donationForm');
            donationForm.parentNode.removeChild(donationForm);
            var formPay = document.createElement('form');
            var textNode = document.createTextNode('VISA');
            var newLocation = window.location.origin + '/#!/thankyou';
            formPay.appendChild(textNode);
            formPay.setAttribute('action', newLocation);
            formPay.setAttribute('class', 'paymentWidgets');
            document.body.appendChild(formPay);
        }

    }
]);