/* global ActiveText */
/**
 * @class CSSUtils
 * @type CSSUtils
 * @memberOf ActiveText
 * @return {embedCSS:function}
 *
 * Manages CSS Style tag declarations - adds them to the head of the page, and if provided a key, ensures that there
 * is only ever one declaration of a style with the same key, overriding previous contents if necessary.
 */
ActiveText.CSSUtils = (function() {
    'use strict';

    var cssCache = {};

    /**
     * @param {string} cssString
     * @param {string} [key]
     */
    function embedCSS(cssString, key) {
        if(cssCache[key] !== undefined) {
            cssCache[key].parentNode.removeChild(cssCache[key]);
            cssCache[key] = undefined;
        }

        if(key === undefined || cssCache[key] === undefined) {
            var styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            if(styleElement.styleSheet) {
                styleElement.styleSheet.cssText = cssString;
            } else {
                styleElement.appendChild(document.createTextNode(cssString));
            }
            document.getElementsByTagName('head')[0].appendChild(styleElement);

            if(key !== undefined) {
                styleElement.setAttribute('data-css-reference', key);
                cssCache[key.toString()] = styleElement;
            }
        }
    }

    return {
        embedCSS: embedCSS
    };
})();
