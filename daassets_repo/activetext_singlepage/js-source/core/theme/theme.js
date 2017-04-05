/* global ActiveText */
/**
 * @class Theme
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{getBackgroundColor: getBackgroundColor, getForegroundColor: getForegroundColor, getDisabledColor: getDisabledColor, getControlsBackgroundColor: getControlsBackgroundColor, getControlsForegroundColor: getControlsForegroundColor, getControlsAltForegroundColor: getControlsAltForegroundColor, getControlsForegroundHoverColor: getControlsForegroundHoverColor, getControlsAltForegroundHoverColor: getControlsAltForegroundHoverColor, getPageBackgroundColor: getPageBackgroundColor, getControlsOutlineColor: getControlsOutlineColor, getTextColor: getTextColor, getPopupBackgroundColor: getPopupBackgroundColor, getWidgetBackgroundColour: getWidgetBackgroundColour, getWidgetBorderColour: getWidgetBorderColour, getWidgetCloseBackgroundColour: getWidgetCloseBackgroundColour, getWidgetCloseBorderColour: getWidgetCloseBorderColour, getWidgetCloseHoverColour: getWidgetCloseHoverColour, getWidgetTitleColour: getWidgetTitleColour}}
 * @constructor
 */
ActiveText.Theme = function(activeTextInstance) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_BACKGROUND_COLOUR = '#ffffff';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_DISABLED_EDGE_COLOUR = '#e5e5e5';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_EDGE_COLOUR = '#2699cf';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_ICON_COLOUR = '#ffffff';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_BAR_BACKGROUND_COLOUR = '#000000';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WHITEBOARD_BACKGROUND_COLOUR = '#eeeeee';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_ICON_COLOUR_HOVER_SIMPLE = '#2699cf';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WIDGET_BACKGROUND_COLOUR = '#ffffff';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WIDGET_BORDER_COLOUR = '#363636';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WIDGET_CLOSE_BACKGROUND_COLOUR = '#ffffff';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WIDGET_CLOSE_BORDER_COLOUR = '#000000';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WIDGET_CLOSE_HOVER_COLOUR = '#cf3616';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_WIDGET_TITLE_COLOUR = '#000000';

    /**
     * @param color {string}
     * @return {Boolean}
     */
    function isHex(color) {
        return color.indexOf('#') !== -1;
    }

    /**
     * @param color {string}
     * @param opacity {Number=}
     * @return {string}
     */
    function fixColour(color, opacity) {
        var rtn = color;
        var supportsRGBA = $('html').hasClass('rgba');
        if(isHex(color)) {
            if(supportsRGBA) {
                rtn = ActiveText.ColourUtils.convertHexToRGB(color, opacity);
            }
        }
        return rtn;
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getPageBackgroundColor(opacity) {
        var color = parseColor('pageBackgroundColor', DEFAULT_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getBackgroundColor(opacity) {
        var color = parseColor('backgroundColor', DEFAULT_WHITEBOARD_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getForegroundColor(opacity) {
        var color = parseColor('color', DEFAULT_EDGE_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param keyword {string}
     * @param defaultValue {string}
     * @return {string}
     */
    function parseColor(keyword, defaultValue) {
        var targetColor = defaultValue;
        if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.scheme &&
            activeTextInstance.options.scheme[keyword]) {
            targetColor = activeTextInstance.options.scheme[keyword];
        }
        return targetColor;
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getDisabledColor(opacity) {
        var color = parseColor('disabledColor', DEFAULT_DISABLED_EDGE_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getControlsBackgroundColor(opacity) {
        var color = parseColor('controlBackgroundColor', DEFAULT_BAR_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getPopupBackgroundColor(opacity) {
        var color = parseColor('popupBackgroundColor', DEFAULT_ICON_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getControlsOutlineColor(opacity) {
        var color = parseColor('controlOutlineColor', DEFAULT_BAR_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getTextColor(opacity) {
        var color = parseColor('textColor', DEFAULT_BAR_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getControlsForegroundColor(opacity) {
        var color = parseColor('controlColor', DEFAULT_ICON_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getControlsAltForegroundColor(opacity) {
        var color = parseColor('altControlColor', DEFAULT_ICON_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getControlsForegroundHoverColor(opacity) {
        var color = parseColor('controlHoverColor', DEFAULT_ICON_COLOUR_HOVER_SIMPLE);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getControlsAltForegroundHoverColor(opacity) {
        var color = parseColor('altControlHoverColor', DEFAULT_ICON_COLOUR_HOVER_SIMPLE);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getWidgetBackgroundColour(opacity) {
        var color = parseColor('widgetBackgroundColour', DEFAULT_WIDGET_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getWidgetBorderColour(opacity) {
        var color = parseColor('widgetBorderColour', DEFAULT_WIDGET_BORDER_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getWidgetCloseBackgroundColour(opacity) {
        var color = parseColor('widgetCloseBackgroundColour', DEFAULT_WIDGET_CLOSE_BACKGROUND_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getWidgetCloseBorderColour(opacity) {
        var color = parseColor('widgetCloseBorderColour', DEFAULT_WIDGET_CLOSE_BORDER_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getWidgetCloseHoverColour(opacity) {
        var color = parseColor('widgetCloseHoverColour', DEFAULT_WIDGET_CLOSE_HOVER_COLOUR);
        return fixColour(color, opacity);
    }

    /**
     * @param opacity {Number=}
     * @return {string}
     */
    function getWidgetTitleColour(opacity) {
        var color = parseColor('widgetTitleColour', DEFAULT_WIDGET_TITLE_COLOUR);
        return fixColour(color, opacity);
    }

    return  {
        getBackgroundColor: getBackgroundColor,
        getForegroundColor: getForegroundColor,
        getDisabledColor: getDisabledColor,
        getControlsBackgroundColor: getControlsBackgroundColor,
        getControlsForegroundColor: getControlsForegroundColor,
        getControlsAltForegroundColor: getControlsAltForegroundColor,
        getControlsForegroundHoverColor: getControlsForegroundHoverColor,
        getControlsAltForegroundHoverColor: getControlsAltForegroundHoverColor,
        getPageBackgroundColor: getPageBackgroundColor,
        getControlsOutlineColor: getControlsOutlineColor,
        getTextColor: getTextColor,
        getPopupBackgroundColor: getPopupBackgroundColor,
        getWidgetBackgroundColour: getWidgetBackgroundColour,
        getWidgetBorderColour: getWidgetBorderColour,
        getWidgetCloseBackgroundColour: getWidgetCloseBackgroundColour,
        getWidgetCloseBorderColour: getWidgetCloseBorderColour,
        getWidgetCloseHoverColour: getWidgetCloseHoverColour,
        getWidgetTitleColour: getWidgetTitleColour
    };
};