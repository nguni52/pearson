/* global ActiveText, BugClubAus, Modernizr */
BugClubAus.SummaryScreen = BugClubAus.SummaryScreen || {};
BugClubAus.SummaryScreen.DialogStyleText = (function(ActiveText) {
    'use strict';

    function getStyle(activeTextInstance) {
        /**
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        /**
         * @const
         * @type {string}
         */
        return '.ui-widget-content.summary-screen{' +
            'background:url(' + pathToResources +
            'img/bugclub/legacy/ks1/pupil/Canvas_closeBook_backgroundSkin.png) top left no-repeat;' +
            'z-index:2010;' +
            'border:none;' +
            '-webkit-box-shadow:none;' +
            '-moz-box-shadow:none;' +
            'box-shadow:none;' +
            '}' +
            '.ui-widget-content.summary-screen .ui-dialog-titlebar,.ui-widget-content.summary-screen .ui-dialog-buttonpane{' +
            'background:transparent;' +
            '}' +
            '.ui-widget-content.summary-screen .ui-dialog-content{' +
            'background:transparent;' +
            '}' +
            '.ui-widget-content.summary-screen .ui-dialog-titlebar-close{' +
            'display:none;' +
            '}' +
            '.ui-widget-content.summary-screen .content .summary-icons{' +
            'position:absolute;' +
            'top:56px;' +
            'left:50px;' +
            'right:50px;' +
            'height:64px;' +
            '}' +
            '.ui-widget-content.summary-screen.ks1 .content .bug{' +
            'margin:220px 0 0 30px;' +
            '}' +
            '.ui-widget-content.summary-screen.ks2 .content .bug{' +
            'margin:180px 0 0 50px;' +
            '}' +
            '.ui-widget-content.summary-screen .content .button-close{' +
            'margin-left:1em;' +
            '}' +
            '.ui-widget-content.summary-screen .content .button-keep-reading{' +
            'background:url(' + pathToResources +
            'img/bugclub/legacy/ks1/pupil/Button_keepReading_downSkin.png) top left no-repeat;' +
            'width:260px;' +
            'height:81px;' +
            '}' +
            '.ui-widget-content.summary-screen.ks1 .content .buttons{' +
            'position:absolute;' +
            'bottom:70px;' +
            'right:30px;' +
            '}' +
            '.ui-widget-content.summary-screen.ks2 .content .buttons{' +
            'position:absolute;' +
            'bottom:90px;' +
            'right:80px;' +
            '}' +
            '.ui-widget-content.summary-screen .content .buttons a{' +
            'margin-left:1em;' +
            'outline:0;' +
            'border:none;' +
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
