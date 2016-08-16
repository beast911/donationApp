donationModule.service('DonationService', ['$log', '$q', '$http', '$httpParamSerializerJQLike',
    function($log, $q, $http, $httpParamSerializerJQLike) {
        var self = {
            verifyCheckout: function(paymentCheckoutId) {
                var deferred = $q.defer();
                var url = 'https://test.oppwa.com/v1/checkouts/' + paymentCheckoutId + '/payment';
                url += '?authentication.userId=8a8294174b7ecb28014b9699220015cc';
                url += '&authentication.password=sy6KJsT8';
                url += '&authentication.entityId=8a8294174b7ecb28014b9699220015ca';
                var p = $http({
                    url: url,
                    method: 'GET'
                });
                p.then(function ok(data) {
                        deferred.resolve(data);
                    },
                    function fail(error) {
                        deferred.reject("error", error);
                    });
                return deferred.promise;
            },

            getDonationService: function(donation) {
                var deferred = $q.defer();
                var p = $http({
                    url: 'https://test.oppwa.com/v1/checkouts',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $httpParamSerializerJQLike(_authenticate(donation))
                });
                p.then(function ok(data) {
                        deferred.resolve(data);
                    },
                    function fail(error) {
                        deferred.reject("error", error);
                    });
                return deferred.promise;
            },

            setUserToPass: function(userId) {
                userIdToPass = userId;
                localStorage.setItem('temp_userId', userId);
            },

            setCheckoutIdToVerify: function(id) {
                checkoutId = id;
                localStorage.setItem('temp_checkoutId', checkoutId);
            },

            getUserToPass: function() {
                if (userIdToPass !== null && userIdToPass !== undefined && userIdToPass !== '') {
                    return userIdToPass;
                }
                var returnObjectKey = localStorage.getItem('temp_userId');
                return returnObjectKey;
                
            },

            getCheckoutIdToVerify: function() {
                if (checkoutId !== null && checkoutId !== undefined && checkoutId !== '') {
                    return checkoutId;
                }
                var returnObjectKey = localStorage.getItem('temp_checkoutId');
                return returnObjectKey;
            }
        };
        var checkoutId = '';
        var userIdToPass = '';
        var _authenticate = function(donation) {
            var payload = {};
            payload["authentication.userId"] = "8a8294174b7ecb28014b9699220015cc";
            payload["authentication.entityId"] = "8a8294174b7ecb28014b9699220015ca";
            payload["authentication.password"] = "sy6KJsT8";
            if (donation !== null && donation !== undefined) {
                payload["paymentType"] = "DB";
                payload["amount"] = donation.amount;
                payload["currency"] = donation.currency;
            }
            return payload;
        };

        return self;
    }
])