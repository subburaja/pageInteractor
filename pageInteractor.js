var pageInteractor = (function () {
    function pageInteractor() {
    }
    
     /**
     * As name implies this method can be used to execute a js function after certain condition is met. The condition as function is passed as a param
     * that returns boolean upon called.
     * @param {function} inCondition, a function that returns a boolean
     * @param {function} handler, a call back to execute after inCondition retuned a true
     * @param {number} timeLimit, duration in milliseconds after which checking for inCondition stops
     * @param {boolean} executeAfterTimeLimit, if value {true} passed, handler is executed after timelimit , by default it is false
     * @param {number} inInterval,in milliseconds, interval between checking the conition 
     */
    pageInteractor.executeAfterCondition = function (inCondition, handler, timeLimit, executeAfterTimeLimit, inInterval) {
        if (executeAfterTimeLimit === void 0) { executeAfterTimeLimit = false; }
        var x = typeof inCondition;
        var y = typeof handler;
        if (typeof inCondition !== "function" || typeof handler !== "function") {
            console.log('In condition and handler should be a function ');
            return;
        }
        try {
            if (inCondition() === true || inCondition() === false) {
                console.log('A bool returned');
            }
            else {
                console.log('suppplied condition not returned a boolean...');
                return;
            }
        }
        catch (e) {
            console.log('executing condition function thrown following error...' + e.stack);
            return;
        }
        if (typeof timeLimit === 'undefined' || timeLimit === null || timeLimit < 0) {
            timeLimit = 120000;
        }
        var checkTimer = setInterval(function () {
            try {
                if (inCondition()) {
                    try {
                        handler();
                    }
                    catch (e) {
                        console.log(e.stack);
                    }
                    clearInterval(checkTimer);
                }
                else {
                    console.log('timer running');
                }
            }
            catch (e) {
                console.log(e.stack);
            }
        }, inInterval);
        setTimeout(function () {
            try {
                if (typeof executeAfterTimeLimit !== undefined && executeAfterTimeLimit !== null && executeAfterTimeLimit) {
                    handler();
                }
                console.log('timer about to clear for long run...');
                clearInterval(checkTimer);
            }
            catch (e) {
                console.log(e.stack);
            }
        }, timeLimit);
    };
    
     /**
     * Returns value for a query string that present in the current url
     * @param {string} queryName, a query string for which to get the value if exists from location.search
     */    
    pageInteractor.getQueryValueByName = function (queryName) {
        if (typeof window.location.search === "undefined") {
            return null;
        }
        if (typeof queryName === "undefined" || queryName === null) {
            console.log('queryName does not provided...');
            return null;
        }
        var queryPart = window.location.search.replace('?', '');
        var queryArray = queryPart.split('&');
        var queryObjectArray = [];
        try {
            queryArray.forEach(function (item, index) {
                var nameVal = item.split('=');
                queryObjectArray.push({ 'qName': nameVal[0], 'qValue': nameVal[1] });
            });
        }
        catch (e) {
            console.log(e.stack);
            return null;
        }
        var queryValue;
        try {
            queryObjectArray.forEach(function (item) {
                if (item.qName === queryName) {
                    queryValue = item.qValue;
                    return false;
                }
            });
            return queryValue;
        }
        catch (e) {
            console.log(e.stack);
            return null;
        }
    };
    return pageInteractor;
}());
