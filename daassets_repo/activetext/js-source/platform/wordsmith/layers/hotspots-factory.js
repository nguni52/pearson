/* global ActiveText, WordSmith, ActiveText, Modernizr */
ActiveText.namespace("WordSmith.Layers.Hotspots.Factory");
WordSmith.Layers.Hotspots.Factory = (function() {
    "use strict";

    var runOnce = false;

    function embedCSSStyles() {
        if(!runOnce) {
            $("<style>.wordsmith_icon div{cursor:pointer !important;}</style>").appendTo("head");
        }
        runOnce = true;
    }

    /**
     * @private
     * @param currentLoc
     * @param dimensions
     * @returns {*|jQuery}
     */
    function createResourceIcon(activeTextInstance, currentLoc, dimensions) {
        embedCSSStyles();

        /**
         * @type {string}
         */
        var iconType = currentLoc.data.icon;

        /**
         * @type {string}
         */
        var resourceID = currentLoc.data.id;

        /**
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        /**
         * @type {string}
         */
        var hotspotImageFilename = ActiveText.Hotspots.Helper.getDefaultFilenameFromHotspotData(currentLoc, "wordsmith-paw");

        /**
         * @type {number}
         */
        var iconWidth = 118;

        iconWidth *= 1.33;

        /**
         * @type {string}
         */
        var htmlString = "<div class='wordsmith_icon noSwipe'><img class='wordsmith_icon' src='" + pathToResources +
            "img/wordsmith/hotspots/" + hotspotImageFilename + "' width='" + iconWidth + "' height='" + iconWidth +
            "'/></div>";

        var newIcon = $(htmlString).attr("data-resource-id", resourceID).attr("data-type", iconType).css(ActiveText.Hotspots.Helper.getHotspotPositioningStyles(currentLoc, iconWidth, dimensions));
        newIcon.data(currentLoc);
        return newIcon;
    }

    return {
        createResourceIcon: createResourceIcon
    };
})();
