/* global ActiveText */
ActiveText.namespace("ActiveText.UI.FontInjection");
ActiveText.UI.FontInjection = (function(ActiveText) {
    "use strict";

    /**
     * @type {Boolean}
     */
    var added = false;

    function injectFontTag() {
        var pathToResources = ActiveText.SkinUtils.getPathToGlobalResource();
        $('<link rel="stylesheet" href="' + pathToResources + 'font/font-awesome.min.css">').appendTo("head");
        $('<link rel="stylesheet" href="' + pathToResources +
            'font/general_enclosed_foundicons.css">').appendTo("head");

        if($.browser.msie && parseInt($.browser.version, 10) < 8) {
            $('<link rel="stylesheet" href="' + pathToResources +
                'font/font-awesome-ie7.min.css">').appendTo("head");
            $('<link rel="stylesheet" href="' + pathToResources +
                'font/general_enclosed_foundicons_ie7.css">').appendTo("head");
        }

        added = true;
    }

    /**
     * @return {Boolean}
     */
    function hasBeenAdded() {
        return added;
    }

    return {
        injectFontTag: injectFontTag,
        hasBeenAdded: hasBeenAdded
    };
})(ActiveText);
