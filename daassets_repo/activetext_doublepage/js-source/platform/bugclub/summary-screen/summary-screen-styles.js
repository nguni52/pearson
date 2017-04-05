/* global ActiveText, BugClub, Modernizr */
BugClub.SummaryScreen = BugClub.SummaryScreen || {};
BugClub.SummaryScreen.DialogStyleText = (function(ActiveText) {
    'use strict';

    function getStyle(activeTextInstance) {
        /**
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        var extension = 'png';
        if(Modernizr.svg) {
            extension = 'svg';
        }

        /**
         * @const
         * @type {string}
         */
        return '.ui-widget-content.summary-screenSVG' +
            '{' +
            'background:url(' + pathToResources + 'img/bugclub/popup1.' + extension +
            ') top left no-repeat transparent;' +
            'z-index:2010;' +
            'border:none;' +
            '-webkit-box-shadow:none;' +
            '-moz-box-shadow:none;' +
            'box-shadow:none;' +
            '}' +
            '.ui-widget-content.summary-screenSVG .content,' +
            '.ui-widget-content.summary-screenSVG .ui-dialog-titlebar' +
            '{' +
            'background:transparent !important' +
            '}' +
            '.ui-widget-content.summary-screenSVG .buttons' +
            '{' +
            'margin-top:75px;' +
            '}' +
            '.ui-widget-content.summary-screenSVG .button' +
            '{' +
            'margin:26px 26px 0;' +
            '}' +
            // hacks around vertical line bugs
            '.ui-dialog,' +
            '.ui-dialog *' +
            '{' +
            '-webkit-box-sizing:content-box;' +
            '-moz-box-sizing:content-box;' +
            'box-sizing:content-box;' +
            '}';
    }

    return {
        getStyle: getStyle
    };
})(ActiveText);
