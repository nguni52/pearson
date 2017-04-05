/* global ActiveText, requestAnimationFrame, Modernizr */
ActiveText.View.Model = function(activeTextInstance) {
    "use strict";

    var actualPageSettings, actualZoomAreaDimensions;

    /**
     * @type {number}
     */
    var magnificationValue = 1;

    /**
     * @type {string}
     */
    var currentDisplayScaleMode;

    /**
     * @type {boolean}
     */
    var cardMode = false;

    /**
     * @type {number}
     */
    var displayedPages;

    /**
     * @type {{pagesToDisplay: number, scaleMode: string, generatePageEdges: boolean, wmode: string}}
     */
    var defaultValues = {
        pagesToDisplay: 2,
        scaleMode: "fth",
        wmode: "window"
    };

    /**
     * @type {{width: number, height: number}}
     */
    var defaultZoomAreaDimensions = {
        width: 621,
        height: 783
    };

    /**
     * @type {{width: number, height: number, aspectRatio: number}}
     */
    var defaultPageSettings = {
        width: 600,
        height: 800,
        aspectRatio: 0.75
    };

    function parseDefaults() {
        var defaults = (activeTextInstance && activeTextInstance.options &&
            activeTextInstance.options.defaults) ? activeTextInstance.options.defaults : defaultValues;
        for(var prop in defaultValues) {
            if(defaults[prop] === undefined) {
                defaults[prop] = defaultValues[prop];
            }
        }
        var initialDisplayedPages = parseInt(defaults.pagesToDisplay, 10);
        if(!isNaN(initialDisplayedPages) || initialDisplayedPages < 1) {
            displayedPages = initialDisplayedPages;
        }

        var initialScaleMode = defaults.scaleMode;
        if(initialScaleMode !== undefined) {
            currentDisplayScaleMode = initialScaleMode;
        }

        if(defaults.wmode === undefined) {
            defaults.wmode = defaultValues.wmode;
        }

    }

    parseDefaults();

    function hasActualZoomAreaDimensions() {
        return actualZoomAreaDimensions !== undefined;
    }

    function getZoomAreaDimensions() {
        if(hasActualZoomAreaDimensions()) {
            return actualZoomAreaDimensions;
        } else {
            return defaultZoomAreaDimensions;
        }
    }

    function setZoomAreaDimensions(value) {
        actualZoomAreaDimensions = value;
    }

    function getPageDimensions() {
        if(actualPageSettings) {
            return actualPageSettings;
        } else {
            return defaultPageSettings;
        }
    }

    function setPageDimensions(newData) {
        var isDifferent = (newData === undefined || actualPageSettings === undefined ||
            newData.width !== actualPageSettings.width ||
            newData.height !== actualPageSettings.height || newData.aspectRatio !== actualPageSettings.aspectRatio);

        if(isDifferent) {
            actualPageSettings = newData;
            $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
        }
    }

    function getDisplayedPages() {
        return displayedPages;
    }

    function setDisplayedPages(value) {
        displayedPages = value;
    }

    function getMagnificationValue() {
        return magnificationValue;
    }

    function setMagnificationValue(value) {
        magnificationValue = value;
    }

    function getScaleMode() {
        return currentDisplayScaleMode;
    }

    function setScaleMode(value) {
        if(currentDisplayScaleMode !== value) {
            currentDisplayScaleMode = value;
            $(activeTextInstance).trigger(ActiveText.Events.CHANGE_SCALING_MODE, value);
        }
    }

    function setCardMode(mode) {
        cardMode = mode;
    }

    function returnCardMode() {
        return cardMode;
    }

    return {
        getPageDimensions: getPageDimensions,
        setPageDimensions: setPageDimensions,
        setZoomAreaDimensions: setZoomAreaDimensions,
        getZoomAreaDimensions: getZoomAreaDimensions,
        getDisplayedPages: getDisplayedPages,
        setDisplayedPages: setDisplayedPages,
        setScaleMode: setScaleMode,
        getScaleMode: getScaleMode,
        getMagnificationValue: getMagnificationValue,
        setMagnificationValue: setMagnificationValue,
        setCardMode: setCardMode,
        returnCardMode: returnCardMode
    };
};