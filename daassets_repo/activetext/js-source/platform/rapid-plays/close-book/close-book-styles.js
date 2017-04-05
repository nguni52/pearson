/* global ActiveText, Modernizr */
var RapidPlays = RapidPlays || {};
RapidPlays.CloseBook = RapidPlays.CloseBook || {};
RapidPlays.CloseBook.DialogStyleText = (function(ActiveText) {
    'use strict';

    function getStyle(activeTextInstance) {

        var pathPrefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance) + 'img/rapid/';

        var extension = 'png';
        if(Modernizr.svg) {
            extension = 'svg';
        }

        /**
         * @const
         * @type {string}
         */
        return '.ui-widget-content.close-book' +
            '{' +
            'background: url(' + pathPrefix + 'closeBookPanel.' + extension + ') top left no-repeat;' +
            '-webkit-background-size:cover;' +
            '-moz-background-size:cover;' +
            '-o-background-size:cover;' +
            'background-size:cover;' +
            'z-index:2010;' +
            'border:none;' +
            '-webkit-box-shadow:none;' +
            '-moz-box-shadow:none;' +
            'box-shadow:none;' +
            '}' +
            '.ui-widget-content.close-book .ui-dialog-titlebar,' +
            '.ui-widget-content.close-book .ui-dialog-buttonpane' +
            '{' +
            'background:transparent;' +
            '}' +
            '.ui-widget-content.close-book .ui-dialog-content' +
            '{' +
            'background:transparent;' +
            '}' +
            '.ui-widget-content.close-book .ui-dialog-titlebar-close' +
            '{' +
            'display:none;' +
            '}' +
            '.ui-widget-content.close-book .content .button-close' +
            '{' +
            'margin-bottom: 10px;' +
            '}' +
            '.ui-widget-content.close-book .content .buttons' +
            '{' +
            'position:absolute;' +
            'width:198px;' +
            'top:0;' +
            'right:20px;' +
            'line-height:65px;' +
            '}' +
            '.ui-widget-content.close-book .content .buttons a' +
            '{' +
            'font-size:0;' +
            '}';
    }

    return {
        getStyle: getStyle
    };
})(ActiveText);
