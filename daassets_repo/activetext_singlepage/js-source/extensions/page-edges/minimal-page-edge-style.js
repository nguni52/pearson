/* global ActiveText */
ActiveText.namespace('ActiveText.MinimalPageEdgeFactory.Style');
ActiveText.MinimalPageEdgeFactory.Style = (function() {
    'use strict';

    function getStyle(activeTextInstance) {
        var edgeColor = activeTextInstance.theme.getControlsForegroundColor();
        var overlapEdgeColor = activeTextInstance.theme.getControlsAltForegroundColor();
        var backgroundColor = activeTextInstance.theme.getPageBackgroundColor(0.5);
        var hoverColor = activeTextInstance.theme.getControlsForegroundHoverColor();
        var altHoverColor = activeTextInstance.theme.getControlsAltForegroundHoverColor();
        var scope = activeTextInstance.options.containerElement.selector + ' ';
        var useHoverStyles = !ActiveText.BrowserUtils.isMobileDevice;

        return scope + '.minimal-edge,' +
            scope + '.minimal-edge a' +
            '{' +
            'text-decoration:none;' +
            'color:' + overlapEdgeColor + ';' +
            '-webkit-transition: all .3s;' +
            '-moz-transition: all .3s;' +
            '-ms-transition: all .3s;' +
            '-o-transition: all .3s;' +
            'transition: all .3s;' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            'font-family: "Segoe UI", Tahoma, sans-serif;' +
            'outline:none;' +
            '}' +
            scope + '.minimal-edge a,' +
            scope + '.minimal-edge a:link,' +
            ((useHoverStyles) ? scope + '.minimal-edge a:hover,' : '') +
            scope + '.minimal-edge a:active,' +
            scope + '.minimal-edge a:focus ' +
            '{' +
            'background-color:transparent;' +
            'text-decoration:none;' +
            '}' +
            scope + '.minimal-edge a i {' +
            'font-style:normal;' +
            '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";' +
            'filter:alpha(opacity=50);' +
            'opacity:0.5;' +
            '}' +
            scope + '.minimal-edge.overlap,' +
            scope + '.minimal-edge.overlap a' +
            '{' +
            'color:' + edgeColor + ';' +
            '}' +
            scope + '.minimal-edge.disabled a,' +
            ((useHoverStyles) ? '.minimal-edge.disabled a:hover,' : '') +
            scope + '.minimal-edge.disabled a:active,' +
            scope + '.minimal-edge.disabled a:focus' +
            '{' +
            'cursor:default;' +
            'color:transparent' +
            '}' +
            ((useHoverStyles) ? scope + '.minimal-edge a:hover,' : '') +
            scope + '.minimal-edge a:active,' +
            scope + '.minimal-edge a:focus' +
            '{' +
            'color:' + hoverColor + ';' +
            'background-color:' + backgroundColor + ';' +
            'cursor:pointer;' +
            '-webkit-transition: all .3s;' +
            '-moz-transition: all .3s;' +
            '-ms-transition: all .3s;' +
            '-o-transition: all .3s;' +
            'transition: all .3s;' +
            '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";' +
            'filter:alpha(opacity=50);' +
            '}' +
            ((useHoverStyles) ? scope + '.minimal-edge a:hover i,' : '') +
            scope + '.minimal-edge a:active i,' +
            scope + '.minimal-edge a:focus i' +
            '{' +
            '-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";' +
            'filter:alpha(opacity=100);' +
            'opacity:1;' +
            '}' +
            ((useHoverStyles) ? scope + '.minimal-edge.overlap a:hover,' : '') +
            scope + '.minimal-edge.overlap a:active,' +
            scope + '.minimal-edge.overlap a:focus' +
            '{' +
            'color:' + altHoverColor + ';' +
            '}' +
            scope + '.minimal-edge.disabled,' +
            scope + '.minimal-edge.disabled a:link,' +
            ((useHoverStyles) ? scope + '.minimal-edge.disabled a:hover,' : '') +
            scope + '.minimal-edge.disabled a:active,'
            + scope + '.minimal-edge.disabled a:focus' +
            '{' +
            'color:transparent;' +
            'cursor:default;' +
            'background-color:transparent;' +
            '}';
    }

    return {
        getStyle: getStyle
    };
})();
