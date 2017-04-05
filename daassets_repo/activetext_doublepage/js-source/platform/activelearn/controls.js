/* global ActiveText, Modernizr */
var ActiveLearn = ActiveLearn || {};
ActiveLearn.Controls = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'drawing,note,viewtoggle,zoom';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'contents,pagenumber,previous,next';

    function init(activeTextInstance) {
        var controls = new ActiveText.UI.BasicControls(activeTextInstance, {
            leftButtons: leftButtons,
            rightButtons: rightButtons,
            openByDefault: true,
            overlay: false,
            barHeight: 50,
            barStyles: {
                background: '#FCFCFC',
                lineHeight: '50px',
                fontSize: 0,
                borderTop: '1px solid #E6E5E5',
                borderBottom: '1px solid #E6E5E5'
            },
            buttonStyles: {
                background: '#FCFCFC',
                borderRadius: 0,
                barClass: 'activelearn',
                borderBottom: '1px solid #E6E5E5'
            },
            hoverStyles: {
                background: 'white'
            },
            options: {
                contents: {
                    popupnavwidth: 300,
                    style: {
                        width: 50,
                        height: 49
                    }
                },
                pagenumber: {
                    style: {
                        borderLeft: '1px solid #E6E5E5'
                    }
                }
            }
        });

        activeTextInstance.extensions.push(controls);

        $(activeTextInstance).one(ActiveText.Commands.INIT_WHITEBOARD, function() {
            var fullWindowScalingMode = activeTextInstance.utils.isFullWindowScalingMode();
            var mobileDevice = ActiveText.BrowserUtils.isMobileDevice;
            if(fullWindowScalingMode && mobileDevice) {
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

        ActiveLearn.StylesHelper.embedStyles(activeTextInstance);

        return controls;
    }

    return  {
        init: init,
        key: 'activelearncontrols'
    };
};