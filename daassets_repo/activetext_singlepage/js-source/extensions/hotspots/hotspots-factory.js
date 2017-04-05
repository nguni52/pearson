/* global ActiveText, ActiveText */
ActiveText.namespace("ActiveText.Hotspots.Factory");
ActiveText.Hotspots.Factory = (function() {
    "use strict";
    /**
     * @param activeTextInstance {object}
     * @param hotspotDataObject {object}
     * @param containerDimensions {object}
     * @returns {*|jQuery}
     */
    function createHotspotIcon(activeTextInstance, hotspotDataObject, containerDimensions) {
        var iconWidth = 64;
        var hotspotImageFilename = ActiveText.Hotspots.Helper.getDefaultFilenameFromHotspotData(hotspotDataObject, "amiga");
        var htmlString = "<img class='hotspot_icon noSwipe' src='" + ActiveText.SkinUtils.getPathToGlobalResource() +
            "img/" + hotspotImageFilename + "' width='" + iconWidth + "' height='" + iconWidth + "' />";

        return $(htmlString).css(ActiveText.Hotspots.Helper.getHotspotPositioningStyles(hotspotDataObject, iconWidth, containerDimensions));
    }

    return {
        createHotspotIcon: createHotspotIcon
    };
})();
