

window.donationModule = angular.module('donationApp.welcome', ['ngRoute'])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/donation', {
            templateUrl: 'donation/donation.html',
            controller: 'DonationCtrl'
        }).when('/thankyou', {
            templateUrl: 'thankyou/thankyou.html',
            controller: 'thankYouCtrl'
        });
    }
]);