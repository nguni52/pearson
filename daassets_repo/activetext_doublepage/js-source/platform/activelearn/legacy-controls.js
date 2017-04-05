/* global ActiveText, Modernizr */
var ActiveLearn = ActiveLearn || {};
ActiveLearn.LegacyControls = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'drawing,note,viewtoggle,zoom';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'contents,quicknav,previous,next';

    function init(activeTextInstance) {
        var pathPrefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance) + 'img/activelearn/';
        var controls = new ActiveText.UI.BasicControls(activeTextInstance, {
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
            barHeight: 39,
            barStyles: {
                backgroundColor: '#4885A2',
                backgroundImage: 'url(' + pathPrefix + 'bar_bg.png)',
                backgroundRepeat: 'repeat-x',
                lineHeight: '30px'
            },
            minWidth: 380,
            scaleMode: 'scale',
            buttonStyles: {
                width: 32,
                height: 32,
                background: 'transparent'
            },
            hoverStyles: {
                background: 'transparent'
            },
            options: {
                drawing: {
                    imageSrc: pathPrefix + 'drawing-up.png',
                    hoverImageSrc: pathPrefix + 'drawing-over.png',
                    downImageSrc: pathPrefix + 'drawing-down.png',
                    toggleButtonImageSrc: pathPrefix + 'drawing-down.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'drawing-over.png',
                    toggleButtonDownImageSrc: pathPrefix + 'drawing-down.png'
                },
                note: {
                    imageSrc: pathPrefix + 'note-up.png',
                    hoverImageSrc: pathPrefix + 'note-over.png',
                    downImageSrc: pathPrefix + 'note-down.png',
                    toggleButtonImageSrc: pathPrefix + 'note-down.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'note-over.png',
                    toggleButtonDownImageSrc: pathPrefix + 'note-down.png'
                },
                viewtoggle: {
                    imageSrc: pathPrefix + 'double-page-up.png',
                    hoverImageSrc: pathPrefix + 'double-page-over.png',
                    downImageSrc: pathPrefix + 'double-page-down.png',
                    toggleButtonImageSrc: pathPrefix + 'single-page-up.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'single-page-over.png',
                    toggleButtonDownImageSrc: pathPrefix + 'single-page-down.png'
                },
                zoom: {
                    imageSrc: pathPrefix + 'zoom-out-up.png',
                    hoverImageSrc: pathPrefix + 'zoom-out-over.png',
                    downImageSrc: pathPrefix + 'zoom-out-down.png',
                    toggleButtonImageSrc: pathPrefix + 'zoom-in-up.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'zoom-in-over.png',
                    toggleButtonDownImageSrc: pathPrefix + 'zoom-in-down.png'
                },
                contents: {
                    style: {
                        width: 76,
                        height: 32
                    },
                    width: 76,
                    height: 32,
                    imageSrc: pathPrefix + 'contents-up.png',
                    hoverImageSrc: pathPrefix + 'contents-over.png',
                    downImageSrc: pathPrefix + 'contents-down.png',
                    toggleButtonImageSrc: pathPrefix + 'contents-down.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'contents-over.png',
                    toggleButtonDownImageSrc: pathPrefix + 'contents-down.png'
                },
                quicknav: {
                    style: {
                        border: 'none',
                        background: 'transparent url(' + pathPrefix + 'quicknav.png) 0 3px no-repeat',
                        width: 108,
                        padding: '11px 0 8px 0',
                        'vertical-align': 'middle'
                    },
                    popupnavwidth: 293,
                    textFormatSinglePage: '%%1 of %%2',
                    textFormatMultiPage: '%%1/%%2 of %%3'
                },
                previous: {
                    style: {
                        width: 33,
                        height: 32
                    },
                    imageSrc: pathPrefix + 'prev-up.png',
                    hoverImageSrc: pathPrefix + 'prev-over.png',
                    downImageSrc: pathPrefix + 'prev-down.png'
                },
                next: {
                    style: {
                        width: 33,
                        height: 32
                    },
                    imageSrc: pathPrefix + 'next-up.png',
                    hoverImageSrc: pathPrefix + 'next-over.png',
                    downImageSrc: pathPrefix + 'next-down.png'
                }
            }
        });

        activeTextInstance.extensions.push(controls);

        $(activeTextInstance).one(ActiveText.Commands.INIT_WHITEBOARD, function() {
            if(activeTextInstance.utils.isFullWindowScalingMode()) {
                var rotationControl = new ActiveText.ViewOrientationDetection();
                rotationControl.init(activeTextInstance);
                activeTextInstance.extensions.push(rotationControl);
            }
        });

        if(activeTextInstance.options.allowOverlap === undefined) {
            activeTextInstance.options.allowOverlap = false;
        }

        activeTextInstance.options.containerCoordinates = {
            top: 10,
            right: 0,
            bottom: 10,
            left: 0
        };

        if(Modernizr.multiplebgs) {
            activeTextInstance.options.containerElement.css({
                backgroundColor: 'white',
                backgroundImage: 'url(' + ActiveText.SkinUtils.getPathToResources(activeTextInstance) +
                    'img/activelearn/page-left.png), url(' +
                    ActiveText.SkinUtils.getPathToResources(activeTextInstance) +
                    'img/activelearn/page-right.png)',
                backgroundPosition: 'left top, right top',
                backgroundRepeat: 'no-repeat'
            });
        } else {
            activeTextInstance.options.containerElement.css({
                backgroundColor: 'white',
                backgroundImage: 'url(' + ActiveText.SkinUtils.getPathToResources(activeTextInstance) +
                    'img/activelearn/page-left.png)',
                backgroundPosition: 'left top',
                backgroundRepeat: 'no-repeat'
            });
        }

        var cssStr;
        if(Modernizr.boxshadow) {
            cssStr = '.whiteboard-container' +
                '{' +
                '-webkit-box-shadow: 0px 4px 7px 2px #999999;' +
                '-moz-box-shadow: 0px 4px 7px 2px #999999;' +
                'box-shadow: 0px 4px 7px 2px #999999' +
                '}';
        } else {
            cssStr = '.whiteboard-container' +
                '{' +
                'outline : 1px solid #ccc' +
                '}';
        }
        ActiveText.CSSUtils.embedCSS(cssStr, 'activelearn-styles');

        return controls;
    }

    return  {
        init: init,
        key: 'activelearncontrols'
    };
};