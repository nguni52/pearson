/* global ActiveText */
ActiveText.namespace("ActiveText.SkinUtils");
ActiveText.SkinUtils = (function() {
    "use strict";

    function getPathToResources(activeTextInstance) {
        var rtn = "/";
        if(activeTextInstance && activeTextInstance.options &&
            typeof activeTextInstance.options.resourcesPath === "string") {
            rtn = activeTextInstance.options.resourcesPath;
        } else {
            switch(window.location.protocol) {
                case 'http:':
                case 'https:':
                    //remote file over http or https
                    rtn = "/static/";
                    break;
                case 'file:':
                    //local file
                    rtn = "";
                    break;
                default:
                    break;
            }
        }
        return rtn;
    }

    function getPathToGlobalResource() {
        var rtn = "/";
        switch(window.location.protocol) {
            case 'http:':
            case 'https:':
                //remote file over http or https
                rtn = window.location.protocol + "//activetext-storage.s3.amazonaws.com/lib/";
                break;
            case 'file:':
                rtn = "";
                break;
            default:
                break;
        }
        return rtn;
    }

    return {
        getPathToResources: getPathToResources,
        getPathToGlobalResource: getPathToGlobalResource
    };
})();
