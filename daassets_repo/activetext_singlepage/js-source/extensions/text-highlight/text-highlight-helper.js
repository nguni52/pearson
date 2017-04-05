/* global ActiveText, setTimeout */
/**
 * @class TextHighlightHelper
 * @memberOf ActiveText
 * @returns {{getSelectionClassName:Function}}
 */
ActiveText.TextHighlightHelper = (function() {
    'use strict';

    /**
     * @returns {string}
     */
    function getSelectionClassName() {
        return '-epub-overlay-active';
    }

    return {
        getSelectionClassName: getSelectionClassName
    };
})();