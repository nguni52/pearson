/* global ActiveText, Modernizr */
var Rapid = Rapid || {};
Rapid.Controls = function(options) {
    'use strict';

    function init(activeTextInstance) {
        var closeFunction;
        /**
         * @return {Rapid.CloseBook}
         */
        var closeBookExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'closebook');
        if(closeBookExtension) {
            closeFunction = closeBookExtension.open;
        }

        if(!options) {
            options = {};
        }

        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
        var pathPrefix = pathToResources + 'img/rapid/';
        var extension = '.png';
        if(Modernizr.svg) {
            extension = '.svg';
        }

        var controls = new ActiveText.UI.BasicControls(activeTextInstance, {
            primary: options.primary,
            leftButtons: options.leftButtons,
            rightButtons: options.rightButtons,
            leftButtonOptions: {
                left: '10px'
            },
            rightButtonOptions: {
                right: '10px'
            },
            openByDefault: true,
            overlay: false,
            barHeight: 50,
            barStyles: {
                backgroundColor: '#000000'
            },
            minWidth: 670,
            scaleMode: 'scale',
            buttonStyles: {
                width: 41,
                height: 41,
                tooltips: false,
                background: 'transparent',
                display: 'inline-block',
                'vertical-align': 'top'
            },
            hoverStyles: {
                background: 'transparent'
            },
            options: {
                readtome: {
                    style: {
                        width: 157,
                        height: 41
                    },
                    imageSrc: pathPrefix + 'ReadToMeUp' + extension,
                    hoverImageSrc: pathPrefix + 'ReadToMeOver' + extension,
                    downImageSrc: pathPrefix + 'ReadToMeDown' + extension,
                    toggleButtonImageSrc: pathPrefix + 'ReadToMeActive' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'ReadToMeActiveDown' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'ReadToMeActiveOver' + extension
                },
                zoom: {
                    imageSrc: pathPrefix + 'ZoomActive' + extension,
                    hoverImageSrc: pathPrefix + 'ZoomActiveOver' + extension,
                    downImageSrc: pathPrefix + 'ZoomActiveDown' + extension,
                    toggleButtonImageSrc: pathPrefix + 'ZoomUp' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'ZoomDown' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'ZoomOver' + extension
                },
                bugclubhotspots: {
                    imageSrc: pathPrefix + 'HeadActive' + extension,
                    hoverImageSrc: pathPrefix + 'HeadActiveOver' + extension,
                    downImageSrc: pathPrefix + 'HeadActiveDown' + extension,
                    toggleButtonImageSrc: pathPrefix + 'HeadUp' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'HeadOver' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'HeadDown' + extension
                },
                previous: {
                    style: {
                        width: 69,
                        height: 45
                    },
                    imageSrc: pathPrefix + 'LeftArrowUp' + extension,
                    hoverImageSrc: pathPrefix + 'LeftArrowOver' + extension,
                    enableBehaviour: 'hide'
                },
                next: {
                    style: {
                        width: 69,
                        height: 45
                    },
                    imageSrc: pathPrefix + 'RightArrowUp' + extension,
                    hoverImageSrc: pathPrefix + 'RightArrowOver' + extension,
                    downImageSrc: pathPrefix + 'RightArrowDown' + extension,
                    enableBehaviour: 'hide'
                },
                record: {
                    imageSrc: pathPrefix + 'RecordUp' + extension,
                    hoverImageSrc: pathPrefix + 'RecordOver' + extension,
                    downImageSrc: pathPrefix + 'RecordDown' + extension,
                    toggleButtonImageSrc: pathPrefix + 'StopUp' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'StopOver' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'StopDown' + extension
                },
                play: {
                    imageSrc: pathPrefix + 'PlayUp' + extension,
                    hoverImageSrc: pathPrefix + 'PlayOver' + extension,
                    downImageSrc: pathPrefix + 'PlayDown' + extension,
                    disabledImageSrc: pathPrefix + 'PlayDisabled' + extension,
                    toggleButtonImageSrc: pathPrefix + 'PauseUp' + extension,
                    toggleButtonHoverImageSrc: pathPrefix + 'PauseOver' + extension,
                    toggleButtonDownImageSrc: pathPrefix + 'PauseDown' + extension
                },
                exit: {
                    imageSrc: pathPrefix + 'CloseUp' + extension,
                    hoverImageSrc: pathPrefix + 'CloseOver' + extension,
                    downImageSrc: pathPrefix + 'CloseDown' + extension,
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