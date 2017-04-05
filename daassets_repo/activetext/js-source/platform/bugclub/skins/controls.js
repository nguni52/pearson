/* global ActiveText, BugClub, Modernizr */
ActiveText.namespace('BugClub.Controls');
BugClub.Controls = function(options) {
    'use strict';
    function init(activeTextInstance) {
        /**
         * @type {Function}
         */
        var closeFunction;

        /**
         * @return {BugClub.SummaryScreen}
         */
        var summaryScreenExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'summaryscreen');
        if(summaryScreenExtension) {
            closeFunction = summaryScreenExtension.openSummary;
        }

        if(!options) {
            options = {};
        }

        var leftButtons = options.leftButtons;
        var primary = options.primary;
        var rightButtons = options.rightButtons;

        if(activeTextInstance.options.allowReadToMe === false) {
            leftButtons = _.without(leftButtons.split(','), 'readtome', 'readtomeExtended').toString();
            if(primary !== undefined) {
                options.primary = _.without(options.primary.split(','), 'readtome', 'readtomeExtended').toString();
            }
            rightButtons = _.without(rightButtons.split(','), 'readtome', 'readtomeExtended').toString();
        }

        options.leftButtons = leftButtons;
        if(primary !== undefined) {
            options.primary = primary;
        }
        options.rightButtons = rightButtons;
        /**
         * @type {String}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
        var globalPath = ActiveText.SkinUtils.getPathToGlobalResource();

        var cssString = '' +
            '@font-face{' +
            'font-family:"heinemann-special";' +
            'src:url("' + globalPath + 'font/1cf6f702b2f7c3f363d7a7475b771ad2519c7ae2.eot");' +
            'src:url("' + globalPath +
            '/font/1cf6f702b2f7c3f363d7a7475b771ad2519c7ae2.eot?#iefix") format("embedded-opentype"),' +
            'url("' + globalPath + 'font/8780f55bdc4d11d74eb8c065b895b242730874ca.woff") format("woff");' +
            'font-weight: bold;' +
            'font-style: italic;' +
            '}' +
            '@font-face{' +
            'font-family:"heinemann-special";' +
            'src:url("' + globalPath + 'font/be8783ef363b706a9d4e4a04dba99df31523ac38.eot");' +
            'src:url("' + globalPath +
            '/font/be8783ef363b706a9d4e4a04dba99df31523ac38.eot?#iefix") format("embedded-opentype"),' +
            'url("' + globalPath + 'font/74727931f38ae3d96fb103fa3e9f2ab609c07e0e.woff") format("woff");' +
            'font-weight: normal;' +
            'font-style: normal;' +
            '}' +
            '@font-face{' +
            'font-family:"heinemann-special";' +
            'src:url("' + globalPath + 'font/a14bed103c175e7e5f080c8f2912687e34e02218.eot");' +
            'src:url("' + globalPath +
            '/font/a14bed103c175e7e5f080c8f2912687e34e02218.eot?#iefix") format("embedded-opentype"),' +
            'url("' + globalPath + 'font/e916834581bf5571da0e6c64ada6d4a578caa1ac.woff") format("woff");' +
            'font-weight: normal;' +
            'font-style: italic;' +
            '}' +
            '@font-face{' +
            'font-family:"heinemann-special";' +
            'src:url("' + globalPath + 'font/d503710c5cb5a0c4ba67fcd57b8113bd9e6436cf.eot");' +
            'src:url("' + globalPath +
            '/font/d503710c5cb5a0c4ba67fcd57b8113bd9e6436cf.eot?#iefix") format("embedded-opentype"),' +
            'url("' + globalPath + 'font/f353d99d6d18eef861d08c4ccf61476a7e9996e3.woff") format("woff");' +
            'font-weight: bold;' +
            'font-style: normal;' +
            '}' +
            '.quicknav input' +
            '{' +
            'font-family:"heinemann-special";' +
            'font-weight:normal;' +
            'border: 3px solid #fff;' +
            'background: #e6e6e6;' +
            'background: -moz-linear-gradient(top, #e6e6e6 0%, #ffffff 100%);' +
            'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#e6e6e6), color-stop(100%,#ffffff));' +
            'background: -webkit-linear-gradient(top, #e6e6e6 0%,#ffffff 100%);' +
            'background: -o-linear-gradient(top, #e6e6e6 0%,#ffffff 100%);' +
            'background: -ms-linear-gradient(top, #e6e6e6 0%,#ffffff 100%);' +
            'background: linear-gradient(to bottom, #e6e6e6 0%,#ffffff 100%);' +
            (($.browser.msie && $.browser.version ===
                9) ? '' : 'background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPgo8bGluZWFyR3JhZGllbnQgaWQ9Imc1MjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjAlIiB5Mj0iMTAwJSI+CjxzdG9wIHN0b3AtY29sb3I9IiNFNkU2RTYiIG9mZnNldD0iMCIvPjxzdG9wIHN0b3AtY29sb3I9IiNGRkZGRkYiIG9mZnNldD0iMC45Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InVybCgjZzUyMSkiIC8+Cjwvc3ZnPg==);') +
            'font-size: 18px;' +
            '}';
        ActiveText.CSSUtils.embedCSS(cssString, 'bugclub-skin-styles');

        /**
         * @type {String}
         */
        var pathPrefix = pathToResources + 'img/bugclub/';

        var extension = '.png';
        if(Modernizr.svg) {
            extension = '.svg';
        }

        var controls = new ActiveText.UI.BasicControls(activeTextInstance, {
            primary: primary,
            leftButtons: leftButtons,
            rightButtons: rightButtons,
            leftButtonOptions: {
                left: '10px'
            },
            rightButtonOptions: {
                right: '10px'
            },
            openByDefault: true,
            overlay: false,
            barHeight: 66,
            barStyles: {
                backgroundColor: '#9BCA3B',
                height: 66,
                fontSize: '18px'
            },
            minWidth: 800,
            scaleMode: 'scale',
            buttonStyles: {
                width: 50,
                height: 50,
                background: 'transparent'
            },
            hoverStyles: {
                background: 'transparent'
            },
            options: {
                readtomeExtended: {
                    readtome: {
                        style: {
                            width: 186,
                            height: 50
                        },
                        imageSrc: pathPrefix + 'large-readtome' + extension,
                        hoverImageSrc: pathPrefix + 'large-readtome-over' + extension,
                        downImageSrc: pathPrefix + 'large-readtome-over' + extension,
                        disabledImageSrc: pathPrefix + 'large-readtome-disabled' + extension,
                        toggleButtonImageSrc: pathPrefix + 'large-readtome-active' + extension,
                        toggleButtonHoverImageSrc: pathPrefix + 'large-readtome-over' + extension,
                        enableBehaviour: 'show'
                    },
                    done: {
                        style: {
                            width: 104,
                            height: 50
                        },
                        imageSrc: pathPrefix + 'done-inactive' + extension,
                        hoverImageSrc: pathPrefix + 'done-inactive' + extension,
                        downImageSrc: pathPrefix + 'done-inactive' + extension,
                        toggleButtonImageSrc: pathPrefix + 'done' + extension,
                        toggleButtonHoverImageSrc: pathPrefix + 'done-over' + extension,
                        enableBehaviour: 'show'
                    }
                },
                readtome: {
                    style: {
                        width: 186,
                        height: 50
                    },
                    imageSrc: pathPrefix + 'large-readtome' + extension,
                    hoverImageSrc: pathPrefix + 'large-readtome-over' + extension,
                    downImageSrc: pathPrefix + 'large-readtome-over' + extension,
                    disabledImageSrc: pathPrefix + 'large-readtome-disabled' + extension,
                    toggleButtonImageSrc: pathPrefix + 'large-readtome-active' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'large-readtome-over' + extension,
                    enableBehaviour: 'show'
                },
                zoom: {
                    //                    imageSrc: pathPrefix + 'zoomout' + extension,
                    imageSrc: pathPrefix + 'zoomout-active' + extension,
                    hoverImageSrc: pathPrefix + 'zoomout-over' + extension,
                    downImageSrc: pathPrefix + 'zoomout-over' + extension,
                    toggleButtonImageSrc: pathPrefix + 'zoomin' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'zoomin-over' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'zoomin-over' + extension
                },
                bugclubhotspots: {
                    imageSrc: pathPrefix + 'activitytoggle-disabled' + extension,
                    hoverImageSrc: pathPrefix + 'activitytoggle-disabled' + extension,
                    downImageSrc: pathPrefix + 'activitytoggle-disabled' + extension,
                    disabledImageSrc: pathPrefix + 'activitytoggle' + extension,
                    toggleButtonImageSrc: pathPrefix + 'activitytoggle' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'activitytoggle-over' + extension,
                    enableBehaviour: 'show'
                },
                viewtoggle: {
                    imageSrc: pathPrefix + 'dps' + extension,
                    hoverImageSrc: pathPrefix + 'dps-over' + extension,
                    downImageSrc: pathPrefix + 'dps-over' + extension,
                    toggleButtonImageSrc: pathPrefix + 'sps' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'sps-over' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'sps-over' + extension
                },
                previous: {
                    style: {
                        width: 96,
                        height: 50
                    },
                    imageSrc: pathPrefix + 'back' + extension,
                    hoverImageSrc: pathPrefix + 'back-over' + extension,
                    downImageSrc: pathPrefix + 'back-over' + extension,
                    disabledImageSrc: pathPrefix + 'back-disabled' + extension,
                    enableBehaviour: 'show'
                },
                next: {
                    style: {
                        width: 96,
                        height: 50
                    },
                    imageSrc: pathPrefix + 'next' + extension,
                    hoverImageSrc: pathPrefix + 'next-over' + extension,
                    downImageSrc: pathPrefix + 'next-over' + extension,
                    disabledImageSrc: pathPrefix + 'next-disabled' + extension,
                    enableBehaviour: 'show'
                },
                drawing: {
                    imageSrc: pathPrefix + 'drawing' + extension,
                    hoverImageSrc: pathPrefix + 'drawing-over' + extension,
                    downImageSrc: pathPrefix + 'drawing-over' + extension,
                    toggleButtonImageSrc: pathPrefix + 'drawing-active' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'drawing-over' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'drawing-active' + extension
                },
                activitystructure: {
                    style: {
                        width: 122,
                        height: 50
                    },
                    imageSrc: pathPrefix + 'content' + extension,
                    hoverImageSrc: pathPrefix + 'content-over' + extension,
                    downImageSrc: pathPrefix + 'content-over' + extension,
                    toggleButtonImageSrc: pathPrefix + 'content-active' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'content-over' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'content-over' + extension
                },
                quicknav: {
                    style: {
                        border: '',
                        background: '',
                        width: 'auto',
                        padding: '13px'
                    },
                    popupnavwidth: 293,
                    textFormatSinglePage: '%%1 of %%2',
                    textFormatMultiPage: '%%1/%%2 of %%3'
                },
                exit: {
                    style: {
                        width: 50,
                        height: 50
                    },
                    imageSrc: pathPrefix + 'close' + extension,
                    hoverImageSrc: pathPrefix + 'close-over' + extension,
                    downImageSrc: pathPrefix + 'close-over' + extension,
                    closeFunction: closeFunction
                }
            }
        });

        activeTextInstance.extensions.push(controls);
    }

    return  {
        init: init
    };
};