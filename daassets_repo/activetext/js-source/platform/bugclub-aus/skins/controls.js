/* global ActiveText, BugClubAus, Modernizr */
BugClubAus.Controls = function(options) {
    'use strict';
    function init(activeTextInstance) {
        /**
         * @type {Function}
         */
        var closeFunction;

        /**
         * @return {BugClubAus.SummaryScreen}
         */
        var summaryScreenExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'summaryscreen');
        if(summaryScreenExtension) {
            closeFunction = summaryScreenExtension.openSummary;
        }

        if(!options) {
            options = {};
        }

        //default student-ks1 layout - override for teacher layout in acticetext instance
        var leftButtons = (options.leftButtons) ? options.leftButtons : 'zoom';
        var primary = (options.primary) ? options.primary : null;
        var rightButtons = (options.rightButtons) ? options.rightButtons : 'exit';

        if(activeTextInstance.options.allowReadToMe === false) {
            leftButtons = _.without(leftButtons.split(','), 'readtome', 'readtomeExtended').toString();
            if(primary !== null) {
                options.primary = _.without(options.primary.split(','), 'readtome', 'readtomeExtended').toString();
            }
            rightButtons = _.without(rightButtons.split(','), 'readtome', 'readtomeExtended').toString();
        }

        options.leftButtons = leftButtons;
        if(primary !== null) {
            options.primary = primary;
        }
        options.rightButtons = rightButtons;
        /**
         * @type {String}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        /**
         * @type {String}
         */
        var pathPrefix = pathToResources + 'img/bugclub/legacy/' + options.skinPathPrefix;
        var skinName = options.skinName;
        var controls, cssString;

        if(skinName === 'student-ks1') {
            controls = new ActiveText.UI.BasicControls(activeTextInstance, {
                primary: primary,
                leftButtons: leftButtons,
                rightButtons: rightButtons,
                leftButtonOptions: {
                    left: '10px',
                    top: '0'
                },
                rightButtonOptions: {
                    right: '10px'
                },
                openByDefault: true,
                overlay: false,
                barHeight: 102,
                barStyles: {
                    backgroundColor: '#a3ca43',
                    backgroundImage: "url(" + pathPrefix + "Canvas_backgroundSkin.png)",
                    backgroundRepeat: "repeat-x",
                    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='" + pathPrefix +
                        "Canvas_backgroundSkin.png', sizingMethod='scale')"
                },
                minWidth: 670,
                scaleMode: "scale",
                buttonStyles: {
                    width: 94,
                    height: 95,
                    margin: "0",
                    background: "transparent"
                },
                hoverStyles: {
                    background: "transparent"
                },
                options: {
                    readtome: {
                        style: {
                            width: 174,
                            height: 95
                        },
                        imageSrc: pathPrefix + "Button_readMe_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_readMe_overSkin.png",
                        downImageSrc: pathPrefix + "Button_readMe_downSkin.png",
                        toggleButtonImageSrc: pathPrefix + "Button_readMe_selectedSkin.png",
                        toggleButtonHoverImageSrc: pathPrefix + "Button_readMe_selectedSkin.png"
                    },
                    zoom: {
                        imageSrc: pathPrefix + "Button_zoomOut_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_zoomOut_overSkin.png",
                        downImageSrc: pathPrefix + "Button_zoomOut_downSkin.png",
                        toggleButtonImageSrc: pathPrefix + "Button_zoomIn_upSkin.png",
                        toggleButtonDownImageSrc: pathPrefix + "Button_zoomIn_downSkin.png",
                        toggleButtonHoverImageSrc: pathPrefix + "Button_zoomIn_overSkin.png"
                    },
                    previous: {
                        style: {
                            width: 120,
                            height: 92
                        },
                        imageSrc: pathPrefix + "Button_backArrow_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_backArrow_overSkin.png",
                        downImageSrc: pathPrefix + "Button_backArrow_downSkin.png",
                        enableBehaviour: "hide"
                    },
                    next: {
                        style: {
                            width: 120,
                            height: 92
                        },
                        imageSrc: pathPrefix + "Button_forArrow_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_forArrow_overSkin.png",
                        downImageSrc: pathPrefix + "Button_forArrow_downSkin.png",
                        enableBehaviour: "hide"
                    },
                    exit: {
                        style: {
                            width: 50,
                            height: 51
                        },
                        imageSrc: pathPrefix + "Button_Close_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_Close_overSkin.png",
                        downImageSrc: pathPrefix + "Button_Close_downSkin.png",
                        closeFunction: closeFunction
                    }
                }
            });
        } else if(skinName === 'student-ks2') {
            cssString = '.quicknav' +
                '{' +
                'background:transparent url(' + pathPrefix +
                'text-input-background.png) center center no-repeat;' +
                'width:128px;' +
                '}' +
                '.quicknav input' +
                '{' +
                'background:transparent;' +
                '}';
            ActiveText.CSSUtils.embedCSS(cssString, 'bugclub-skin-styles');

            controls = new ActiveText.UI.BasicControls(activeTextInstance, {
                leftButtons: leftButtons,
                rightButtons: rightButtons,
                leftButtonOptions: {
                    left: '10px',
                    top: '0'
                },
                rightButtonOptions: {
                    right: '10px'
                },
                openByDefault: true,
                overlay: false,
                barHeight: 51,
                barStyles: {
                    backgroundColor: '#92c7c6',
                    backgroundImage: "url(" + pathPrefix + "bar.png)",
                    backgroundRepeat: "repeat-x",
                    lineHeight: "46px"
                },
                minWidth: 545,
                scaleMode: "scale",
                buttonStyles: {
                    width: 41,
                    height: 41,
                    background: "transparent",
                    margin: "0"
                },
                options: {
                    readtome: {
                        imageSrc: pathPrefix + "button-volume-on-up.png",
                        hoverImageSrc: pathPrefix + "button-volume-on-hover.png",
                        downImageSrc: pathPrefix + "button-volume-on-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-volume-on-up-toggle.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-volume-on-hover-toggle.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-volume-on-down-toggle.png"
                    },
                    edittext: {
                        imageSrc: pathPrefix + "button-edittext-up.png",
                        hoverImageSrc: pathPrefix + "button-edittext-hover.png",
                        toggleButtonImageSrc: pathPrefix + "button-edittext-up-toggle.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-edittext-hover-toggle.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-edittext-down-toggle.png"
                    },
                    drawing: {
                        imageSrc: pathPrefix + "button-drawing-up.png",
                        hoverImageSrc: pathPrefix + "button-drawing-hover.png",
                        downImageSrc: pathPrefix + "button-drawing-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-drawing-up-toggle.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-drawing-hover-toggle.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-drawing-down-toggle.png"
                    },
                    zoom: {
                        imageSrc: pathPrefix + "button-zoom-out-up-toggle.png",
                        hoverImageSrc: pathPrefix + "button-zoom-out-hover-toggle.png",
                        downImageSrc: pathPrefix + "button-zoom-out-down-toggle.png",
                        toggleButtonImageSrc: pathPrefix + "button-zoom-in-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-zoom-in-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-zoom-in-down.png"
                    },
                    viewtoggle: {
                        imageSrc: pathPrefix + "button-dps-view-up.png",
                        hoverImageSrc: pathPrefix + "button-dps-view-hover.png",
                        downImageSrc: pathPrefix + "button-dps-view-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-sps-view-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-sps-view-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-sps-view-down.png"
                    },
                    previous: {
                        style: {
                            width: 49,
                            height: 43
                        },
                        imageSrc: pathPrefix + "button-left-up.png",
                        hoverImageSrc: pathPrefix + "button-left-hover.png",
                        enableBehaviour: "hide"
                    },
                    next: {
                        style: {
                            width: 49,
                            height: 43
                        },
                        imageSrc: pathPrefix + "button-right-up.png",
                        hoverImageSrc: pathPrefix + "button-right-hover.png",
                        enableBehaviour: "hide"
                    },
                    quicknav: {
                        style: {
                            border: "none",
                            width: 152,
                            padding: "12px 12px 14px 12px"
                        },
                        popupnavwidth: 293,
                        textFormatSinglePage: "%%1 of %%2",
                        textFormatMultiPage: "%%1/%%2 of %%3"
                    },
                    activitystructure: {
                        style: {
                            width: 102,
                            height: 41
                        },
                        imageSrc: pathPrefix + "button-contents-up.png",
                        hoverImageSrc: pathPrefix + "button-contents-hover.png",
                        downImageSrc: pathPrefix + "button-contents-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-contents-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-contents-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-contents-down.png"
                    },
                    exit: {
                        style: {
                            width: 36,
                            height: 36
                        },
                        imageSrc: pathPrefix + "button-exit-up.png",
                        hoverImageSrc: pathPrefix + "button-exit-hover.png",
                        downImageSrc: pathPrefix + "button-exit-down.png",
                        closeFunction: closeFunction
                    }
                }
            });
        } else if(skinName === 'teacher-ks1') {
            cssString = '' +
                '.quicknav' +
                '{' +
                'background:transparent url(' + pathPrefix +
                'Canvas_teacherButtonBar_TextInput.png) center center no-repeat;' +
                '}' +
                '.quicknav input' +
                '{' +
                'background:transparent;' +
                '}';
            ActiveText.CSSUtils.embedCSS(cssString, 'bugclub-skin-styles');

            controls = new ActiveText.UI.BasicControls(activeTextInstance, {
                leftButtons: leftButtons,
                rightButtons: rightButtons,
                leftButtonOptions: {
                    left: '10px',
                    top: '0'
                },
                rightButtonOptions: {
                    right: '10px'
                },
                openByDefault: true,
                overlay: false,
                barHeight: 101,
                barStyles: {
                    backgroundColor: '#456b68',
                    backgroundImage: "url(" + pathPrefix + "Element_Background2.png)",
                    backgroundRepeat: "repeat-x"
                },
                minWidth: 670,
                scaleMode: "scale",
                buttonStyles: {
                    width: 64,
                    height: 64,
                    margin: "0",
                    background: "transparent"
                },
                hoverStyles: {
                    background: "transparent"
                },
                options: {
                    readtome: {
                        imageSrc: pathPrefix + "Button_readMe_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_readMe_overSkin.png",
                        downImageSrc: pathPrefix + "Button_readMe_downSkin.png",
                        toggleButtonImageSrc: pathPrefix + "Button_readMe_selectedSkin.png",
                        toggleButtonHoverImageSrc: pathPrefix + "Button_readMe_selectedSkin.png"
                    },
                    drawing: {
                        imageSrc: pathPrefix + "Button_userTools_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_userTools_overSkin.png",
                        downImageSrc: pathPrefix + "Button_userTools_downSkin.png",
                        toggleButtonImageSrc: pathPrefix + "Button_userTools_selectedSkin.png",
                        toggleButtonHoverImageSrc: pathPrefix + "Button_userTools_selectedSkin.png"
                    },
                    zoom: {
                        imageSrc: pathPrefix + "Button_zoomOut_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_zoomOut_overSkin.png",
                        downImageSrc: pathPrefix + "Button_zoomOut_downSkin.png",
                        toggleButtonImageSrc: pathPrefix + "Button_zoomIn_upSkin.png",
                        toggleButtonDownImageSrc: pathPrefix + "Button_zoomIn_downSkin.png",
                        toggleButtonHoverImageSrc: pathPrefix + "Button_zoomIn_overSkin.png"
                    },
                    bugclubhotspots: {
                        imageSrc: pathPrefix + "Button_activityToggle_disabledSkin.png",
                        hoverImageSrc: pathPrefix + "Button_activityToggle_disabledSkin.png",
                        downImageSrc: pathPrefix + "Button_activityToggle_downButton.png",
                        toggleButtonImageSrc: pathPrefix + "Button_activityToggle_upSkin.png",
                        toggleButtonHoverImageSrc: pathPrefix + "Button_activityToggle_overSkin.png",
                        enableBehaviour: "show"
                    },
                    previous: {
                        style: {
                            width: 80,
                            height: 60
                        },
                        imageSrc: pathPrefix + "Button_backArrow_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_backArrow_overSkin.png",
                        downImageSrc: pathPrefix + "Button_backArrow_downSkin.png",
                        enableBehaviour: "hide"
                    },
                    next: {
                        style: {
                            width: 80,
                            height: 60
                        },
                        imageSrc: pathPrefix + "Button_forArrow_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_forArrow_overSkin.png",
                        downImageSrc: pathPrefix + "Button_forArrow_downSkin.png",
                        enableBehaviour: "hide"
                    },
                    quicknav: {
                        style: {
                            border: "none",
                            width: 120,
                            padding: "18px 12px"
                        },
                        popupnavwidth: 293,
                        textFormatSinglePage: "%%1 of %%2",
                        textFormatMultiPage: "%%1/%%2 of %%3"
                    },
                    exit: {
                        style: {
                            width: 53,
                            height: 53,
                            margin: "0"
                        },
                        imageSrc: pathPrefix + "Button_teacherClose_upSkin.png",
                        hoverImageSrc: pathPrefix + "Button_teacherClose_overSkin.png",
                        downImageSrc: pathPrefix + "Button_teacherClose_downSkin.png",
                        closeFunction: closeFunction
                    }
                }
            });
        } else if(skinName === 'teacher-ks2') {
            cssString = '.quicknav' +
                '{' +
                'background:transparent url(' + pathPrefix +
                'text-input-background.png) center center no-repeat;' +
                'width:128px;' +
                '}' +
                '.quicknav input' +
                '{' +
                'background:transparent;' +
                '}';
            ActiveText.CSSUtils.embedCSS(cssString, 'bugclub-skin-styles');

            controls = new ActiveText.UI.BasicControls(activeTextInstance, {
                leftButtons: leftButtons,
                rightButtons: rightButtons,
                leftButtonOptions: {
                    left: '10px',
                    top: '0'
                },
                rightButtonOptions: {
                    right: '10px'
                },
                openByDefault: true,
                overlay: false,
                barHeight: 51,
                barStyles: {
                    backgroundColor: '#92c7c6',
                    backgroundImage: "url(" + pathPrefix + "bar.png)",
                    backgroundRepeat: "repeat-x",
                    lineHeight: "46px"
                },
                minWidth: 645,
                scaleMode: "scale",
                buttonStyles: {
                    width: 41,
                    height: 41,
                    background: "transparent"
                },
                hoverStyles: {
                    background: "transparent"
                },
                options: {
                    readtome: {
                        imageSrc: pathPrefix + "button-volume-on-up.png",
                        hoverImageSrc: pathPrefix + "button-volume-on-hover.png",
                        downImageSrc: pathPrefix + "button-volume-on-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-volume-on-up-toggle.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-volume-on-hover-toggle.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-volume-on-down-toggle.png"
                    },
                    edittext: {
                        imageSrc: pathPrefix + "button-edittext-up.png",
                        hoverImageSrc: pathPrefix + "button-edittext-hover.png",
                        toggleButtonImageSrc: pathPrefix + "button-edittext-up-toggle.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-edittext-hover-toggle.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-edittext-down-toggle.png"
                    },
                    drawing: {
                        imageSrc: pathPrefix + "button-drawing-up.png",
                        hoverImageSrc: pathPrefix + "button-drawing-hover.png",
                        downImageSrc: pathPrefix + "button-drawing-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-drawing-up-toggle.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-drawing-hover-toggle.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-drawing-down-toggle.png"
                    },
                    zoom: {
                        imageSrc: pathPrefix + "button-zoom-out-up-toggle.png",
                        hoverImageSrc: pathPrefix + "button-zoom-out-hover-toggle.png",
                        downImageSrc: pathPrefix + "button-zoom-out-down-toggle.png",
                        toggleButtonImageSrc: pathPrefix + "button-zoom-in-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-zoom-in-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-zoom-in-down.png"
                    },
                    bugclubhotspots: {
                        imageSrc: pathPrefix + "button-hotspots-up-disabled.png",
                        hoverImageSrc: pathPrefix + "button-hotspots-hover-disabled.png",
                        downImageSrc: pathPrefix + "button-hotspots-down-disabled.png",
                        toggleButtonImageSrc: pathPrefix + "button-hotspots-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-hotspots-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-hotspots-down.png",
                        enableBehaviour: "show"
                    },
                    viewtoggle: {
                        imageSrc: pathPrefix + "button-dps-view-up.png",
                        hoverImageSrc: pathPrefix + "button-dps-view-hover.png",
                        downImageSrc: pathPrefix + "button-dps-view-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-sps-view-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-sps-view-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-sps-view-down.png"
                    },
                    previous: {
                        style: {
                            width: 49,
                            height: 43
                        },
                        imageSrc: pathPrefix + "button-left-up.png",
                        hoverImageSrc: pathPrefix + "button-left-hover.png",
                        enableBehaviour: "hide"
                    },
                    next: {
                        style: {
                            width: 49,
                            height: 43
                        },
                        imageSrc: pathPrefix + "button-right-up.png",
                        hoverImageSrc: pathPrefix + "button-right-hover.png",
                        enableBehaviour: "hide"
                    },
                    quicknav: {
                        style: {
                            border: "none",
                            width: 152,
                            padding: "12px 12px 14px 12px"
                        },
                        popupnavwidth: 293,
                        textFormatSinglePage: "%%1 of %%2",
                        textFormatMultiPage: "%%1/%%2 of %%3"
                    },
                    activitystructure: {
                        style: {
                            width: 102,
                            height: 41
                        },
                        imageSrc: pathPrefix + "button-contents-up.png",
                        hoverImageSrc: pathPrefix + "button-contents-hover.png",
                        downImageSrc: pathPrefix + "button-contents-down.png",
                        toggleButtonImageSrc: pathPrefix + "button-contents-up.png",
                        toggleButtonHoverImageSrc: pathPrefix + "button-contents-hover.png",
                        toggleButtonDownImageSrc: pathPrefix + "button-contents-down.png"
                    },
                    exit: {
                        style: {
                            width: 36,
                            height: 36
                        },
                        imageSrc: pathPrefix + "button-exit-up.png",
                        hoverImageSrc: pathPrefix + "button-exit-hover.png",
                        downImageSrc: pathPrefix + "button-exit-down.png",
                        closeFunction: closeFunction
                    }
                }
            });
        }

        activeTextInstance.extensions.push(controls);
    }

    return  {
        init: init
    };
};