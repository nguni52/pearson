/* global ActiveText, Innovation */
Innovation.StylesHelper = (function() {
    "use strict";

    function injectCSS(activeTextInstance) {
        var colorOne = '#FB2B69';
        var colorTwo = '#FF5B37';

        try {
            colorOne = activeTextInstance.options.scheme.colors[1];
            colorTwo = activeTextInstance.options.scheme.colors[0];
        }
        catch(err) {
            // do nothing
        }

        var svgFill = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="0" ' +
            'height="0" viewBox="0 0 10 10" enable-background="new 0 0 10 10" xml:space="preserve">' +
            '<linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="3.1816" y1="11.2905" x2="3.1816" y2="-1.091394e-10">' +
            '<stop offset="0" style="stop-color:' + colorOne + '"/>' +
            '<stop offset="1" style="stop-color:' + colorTwo + '"/>' +
            '</linearGradient>' +
            '</svg>';

        $('body').append(svgFill);

        activeTextInstance.options.scheme = {
            textColor: '#000000',
            controlColor: '#000000',
            controlHoverColor: '' + colorTwo + ''
        };

        var topColorHover = ActiveText.ColourUtils.convertHexToRGB(colorOne, 0.75);
        var bottomColorHover = ActiveText.ColourUtils.convertHexToRGB(colorTwo, 0.75);

        var topColor = ActiveText.ColourUtils.convertHexToRGB(colorOne, 1);
        var bottomColor = ActiveText.ColourUtils.convertHexToRGB(colorTwo, 1);

        var useHoverStyles = !ActiveText.BrowserUtils.isMobileDevice;

        var scope = activeTextInstance.options.containerElement.selector + ' ';
        var cssString = '.page-edge,.whiteboard-container{' +
            '-webkit-transition: all .3s ease-in-out;' +
            '-moz-transition: all .3s ease-in-out;' +
            '-o-transition: all .3s ease-in-out;' +
            'transition: all .3s ease-in-out;' +
            '-webkit-touch-callout: none;' +
            '-moz-user-select: none;' +
            '-khtml-user-select: none;' +
            '-webkit-user-select: none;' +
            '-o-user-select: none; ' +
            '}' +
            ((useHoverStyles) ?
                scope + '.page-edge a:hover,' + scope + '.controls-bar a.button:hover{' +
                'background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, ' + bottomColorHover +
                '),color-stop(1, ' + topColorHover + '));' +
                'background-image: -o-linear-gradient(bottom, ' + bottomColorHover + ' 0%, ' + topColorHover +
                ' 100%);' +
                'background-image: -moz-linear-gradient(bottom, ' + bottomColorHover + ' 0%, ' + topColorHover +
                ' 100%);' +
                'background-image: -webkit-linear-gradient(bottom, ' + bottomColorHover + ' 0%, ' + topColorHover +
                ' 100%);' +
                'background-image: -ms-linear-gradient(bottom, ' + bottomColorHover + ' 0%, ' + topColorHover +
                ' 100%);' +
                'background-image: linear-gradient(to bottom, ' + bottomColorHover + ' 0%, ' + topColorHover +
                ' 100%);' +
                '}' : "") +
            scope + '.page-edge a:active,' + scope + '.page-edge a:focus,' + scope + '.controls-bar a.button.active,' +
            scope + '.controls-bar a.button:active,' +
            scope + '.controls-bar a.button:focus{' +
            'background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, ' + bottomColor +
            '),color-stop(1, ' + topColor + '));' +
            'background-image: -o-linear-gradient(bottom, ' + bottomColor + ' 0%, ' + topColor + ' 100%);' +
            'background-image: -moz-linear-gradient(bottom, ' + bottomColor + ' 0%, ' + topColor + ' 100%);' +
            'background-image: -webkit-linear-gradient(bottom, ' + bottomColor + ' 0%, ' + topColor + ' 100%);' +
            'background-image: -ms-linear-gradient(bottom, ' + bottomColor + ' 0%, ' + topColor + ' 100%);' +
            'background-image: linear-gradient(to bottom, ' + bottomColor + ' 0%, ' + topColor + ' 100%);' +
            '}' +
            ((useHoverStyles) ?
                scope + '.page-edge a:hover svg polygon,' + scope + '.controls-bar a.button:hover svg path,' + scope +
                '.controls-bar a.button:hover svg polygon,' : "") + scope +
            '.page-edge a:active svg polygon,' + scope +
            '.page-edge a:focus svg polygon,' + scope +
            '.controls-bar a.button:active svg polygon,' + scope +
            '.controls-bar a.button:focus svg polygon,' + scope +
            '.controls-bar a.button.active svg polygon,' + scope +
            '.page-edge a:active svg path,' + scope +
            '.page-edge a:focus svg path,' + scope +
            '.controls-bar a.button.active svg path,' + scope +
            '.controls-bar a.button:focus svg path,' + scope +
            '.controls-bar a.button:active svg path{' +
            'fill:white;' +
            '}' +
            scope + 'a.innovation-2014,' +
            scope + 'a.innovation-2014:link,' +
            scope + 'a.innovation-2014:visited,' +
            scope + 'a.innovation-2014 svg polygon,' +
            scope + 'a.innovation-2014:link svg polygon,' +
            scope + 'a.innovation-2014:visited svg polygon {' +
            'text-decoration:none;' +
            'cursor:pointer;' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            '-webkit-border-radius: 21px;' +
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
            scope + 'a.innovation-2014:hover,' +
            scope + 'a.innovation-2014:focus,' +
            scope + 'a.innovation-2014:active,' +
            scope + 'a.innovation-2014:hover svg polygon,' +
            scope + 'a.innovation-2014:focus svg polygon,' +
            scope + 'a.innovation-2014:active svg polygon {' +
            'text-decoration:none;' +
            '}' +
            '.pull-right {' +
            'float:right;' +
            '}' +
            scope + 'a.innovation-2014.active,' +
            scope + 'a.innovation-2014.active:link,' +
            scope + 'a.innovation-2014.active:visited {' +
            'background: red;' +
            '}' +
            scope + 'a.innovation-2014.active:hover,' +
            scope + 'a.innovation-2014.active:focus,' +
            scope + 'a.innovation-2014.active:active {' +
            'color:red;' +
            '}' +
            scope + 'a.innovation-2014 i {' +
            'position:absolute' +
            '}' +
            scope + '.controls-bar img {' +
            'vertical-align:middle;' +
            '}';
        ActiveText.CSSUtils.embedCSS(cssString, 'page-edges');
    }

    return {
        injectCSS: injectCSS
    };
})();