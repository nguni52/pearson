/* global ActiveText */
/**
 * @class BrowserUtils
 * @memberOf ActiveText
 * @type {{isOldVersionOfInternetExplorer: boolean, isMobileDevice: boolean}}
 */
ActiveText.BrowserUtils = (function() {
    'use strict';

    function isOldVersionOfInternetExplorer() {
        return $.browser.msie && parseInt($.browser.version, 10) < 9;
    }

    function IEVersion() {
        var version = false;
        if($.browser.msie){
            version = parseInt($.browser.version, 10);
        }
        return version;
    }

    function isMobileDevice() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(window.navigator.userAgent);
    }

    function iOSversion() {
        var ver = false;
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        }
        return ver;
    }

    return {
        isOldVersionOfInternetExplorer: isOldVersionOfInternetExplorer(),
        isMobileDevice: isMobileDevice(),
        IEVersion: IEVersion(),
        iOSversion: iOSversion()
    };
})();
