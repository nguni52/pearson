/* global ActiveText */
ActiveText.Hotspots.Helper = (function() {
    'use strict';

    function getHotspotPositioningStyles(hotspotDataObject, iconWidth) {
        var xPos = hotspotDataObject.data.point[0];
        var yPos = hotspotDataObject.data.point[1];
        var position = 'absolute';
        if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
            position = 'relative';
        }

        return {
            marginLeft: xPos - (iconWidth / 2),
            marginTop: yPos - (iconWidth / 2),
            pointerEvents: 'all',
            position: position,
            zIndex: 1010,
            cursor: 'pointer'
        };
    }

    /**
     * @param hotspotDataObject
     * @param defaultValue {string}
     * @returns {string}
     */
    function getDefaultFilenameFromHotspotData(hotspotDataObject, defaultValue) {
        var icon = defaultValue;
        if(hotspotDataObject && hotspotDataObject.data && hotspotDataObject.data.icon) {
            icon = hotspotDataObject.data.icon;
        }
        return icon + '-default.png';
    }

    function returnCharacterFromUri(uri) {
        return uri.replace(/[\bcharacter\b]*[^\w-]/gi, '');
    }

    return {
        getHotspotPositioningStyles: getHotspotPositioningStyles,
        getDefaultFilenameFromHotspotData: getDefaultFilenameFromHotspotData,
        returnCharacterFromUri: returnCharacterFromUri
    };
})();
