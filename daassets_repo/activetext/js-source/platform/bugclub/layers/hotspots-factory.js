/* global ActiveText, BugClub, ActiveText, Modernizr */
ActiveText.namespace("BugClub.Hotspots.Factory");
BugClub.Hotspots.Factory = (function() {
    "use strict";

    function getIdFromURI(uri) {
        var uriData = ActiveText.DataUtils.parseURI(uri);
        var rtn = uri;
        if(uriData.id) {
            rtn = uriData.id;
        }
        if(uriData.seqid) {
            rtn = uriData.seqid;
        }
        return rtn;
    }

    function keyForIcon(iconType, defaultKeyStage) {
        var key = defaultKeyStage;
        var iconSuffix = iconType.split("-")[1];
        if(iconSuffix) {
            key = iconSuffix;
        }
        return key;
    }

    /**
     * @private
     * @param activeTextInstance {ActiveText}
     * @param hotspotDataObject {object}
     * @param containerDimensions {object}
     * @param key {string}
     * @returns {*|jQuery}
     */
    function createResourceIcon(activeTextInstance, hotspotDataObject, containerDimensions, options) {
        var key = keyForIcon(hotspotDataObject.data.icon, options.keyStage);

        /**
         * @private
         * @type {string}
         */
        var iconType = hotspotDataObject.data.icon;

        hotspotDataObject.data.id = getIdFromURI(hotspotDataObject.data.uri);

        /**
         * @private
         * @type {string}
         */
        var resourceID = hotspotDataObject.data.id;

        /**
         * @private
         * @type {number}
         */
        var xpos = hotspotDataObject.data.point[0];

        /**
         * @private
         * @type {number}
         */
        var ypos = hotspotDataObject.data.point[1];

        /**
         * @private
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        /**
         * @private
         * @type {string}
         */
        var htmlString = "";

        /**
         * @private
         * @type {number}
         */
        var iconWidth;

        if(key === "ks2") {
            iconWidth = 60;
        } else {
            iconWidth = 118;
        }

        if(key === "ks2") {
            htmlString = "<img class='bugclub_icon noSwipe' src='" + pathToResources +
                "img/bugclub/legacy/ks2/hotspots/state-2.png' width='" + iconWidth + "' height='" + iconWidth + "' />";
        } else {
            htmlString = "<img class='bugclub_icon noSwipe' src='" + pathToResources +
                "img/bugclub/legacy/ks1/hotspots/state-2.png' width='" + iconWidth + "' height='" + iconWidth + "' />";
        }

        var hotspotCSS = ActiveText.Hotspots.Helper.getHotspotPositioningStyles({
            data: {
                point: [xpos, ypos]
            }
        }, iconWidth, containerDimensions);

        var newIcon = $(htmlString).attr("data-resource-id", resourceID).attr("data-type", iconType).css(hotspotCSS);
        newIcon.data(hotspotDataObject);
        return newIcon;
    }

    return {
        createResourceIcon: createResourceIcon
    };
})();
