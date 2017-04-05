/* global ActiveText */
ActiveText.namespace("ActiveText.DataUtils");
ActiveText.DataUtils = (function() {
    "use strict";

    function parseURI(query) {
        if(query) {
            var hasSemicolons = query.indexOf(";") !== -1;
            //        var hasAmpersands = query.indexOf("&") !== -1;
            if(hasSemicolons)// && !hasAmpersands)
            {
                query = query.split("&").join("|amp|").split(";").join("&");
            }
            var querySplit = query.split("?");
            query = querySplit.pop();
            var re = /([^&=]+)=?([^&]*)/g;
            var decodeRE = /\+/g;
            var params = {}, e;
            while(e = re.exec(query)) {
                var k = e[1] , v = e[2];
                v = v.split("|amp|").join("&");
                if(k.substring(k.length - 2) === '[]') {
                    k = k.substring(0, k.length - 2);
                    (params[k] || (params[k] = [])).push(v);
                } else {
                    params[k] = v;
                }
            }
            return params;
        } else {
            return {};
        }
    }

    function prependPathToAssets(activeTextInstance, input) {
        var pathToAssets = activeTextInstance.loader.getDataProvider().getPathToPages();

        if(pathToAssets !== undefined) {
            return pathToAssets + input;
        }
        return input;
    }

    function correctURLPath(activeTextInstance, input) {
        var rtn = prependPathToAssets(activeTextInstance, input);
        rtn = rtn.split("//").join("/").split("http:/").join("http://").split("https:/").join("https://");
        return rtn;
    }

    return {
        parseURI: parseURI,
        correctURLPath: correctURLPath
    };
})();
