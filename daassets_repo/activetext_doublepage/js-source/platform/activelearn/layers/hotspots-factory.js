/* global ActiveText, ActiveText */
var ActiveLearn = ActiveLearn || {};
ActiveLearn.HotspotsFactory = (function() {
    'use strict';

    /**
     * @param activeTextInstance {object}
     * @param hotspotDataObject {object}
     * @param containerDimensions {object}
     * @returns {*|jQuery}
     */
    function createResourceIcon(activeTextInstance, hotspotDataObject, containerDimensions) {
        ActiveText.CSSUtils.embedCSS('.hotspot_icon div{cursor:pointer !important;}', 'activelearn-hotspots');

        var iconWidth = 60;
        var hotspotImageFilename = ActiveText.Hotspots.Helper.getDefaultFilenameFromHotspotData(hotspotDataObject, 'activelearn-doc');
        var htmlString = '<div class="hotspot_icon">' +
            '<img class="hotspot_icon" src="' + ActiveText.SkinUtils.getPathToResources(activeTextInstance) +
            'img/activelearn/hotspots/' + hotspotImageFilename + '" width="' + iconWidth + '" height="' + iconWidth +
            '" />' +
            '</div>';

        var newElement = $(htmlString);

        // keep the dimensionsData for resizing purposes on IE
        var dimensionsData = ActiveText.Hotspots.Helper.getHotspotPositioningStyles(hotspotDataObject, iconWidth, containerDimensions);
        newElement.css(dimensionsData);

        return newElement;
    }

    return {
        createResourceIcon: createResourceIcon
    };
})();
