/* global ActiveText, BugClub */
ActiveText.namespace("BugClub.StructurePopup.Style");
BugClub.StructurePopup.Style = (function(ActiveText, BugClub) {
    "use strict";

    /**
     * @param scope {string}
     * @param theme {ActiveText.Theme}
     * @param width {number}
     * @returns {string}
     */
    function getStyle(activeTextInstance, scope, theme, width) {
        var indent = 20;

        if(!scope) {
            scope = "";
        }

        if(!theme) {
            theme = new ActiveText.Theme(activeTextInstance);
        }

        if(!width) {
            width = 480;
        }

        /**
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        var controlsOutlineColor = theme.getControlsOutlineColor();
        var popupBackgroundColor = theme.getPopupBackgroundColor();
        var linkBackgroundActiveColor = theme.getControlsForegroundHoverColor();
        var linkBackgroundHoverColor = theme.getControlsForegroundHoverColor(0.33);
        var useHoverStyles = !ActiveText.BrowserUtils.isMobileDevice;

        return scope + ".at-popover" +
            "{" +
            "position: absolute;" +
            "top: 0;" +
            "left: 0;" +
            "z-index: 1040;" +
            "display: none;" +
            "padding: 5px;" +
            "}" +
            scope + ".at-popover.top" +
            "{" +
            "margin-top: -5px;" +
            "}" +
            scope + ".at-popover.right" +
            "{" +
            "margin-left: 5px;" +
            "}" +
            scope + ".at-popover.bottom" +
            "{" +
            "margin-top: 5px;" +
            "}" +
            scope + ".at-popover.left" +
            "{" +
            "margin-left: -5px;" +
            "}" +
            scope + ".at-popover.top .arrow" +
            "{" +
            "bottom: 0;" +
            "left: 50%;" +
            "margin-left: -5px;" +
            "border-left: 5px solid transparent;" +
            "border-right: 5px solid transparent;" +
            "border-top: 5px solid " + controlsOutlineColor + ";" +
            "}" +
            scope + ".at-popover.right .arrow" +
            "{" +
            "top: 50%;" +
            "left: 0;" +
            "margin-top: -5px;" +
            "border-top: 5px solid transparent;" +
            "border-bottom: 5px solid transparent;" +
            "border-right: 5px solid " + controlsOutlineColor + ";" +
            "}" +
            scope + ".at-popover.bottom .arrow" +
            "{" +
            "top: 0;" +
            "left: 50%;" +
            "margin-left: -5px;" +
            "border-left: 5px solid transparent;" +
            "border-right: 5px solid transparent;" +
            "border-bottom: 5px solid " + controlsOutlineColor + ";" +
            "}" +
            scope + ".at-popover.left .arrow" +
            "{" +
            "top: 50%;" +
            "right: 0;" +
            "margin-top: -5px;" +
            "border-top: 5px solid transparent;" +
            "border-bottom: 5px solid transparent;" +
            "border-left: 5px solid " + controlsOutlineColor + ";" +
            "}" +
            scope + ".at-popover .arrow" +
            "{" +
            "position: absolute;" +
            "width: 0;" +
            "height: 0;" +
            "}" +
            "" +
            scope + ".at-popover-inner" +
            "{" +
            "padding: 3px;" +
            "overflow: hidden;" +
            "background: " + controlsOutlineColor + ";" +
            "background: " + theme.getControlsOutlineColor(0.8) + ";" +
            "-webkit-border-radius: 6px;" +
            "-moz-border-radius: 6px;" +
            "border-radius: 6px;" +
            "-webkit-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);" +
            "-moz-box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);" +
            "box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);" +
            "}" +
            scope + ".at-popover-content" +
            "{" +
            "padding: 0;" +
            "background-color: " + popupBackgroundColor + ";" +
            "-webkit-border-radius: 3px;" +
            "-moz-border-radius: 3px;" +
            "border-radius: 3px;" +
            "-webkit-background-clip: padding-box;" +
            "-moz-background-clip: padding-box;" +
            "background-clip: padding-box;" +
            "width:" + width + "px;" +
            "}" +
            scope + ".at-popover-content p," +
            scope + ".at-popover-content ul," +
            scope + ".at-popover-content ol" +
            "{" +
            "margin-bottom: 0; }" +
            ".structured-navigation-popup ul {" +
            "font-size:16px;" +
            "line-height:2em;" +
            "margin:0;" +
            "padding:0" +
            "}" +
            scope + ".list-container" +
            "{" +
            "overflow: scroll;" +
            "-webkit-overflow-scrolling: touch;" +
            "overflow-x:hidden;" +
            "overflow-y:auto;" +
            "height:250px;" +
            "padding:3px 0 4px;" +
            "margin:0 4px;" +
            "}" +
            scope + ".structured-navigation-popup ul li" +
            "{" +
            "margin:0;" +
            "text-align:left;" +
            "list-style: none;" +
            "line-height: 32px;" +
            "}" +
            scope + ".structured-navigation-popup ul ul li a" +
            "{" +
            "padding-left:30px !important;" +
            "width:" + (width - (indent * 3)) + "px !important;" +
            "}" +
            scope + ".structured-navigation-popup ul ul ul li a" +
            "{" +
            "padding-left:50px !important;" +
            "width:" + (width - (indent * 4)) + "px !important;" +
            "}" +
            scope + ".structured-navigation-popup ul ul ul ul li a" +
            "{" +
            "padding-left:70px !important;" +
            "width:" + (width - (indent * 5)) + "px !important;" +
            "}" +
            scope + ".structured-navigation-popup ul ul ul ul ul li a" +
            "{" +
            "padding-left:90px !important;" +
            "width:" + (width - (indent * 6)) + "px !important;" +
            "}" +
            scope + ".structured-navigation-popup ul li a," +
            scope + ".structured-navigation-popup ul li a:link," +
            scope + ".structured-navigation-popup ul li a:visited" +
            "{" +
            "text-decoration:none;" +
            "white-space: nowrap;" +
            "text-overflow: ellipsis;" +
            "display:inline-block;" +
            "padding:0 10px;" +
            "width:" + (width - (indent * 2)) + "px;" +
            "-webkit-border-radius: 3px;" +
            "-moz-border-radius: 3px;" +
            "border-radius: 3px;" +
            "color:" + theme.getTextColor() + ";" +
            '-webkit-transition: background .3s;' +
            '-moz-transition: background .3s;' +
            '-ms-transition: background .3s;' +
            '-o-transition: background .3s;' +
            'transition: background .3s;' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            "}" +
            ((useHoverStyles) ? scope + ".structured-navigation-popup ul li a:hover" +
                "{" +
                "background:" + linkBackgroundHoverColor + ";" +
                "-webkit-tap-highlight-color:" + linkBackgroundHoverColor + ";" +
                "}" : "") +
            scope + ".structured-navigation-popup ul li a:active," +
            scope + ".structured-navigation-popup ul li a:focus" +
            "{" +
            "background:" + linkBackgroundActiveColor + ";" +
            "}" +
            scope + " .structured-navigation-popup ul li {" +
            "line-height:41px;" +
            "}" +
            scope + " .status-icon" +
            "{" +
            "width:35px;" +
            "height:35px;" +
            "float:left;" +
            "margin:3px 1ex 3px 0;" +
            "-webkit-border-radius:50%;" +
            "-moz-border-radius:50%;" +
            "border-radius:50%;" +
            "}" +
            scope + " .status-icon." + BugClub.ActivitySummaryStates.INCOMPLETE +
            "{" +
            "background:white url(" + pathToResources + "img/bugclub/legacy/ks2/KS2_ActivityToggle_yellow_1.png) center center no-repeat;" +
            "}" +
            scope + " .status-icon." + BugClub.ActivitySummaryStates.PROGRESS +
            "{" +
            "background:white url(" + pathToResources + "img/bugclub/legacy/ks2/KS2_ActivityToggle_yellow_2.png) center center no-repeat;" +
            "}" +
            scope + " .status-icon." + BugClub.ActivitySummaryStates.COMPLETED +
            "{" +
            "background:white url(" + pathToResources + "img/bugclub/legacy/ks2/KS2_ActivityToggle_Green_face_yellow_1.png) center center no-repeat;" +
            "}" +
            scope + " .status-icon." + BugClub.ActivitySummaryStates.NONE +
            "{" +
            "background:transparent" +
            "}" +
            ".structure-container" +
            "{" +
            "display:inline-block;" +
            "position:relative" +
            "}";
    }

    return {
        getStyle: getStyle
    };
})(ActiveText, BugClub);
