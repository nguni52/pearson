/* global ActiveText*/
ActiveText.namespace("ActiveText.UI.BasicControls.Style");
ActiveText.UI.BasicControls.Style = (function() {
    "use strict";

    /**
     * @param scope {string}
     * @param theme {ActiveText.Theme}
     * @returns {string}
     */
    function getStyle(scope, theme) {
        var foregroundColor = theme.getControlsForegroundColor();
        var foregroundHoverColor = theme.getControlsForegroundHoverColor();
        var rtn = scope + 'a.activetext-default,' +
            scope + 'a.activetext-default:link,' +
            scope + 'a.activetext-default:visited,' +
            scope + 'a.activetext-default svg polygon,' +
            scope + 'a.activetext-default:link svg polygon,' +
            scope + 'a.activetext-default:visited svg polygon {' +
            'text-decoration:none;' +
            'color:' + foregroundColor + ';' +
            'fill:' + foregroundColor + ';' +
            'cursor:pointer;' +
            //            '-webkit-transition: color .3s;' +
            //            '-khtml-transition: color .3s;' +
            //            '-moz-transition: color .3s;' +
            //            '-ms-transition: color .3s;' +
            //            '-o-transition: color .3s;' +
            //            'transition: color .3s;' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-khtml-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            'background: ' + foregroundHoverColor + ';' +
            '-webkit-border-radius: 21px;' +
            '-khtml-border-radius: 21px;' +
            '-moz-border-radius: 21px;' +
            '-ms-border-radius: 21px;' +
            '-o-border-radius: 21px;' +
            'border-radius: 21px;' +
            'margin: 4px 0;' +
            'width: 42px;' +
            'height: 42px;' +
            'line-height: 1.3em !important;' +
            'display:inline-block' +
            '}' +
            scope + 'a.activetext-default:hover,' +
            scope + 'a.activetext-default:focus,' +
            scope + 'a.activetext-default:active,' +
            scope + 'a.activetext-default:hover svg polygon,' +
            scope + 'a.activetext-default:focus svg polygon,' +
            scope + 'a.activetext-default:active svg polygon {' +
            'text-decoration:none;' +
            'color:' + foregroundHoverColor + ';' +
            'fill:' + foregroundHoverColor + ';' +
            'background:' + foregroundColor + '' +
            '}' +
            '.pull-right {' +
            'float:right;' +
            '}' +
            scope + 'a.activetext-default.active,' +
            scope + 'a.activetext-default.active:link,' +
            scope + 'a.activetext-default.active:visited {' +
            'background: red;' +
            '}' +
            scope + 'a.activetext-default.active:hover,' +
            scope + 'a.activetext-default.active:focus,' +
            scope + 'a.activetext-default.active:active {' +
            'color:red;' +
            'background:' + foregroundColor +
            '}' +
            '}' +
            scope + 'a.activetext-default i {' +
            //            scope + 'a.activetext-default svg {' +
            'position:absolute' +
            '}' +
            scope + '.controls-bar img {' +
            'vertical-align:middle;' +
            '}' +
            '.playbackDiv {' +
            'width: 85px;' +
            'height: 42px;' +
            'position: absolute;' +
            'left: -100px;' +
            'margin-top: 4px;' +
            'text-align: center;' +
            'background: url(/static/img/rapid/ButtonsBackground.svg) no-repeat center center/contain;' +
            '}' +
            '.button.record, .button.play {' +
            'z-index: 1010;' +
            'margin-top: -1px;' +
            '}' +
            '.button.record img {' +
            'margin-left: 7px;' +
            '}' +
            '.button.play img {' +
            'margin-left: 2px;' +
            '}' +
            '.recordingWidget {' +
            'bottom: 0;' +
            'height: 174px;' +
            'left: 0;' +
            'margin: auto;' +
            'position: absolute;' +
            'top: 0;' +
            'right: 0;' +
            'width: 467px;' +
            'z-index: 999;' +
            '}' +
            '.tooltip {' +
            'position: absolute;' +
            'z-index: 1030;' +
            'display: block;' +
            'font-size: 13px;' +
            'line-height: 1.4;' +
            'opacity: 0;' +
            'filter: alpha(opacity=0);' +
            'visibility: visible;' +
            'padding-bottom:1em;' +
            '-webkit-box-sizing: content-box;' +
            '-moz-box-sizing: content-box;' +
            'box-sizing: content-box;' +
            '}' +
            '.tooltip.in {' +
            'opacity: 0.8;' +
            'filter: alpha(opacity=80);' +
            '}' +
            '.tooltip.top {' +
            'padding: 5px 0;' +
            'margin-top: -3px;' +
            '}' +
            '.tooltip-inner {' +
            'max-width: 200px;' +
            'padding: 8px;' +
            'color: #ffffff;' +
            'text-align: center;' +
            'text-decoration: none;' +
            'background-color: #000000;' +
            '-webkit-border-radius: 4px;' +
            '-moz-border-radius: 4px;' +
            'border-radius: 4px;' +
            'max-height: 1.4em;' +
            'text-overflow: ellipsis;' +
            'white-space: nowrap;' +
            '-webkit-box-sizing: content-box;' +
            '-moz-box-sizing: content-box;' +
            'box-sizing: content-box;' +
            '}' +
            '.tooltip-arrow {' +
            'position: absolute;' +
            'width: 0;' +
            'height: 0;' +
            'border-color: transparent;' +
            'border-style: solid;' +
            '-webkit-box-sizing: content-box;' +
            '-moz-box-sizing: content-box;' +
            'box-sizing: content-box;' +
            '}' +
            '.tooltip.top .tooltip-arrow {' +
            'bottom: 0;' +
            'left: 50%;' +
            'margin-left: -5px;' +
            'border-top-color: #000000;' +
            'border-width: 5px 5px 0;' +
            '}' +
            '.fade {' +
            'opacity: 0;' +
            '-webkit-transition: opacity 0.15s linear;' +
            '-moz-transition: opacity 0.15s linear;' +
            'transition: opacity 0.15s linear;' +
            '}' +
            '.fade.in {' +
            'opacity: 1;' +
            '}';
        return rtn;
    }

    return {
        getStyle: getStyle
    };
})();
