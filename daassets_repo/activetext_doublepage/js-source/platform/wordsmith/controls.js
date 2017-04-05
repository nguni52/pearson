/* global ActiveText, WordSmith */
WordSmith.Controls = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var animationButton = '';

    if(options && options.displayAnimationControl !== undefined && options.displayAnimationControl) {
        animationButton = ',animations';
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'wslogo,drawing,viewtoggle,zoom' + animationButton;
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'contents,quicknav,previous,next';

    function init(activeTextInstance) {
        if(ActiveText.BrowserUtils.isMobileDevice) {
            if(!activeTextInstance.options.defaults) {
                activeTextInstance.options.defaults = {};
            }
            activeTextInstance.options.defaults.generatePageEdges = false;
            activeTextInstance.options.allowAnimation = false;
        }

        var scope = activeTextInstance.options.containerElement.selector + ' ';
        var cssString = '' +
            scope + '.controls-bar a' +
            '{' +
            'vertical-align:middle;' +
            '}' +
            scope + '.controls-bar a img' +
            '{' +
            'vertical-align:top;' +
            '}';
        ActiveText.CSSUtils.embedCSS(cssString, 'wordsmith-skin-styles');

        var pathPrefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance) + 'img/wordsmith/';
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
            barHeight: 74,
            barStyles: {
                backgroundColor: '#000000'
            },
            minWidth: 530,
            scaleMode: 'scale',
            buttonStyles: {
                width: 44,
                height: 44,
                background: 'transparent'
            },
            hoverStyles: {
                background: 'transparent'
            },
            options: {
                drawing: {
                    imageSrc: pathPrefix + 'Button_PencilUp.png',
                    hoverImageSrc: pathPrefix + 'Button_PencilHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_PencilDown.png',
                    toggleButtonImageSrc: pathPrefix + 'Button_PencilHoverSelected.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'Button_PencilHoverSelected.png',
                    toggleButtonDownImageSrc: pathPrefix + 'Button_PencilDown.png'
                },
                viewtoggle: {
                    imageSrc: pathPrefix + 'Button_DpageUp.png',
                    hoverImageSrc: pathPrefix + 'Button_DpageHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_DpageDown.png',
                    toggleButtonImageSrc: pathPrefix + 'Button_SpageUp.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'Button_SpageHoverSelected.png',
                    toggleButtonDownImageSrc: pathPrefix + 'Button_SpageDown.png'
                },
                zoom: {
                    imageSrc: pathPrefix + 'Button_MagMinusUp.png',
                    hoverImageSrc: pathPrefix + 'Button_MagMinusHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_MagMinusDown.png',
                    toggleButtonImageSrc: pathPrefix + 'Button_MagUp.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'Button_MagHoverSelected.png',
                    toggleButtonDownImageSrc: pathPrefix + 'Button_MagDown.png'
                },
                animations: {
                    imageSrc: pathPrefix + 'Button_PauseUp.png',
                    hoverImageSrc: pathPrefix + 'Button_PauseHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_PauseDown.png',
                    toggleButtonImageSrc: pathPrefix + 'Button_PlayUp.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'Button_PlayHoverSelected.png',
                    toggleButtonDownImageSrc: pathPrefix + 'Button_PLayDown.png'
                },
                contents: {
                    style: {
                        width: 119,
                        height: 33
                    },
                    width: 119,
                    height: 33,
                    imageSrc: pathPrefix + 'Button_ContentsUp.png',
                    hoverImageSrc: pathPrefix + 'Button_ContentsHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_ContentsDown.png',
                    toggleButtonImageSrc: pathPrefix + 'Button_ContentsHoverSelected.png',
                    toggleButtonHoverImageSrc: pathPrefix + 'Button_ContentsHoverSelected.png',
                    toggleButtonDownImageSrc: pathPrefix + 'Button_ContentsDown.png'
                },
                quicknav: {
                    style: {
                        border: 'none',
                        background: 'transparent url(' + pathPrefix + 'PageNav.png) 0 3px no-repeat',
                        width: 119,
                        padding: '11px 0px 9px 0px',
                        'vertical-align': 'middle'
                    },
                    popupnavwidth: 293,
                    textFormatSinglePage: '%%title%%',
                    textFormatMultiPage: '%%title%% – %%title2%%'
                },
                previous: {
                    imageSrc: pathPrefix + 'Button_BckArrowUp.png',
                    hoverImageSrc: pathPrefix + 'Button_BckArrowHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_BckArrowDown.png'
                },
                next: {
                    imageSrc: pathPrefix + 'Button_ForwArrowUp.png',
                    hoverImageSrc: pathPrefix + 'Button_ForwArrowHoverSelected.png',
                    downImageSrc: pathPrefix + 'Button_ForwArrowDown.png'
                }
            }
        });

        //            controls.init(activeTextInstance);
        activeTextInstance.extensions.push(controls);
    }

    return  {
        init: init,
        key: 'wordsmithcontrols'
    };
};