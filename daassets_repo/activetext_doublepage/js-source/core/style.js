/* global ActiveText, ActiveText, Modernizr */
/**
 * @class Style
 * @memberOf ActiveText
 * @returns {{init: embedCSSStyles}}
 * @constructor
 */
ActiveText.Style = function() {
    'use strict';

    function embedCSSStyles() {
        var isOldVersionOfMSIE = ($.browser.msie && parseInt($.browser.version, 10) < 10);
        var displayVal = (isOldVersionOfMSIE) ? 'none' : 'block';
        var ctpHover = Modernizr.rgba ? 'background:rgba(255,255,0,0.4);fill:rgba(255,255,0,0.4);' : 'border:1px solid yellow;';
        var targetAreaDefaultHover = Modernizr.rgba ? 'background:rgba(237,0,140,0.4);fill:rgba(237,0,140,0.6);border:3px solid rgb(237,0,140) !important;stroke-width:4px;stroke:rgb(237,0,140);' : 'border:3px solid rgb(237,0,140);';
        var targetAreaDefaultActive = Modernizr.rgba ? 'background:rgba(237,0,140,0.1);fill:rgba(237,0,140,0.2);border:3px solid rgb(237,0,140) !important;stroke-width:4px;stroke:rgb(237,0,140);' : 'border:3px solid rgb(237,0,140);';
        targetAreaDefaultHover = Modernizr.touch ? '' : targetAreaDefaultHover;

        var cssStr = '.view-loader-overlay{' +
            'display:' + displayVal + ';' +
            'top:0;' +
            'left:0;' +
            'width:100%;' +
            'height:100%;' +
            'background:white;' +
            'z-index:1000;' +
            'position:absolute;' +
            '-webkit-transition:opacity 0.5s linear;' +
            '-moz-transition:opacity 0.5s linear;' +
            'transition:opacity 0.5s linear;' +
            'pointer-events:none;' +
            '}' +
            '* {' +
            '-webkit-box-sizing: border-box;' +
            '-moz-box-sizing: border-box;' +
            'box-sizing: border-box;' +
            '}' +
            '.character-selected {' +
            targetAreaDefaultActive +
            '}' +
            '.ctp:hover {' +
            ctpHover +
            '}' +
            '.charSelect polygon:hover,.charSelect img:hover {' +
            targetAreaDefaultHover +
            '}' +
            '.activetext [aria-hidden="true"] { visibility: hidden; }';

        ActiveText.CSSUtils.embedCSS(cssStr, 'activetext-main');
    }

    return {
        init: embedCSSStyles
    };
};
