/* global ActiveText */
/**
 * @class TextHighlightSettings
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{getDefaultHighlightColor: Function}}
 * @constructor
 */
ActiveText.TextHighlightSettings = function(activeTextInstance) {
    'use strict';

    /**
     * @type {String}
     */
    var defaultHighlightColor = 'yellow';

    function getDefaultHighlightColor() {
        return defaultHighlightColor;
    }

    function init() {
        $(activeTextInstance).on(ActiveText.Settings.Events.LOADED, setTextHighlightDefaultColourFromData);
    }

    function setTextHighlightDefaultColourFromData(event, data) {
        if(data.defaultHighlightColor !== undefined && data.defaultHighlightColor !== null) {
            defaultHighlightColor = data.defaultHighlightColor;
        }
    }

    init();

    /**
     * @type {{getDefaultHighlightColor: Function}}
     */
    var api = {
        getDefaultHighlightColor: getDefaultHighlightColor
    };

    return api;
};