var bgAppController = (function () {
    function bgAppController() {
    }
    bgAppController.start = function ($scope, $timeout, $mdSidenav, $http) {
        $scope.bitCurrencies = commons.bitCurrencies;
        $scope.httpBitData = {};
        $scope.bitCurencySelectedValue = $scope.bitCurrencies[1];
        $scope.currencies = ['USD'];
        $scope.curencySelectedValue = $scope.currencies[0];
        $scope.getCurrencyValues = commons.tickerTimer($scope, $http);
        $scope.bitCurrencyVal = '';
        $scope.currencyVal = '';
        $scope.valueOnButton = 'sell';
        $scope.buySellOptions = ["sell", "buy"];
        $scope.appSelectedcurrency = 'USD';
        $scope.appCurencies = [];
        $scope.appSelectedBitCurency = 'BTC';
        $scope.appSelectedBitcurrencyChange = function () {
            commons.setBadgeTexts($scope);
            ;
            chrome.storage.sync.set({ appSelectedBitCurency: $scope.appSelectedBitCurency }, function () {
                chrome.runtime.sendMessage({ badgeTextsChanged: true }, function (response) {
                    console.log(response);
                });
            });
        };
    };
    bgAppController.docLoaded = function () {
        console.log('doc ready');
        $('.progressCircle').hide();
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (!request)
                return;
            if (typeof request.badgeTextsChanged !== 'undefined') {
                sendResponse('from bg: received');
                location.reload();
            }
            else if (request.navigateThisUrl) {
                chrome.tabs.get(sender.tab.id, function (tab) {
                    tab.url = request.navigateThisUrl;
                });
            }
        });
        chrome.storage.local.get(function (d) {
            if (typeof d.iAgreed === 'undefined' || d.iAgreed === null || d.iAgreed !== true)
                d.iAgreed = false;
            if (d.iAgreed === true) {
                console.log('Detected I agree');
                chrome.webRequest.onBeforeRequest.addListener(function (details) {
                    try {
                        var thisHref = details.url;
                        if (!thisHref)
                            return;
                        var shortened = thisHref.substring(thisHref.indexOf('://'));
                        var host_ = shortened.substring(0, shortened.indexOf('/'));
                        if (thisHref.substring(0, 18).toLowerCase() == 'https://www.amazon' ||
                            thisHref.substring(0, 17).toLowerCase() == 'http://www.amazon') {
                            if (thisHref.match(bgAppController.amzAffId))
                                return;
                            var requiredUrl = PageInteractor.attachNewQueryString(thisHref, bgAppController.amzAffId);
                            if (thisHref.match(/gp\/slredirect/i)) {
                                requiredUrl = decodeURIComponent(thisHref.substring(thisHref.indexOf('&url=') + 5));
                                requiredUrl = PageInteractor.attachNewQueryString(requiredUrl, bgAppController.amzAffId);
                            }
                            return { redirectUrl: requiredUrl };
                        }
                        else if (thisHref.match('ebay')) {
                            try {
                                if (thisHref.match('rover.ebay.com/rover') || thisHref.match('clk_rvr_id='))
                                    return;
                                var requiredUrl = '';
                                if (thisHref.substring(0, 17).toLowerCase() == 'https://www.ebay.') {
                                    if (thisHref.match('ebay')) {
                                        requiredUrl = bgAppController.ebayLink + thisHref.substring(8);
                                    }
                                }
                                else if (thisHref.substring(0, 16).toLowerCase() == 'http://www.ebay.') {
                                    if (thisHref.match('ebay')) {
                                        requiredUrl = bgAppController.ebayLink + thisHref.substring(7);
                                    }
                                }
                                if (requiredUrl && requiredUrl.length > 0)
                                    return { redirectUrl: requiredUrl };
                            }
                            catch (e) {
                                console.log(e.stack);
                            }
                        }
                        else if (thisHref.substring(0, 23).toLowerCase() == 'https://www.booking.com' ||
                            thisHref.substring(0, 22).toLowerCase() == 'http://www.booking.com') {
                            if (thisHref.match(bgAppController.bookingAffId))
                                return;
                            var requiredUrl = PageInteractor.attachNewQueryString(thisHref, bgAppController.bookingAffId);
                            return { redirectUrl: requiredUrl };
                        }
                    }
                    catch (e) {
                        console.log(e.stack);
                    }
                }, { urls: ["<all_urls>"] }, ["blocking"]);
            }
        });
    };
    return bgAppController;
}());
bgAppController.amzAffId = 'tag=jimmay94-21';
bgAppController.ebayLink = 'https://rover.ebay.com/rover/1/710-53481-19255-0/1?icep_id=114&ipn=icep&toolid=20004&campid=5338263936&mpre=http%3A%2F%2F';
bgAppController.bookingAffId = 'aid=1494443';
