/* global ActiveText, ActiveText, Modernizr */
ActiveText.View.Loader.Styles = function() {
    'use strict';

    function init(activeTextInstance) {
        var bgColor = activeTextInstance.theme.getBackgroundColor();
        var fgColor = activeTextInstance.theme.getControlsForegroundHoverColor();
        var keyColor = fgColor;
        if(bgColor === fgColor) {
            keyColor = activeTextInstance.theme.getControlsForegroundColor();
        }
        var cssStr = '#nprogress {' +
            'pointer-events:none;' +
            '-webkit-pointer-events:none;' +
            '}' +
            '#nprogress .bar {' +
            'background:' + keyColor + ';' +
            'position:absolute;' +
            'z-index:100;' +
            'top:0;' +
            'left:0;' +
            'width:100%;' +
            'height:4px;' +
            '}' +
            '/* Fancy blur effect */' +
            '#nprogress .peg {' +
            'display:block;' +
            'position:absolute;' +
            'right:0px;' +
            'width:100px;' +
            'height:100%;' +
            'box-shadow:0 0 10px ' + keyColor + ', 0 0 5px ' + keyColor + ';' +
            'opacity:1.0;' +
            '-webkit-transform:rotate(3deg) translate(0px, -4px);' +
            '-moz-transform:rotate(3deg) translate(0px, -4px);' +
            '-ms-transform:rotate(3deg) translate(0px, -4px);' +
            '-o-transform:rotate(3deg) translate(0px, -4px);' +
            'transform:rotate(3deg) translate(0px, -4px);' +
            '}' +
            '/* Remove these to get rid of the spinner */' +
            '#nprogress .spinner {' +
            'display:block;' +
            'position:absolute;' +
            'z-index:100;' +
            'top:15px;' +
            'right:15px;' +
            '}' +
            '.leftPage .spinner {' +
            'display:block;' +
            'position:absolute;' +
            //            'z-index:100;' +
            'top:50%;' +
            'left:25%;' +
            '}' +
            '.rightPage .spinner {' +
            'display:block;' +
            'position:absolute;' +
            //            'z-index:100;' +
            'top:50%;' +
            'left:75%;' +
            '}' +
            '#nprogress .spinner-icon,.leftPage .spinner-icon,.rightPage .spinner-icon {' +
            'width:14px;' +
            'height:14px;' +
            'border: solid 2px transparent;' +
            'border-top-color: ' + keyColor + ';' +
            'border-left-color:' + keyColor + ';' +
            'border-radius:10px;' +
            '-webkit-animation:nprogress-spinner 400ms linear infinite;' +
            '-moz-animation:nprogress-spinner 400ms linear infinite;' +
            '-ms-animation:nprogress-spinner 400ms linear infinite;' +
            '-o-animation:nprogress-spinner 400ms linear infinite;' +
            'animation:nprogress-spinner 400ms linear infinite;' +
            '}' +
            '@-webkit-keyframes nprogress-spinner {' +
            '0%   { -webkit-transform:rotate(0deg);   transform:rotate(0deg); }' +
            '100% { -webkit-transform:rotate(360deg); transform:rotate(360deg); }' +
            '}' +
            '@-moz-keyframes nprogress-spinner {' +
            '0%   { -moz-transform:rotate(0deg);   transform:rotate(0deg); }' +
            '100% { -moz-transform:rotate(360deg); transform:rotate(360deg); }' +
            '}' +
            '@-o-keyframes nprogress-spinner {' +
            '0%   { -o-transform:rotate(0deg);   transform:rotate(0deg); }' +
            '100% { -o-transform:rotate(360deg); transform:rotate(360deg); }' +
            '}' +
            '@-ms-keyframes nprogress-spinner {' +
            '0%   { -ms-transform:rotate(0deg);   transform:rotate(0deg); }' +
            '100% { -ms-transform:rotate(360deg); transform:rotate(360deg); }' +
            '}' +
            '@keyframes nprogress-spinner {' +
            '0%   { transform:rotate(0deg);   transform:rotate(0deg); }' +
            '100% { transform:rotate(360deg); transform:rotate(360deg); }' +
            '}';

        ActiveText.CSSUtils.embedCSS(cssStr, 'view-loader');
    }

    return {
        init: init
    };
};
