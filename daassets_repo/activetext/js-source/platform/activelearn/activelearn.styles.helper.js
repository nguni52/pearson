/* global ActiveText, Modernizr */
var ActiveLearn = ActiveLearn || {};
ActiveLearn.StylesHelper = (function() {
    "use strict";

    function embedStyles(activeTextInstance) {
        activeTextInstance.options.scheme = {
            color: '#E6E5E5',
            textColor: '#C95116',
            controlColor: '#777E7D',
            controlHoverColor: '#C95116'
        };

        activeTextInstance.options.containerElement.css({
            background: '#E6E5E5'
        });

        var cssStr;
        if(Modernizr.boxshadow) {
            cssStr = '.whiteboard-container' +
                '{' +
                '-webkit-box-shadow: 0px 4px 7px #777E7D;' +
                '-moz-box-shadow: 0px 4px 7px #777E7D;' +
                'box-shadow: 0px 4px 7px #777E7D' +
                '}';
        } else {
            cssStr = '.whiteboard-container' +
                '{' +
                'outline : 1px solid #777E7D' +
                '}';
        }

        var useHoverStyles = !ActiveText.BrowserUtils.isMobileDevice;
        var scope = activeTextInstance.options.containerElement.selector + ' ' + '.controls-bar ';

        cssStr += '.controls-bar,' +
            '.controls-bar *' +
            '{' +
            '-webkit-box-sizing:border-box;' +
            '-moz-box-sizing:border-box;' +
            'box-sizing:border-box;' +
            '}' +
            '.controls-bar .activelearn.button' +
            '{' +
            'width:50px;' +
            'height:49px;' +
            'border:0 solid #E6E5E5;' +
            'border-left-width:1px;' +
            '-webkit-border-radius:0;' +
            '-moz-border-radius:0;' +
            '-ms-border-radius:0;' +
            'border-radius:0;' +
            'font-size:22px;' +
            'color:#777E7D;' +
            'text-decoration:none;' +
            '}' +
            '.controls-bar .activelearn.button.active.viewtoggle,' +
            '.controls-bar .activelearn.button.active.zoom' +
            '{' +
            'color:#777E7D;' +
            '}' +
            '.controls-bar .activelearn.button.active.viewtoggle:hover,' +
            '.controls-bar .activelearn.button.active.zoom:hover' +
            '{' +
            'color:#C95116;' +
            '}' +
            ((useHoverStyles) ? '.controls-bar .activelearn.button:hover,' : '') +
            '.controls-bar .activelearn.button:focus,' +
            '.controls-bar .activelearn.button.selected.next,' +
            '.controls-bar .activelearn.button.selected.previous,' +
            '.controls-bar .activelearn.button:active,' +
            '.controls-bar .activelearn.button.active' +
            '{' +
            'color:#C95116;' +
            '}' +
            '.controls-bar .activelearn.button.contents.open' +
            '{' +
            'background:white;' +
            '}' +
            '.controls-bar .activelearn.button:active i' +
            '{' +
            '-webkit-transition: all .3s;' +
            '-moz-transition: all .3s;' +
            '-ms-transition: all .3s;' +
            '-o-transition: all .3s;' +
            'transition: all .3s;' +
            '-webkit-transform:scale(0.8);' +
            '-moz-transform:scale(0.8);' +
            'transform:scale(0.8);' +
            '}' +
            '.controls-bar .control' +
            '{' +
            'font-size:12px;' +
            '}' +
            '.controls-bar .activelearn.button.next i,' +
            '.controls-bar .activelearn.button.previous i' +
            '{' +
            'font-size:32px;' +
            'vertical-align:middle;' +
            '}' +
            '.controls-bar .activelearn.button.note i' +
            '{' +
            '-webkit-transform:scaleY(-0.9);' +
            '-moz-transform:scaleY(-0.9);' +
            '-ms-transform:scaleY(-0.9);' +
            'transform:scaleY(-0.9);' +
            '}' +
            '.controls-bar .activelearn.button.last' +
            '{' +
            'border-right-width:1px;' +
            '}' +
            scope + '.at-popover.top .arrow' +
            '{' +
            'border-left:none;' +
            'border-right:none;' +
            'width:49px;' +
            'margin-left:-24px;' +
            'border-top:7px solid #fff;' +
            '}' +
            scope + '.at-popover,' +
            scope + '.at-popover *' +
            '{' +
            '-webkit-box-sizing:content-box;' +
            '-moz-box-sizing:content-box;' +
            'box-sizing:content-box;' +
            '}' +
            scope + '.list-container' +
            '{' +
            'margin:0;' +
            'padding:0;' +
            '}' +
            scope + '.at-popover' +
            '{' +
            'padding:1px;' +
            'padding-bottom:7px;' +
            '}' +
            scope + '.at-popover.top' +
            '{' +
            'margin-top:6px;' +
            '}' +
            scope + '.at-popover-inner' +
            '{' +
            'background:white;' +
            '-webkit-border-radius:2px;' +
            '-moz-border-radius:2px;' +
            'border-radius:2px;' +
            'padding:0;' +
            '-webkit-box-shadow: 0 -2px 7px rgba(0,0,0,.3);' +
            '-moz-box-shadow: 0 -2px 7px rgba(0,0,0,.3);' +
            '-ms-box-shadow: 0 -2px 7px rgba(0,0,0,.3);' +
            'box-shadow: 0 -2px 7px rgba(0,0,0,.3);' +
            '}' +
            scope + '.structured-navigation-popup ul li' +
            '{' +
            'border-bottom:1px solid #E6E5E5;' +
            'font-size:12px;' +
            '}' +
            scope + '.structured-navigation-popup ul li.last' +
            '{' +
            'border-bottom:none;' +
            '}' +
            // list item styles
            scope + '.structured-navigation-popup ul li' +
            '{' +
            'margin:0;' +
            'line-height: 26px;' +
            'padding:3px 0;' +
            '}' +
            scope + '.structured-navigation-popup ul li a,' +
            scope + '.structured-navigation-popup ul li a:link,' +
            scope + '.structured-navigation-popup ul li a:visited' +
            '{' +
            '-webkit-box-sizing:border-box;' +
            '-moz-box-sizing:border-box;' +
            'box-sizing:border-box;' +
            'white-space: inherit;' +
            'padding:0 10px;' +
            'width:100%;' +
            '-webkit-border-radius: 0;' +
            '-moz-border-radius: 0;' +
            'border-radius: 0;' +
            'color:#333;' +
            '}' +
            ((useHoverStyles) ? (scope + '.structured-navigation-popup ul li a:hover,') : ('')) +
            scope + '.structured-navigation-popup ul li a:active,' +
            scope + '.structured-navigation-popup ul li a:focus' +
            '{' +
            'color:#C95116;' +
            'background:white;' +
            'outline:none;' +
            '}' +
            scope + '.structured-navigation-popup ul li a.active' +
            '{' +
            'font-weight:normal;' +
            'background:white;' +
            'color:#C95116;' +
            '}' +
            ((useHoverStyles) ? scope + '.structured-navigation-popup ul li a.active:hover,' : '') +
            scope + '.structured-navigation-popup ul li a.active:active,' +
            scope + '.structured-navigation-popup ul li a.active:focus' +
            '{' +
            'background:white;' +
            '}' +
            // quick navigation
            '.quicknav.control' +
            '{' +
            'color:#777E7D;' +
            '}' +
            '.quicknav.control input' +
            '{' +
            '-webkit-appearance: none;' +
            '-webkit-border-radius:2px;' +
            '-moz-border-radius:2px;' +
            'border-radius:2px;' +
            'color:#333;' +
            'background:#EAEAEA;' +
            'padding:6px 0;' +
            'border:1px solid #CFCECE;' +
            'outline:none;' +
            'text-align:center;' +
            '}' +
            // custom scroll bar
            '.list-container::-webkit-scrollbar-track' +
            '{' +
            'background-color: #F7F6F5;' +
            'width:12px;' +
            'border-top-left-radius:6px;' +
            '}' +
            '.list-container::-webkit-scrollbar' +
            '{' +
            'width: 12px;' +
            'background-color: #F7F6F5;' +
            '}' +
            '.list-container::-webkit-scrollbar-thumb' +
            '{' +
            'border-radius:6px;' +
            'background-color: #CFCECE;' +
            'border:3px solid #F7F6F5;' +
            'width: 6px;' +
            'margin:3px 0;' +
            '}' +
            '.list-container::-webkit-scrollbar-thumb:hover' +
            '{' +
            'background-color: #000;' +
            '}';

        ActiveText.CSSUtils.embedCSS(cssStr, 'activelearn-styles');
    }

    return {
        embedStyles: embedStyles
    };
})();