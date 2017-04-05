/* global ActiveText */
/**
 * @class DrawingToolsModel
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @constructor
 */
ActiveText.DrawingToolsModel = function(activeTextInstance) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_WIDTH = 996;

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_HEIGHT = 698;

    /**
     * @returns {number}
     */
    function getScale() {
        return 1 / ActiveText.ViewUtils.getScaleValue(activeTextInstance);
    }

    /**
     * @returns {{width: number, height: number}}
     */
    function getUnscaledResourceDimensions() {
        return {
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT
        };
    }

    return {
        getScale: getScale,
        getUnscaledResourceDimensions: getUnscaledResourceDimensions
    };
};