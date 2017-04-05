/* global ActiveText */
/**
 * @class ViewOrientationDetection
 * @memberOf ActiveText
 * @returns {{init: init}}
 * @constructor
 */
ActiveText.ViewOrientationDetection = function() {
    'use strict';

    function init(activeTextInstance) {
        /** @const */
        var PORTRAIT = 0;

        /** @const */
        var PORTRAIT_UPSIDE_DOWN = 180;

        /** @const */
        var LANDSCAPE_LEFT = 90;

        /** @const */
        var LANDSCAPE_RIGHT = -90;

        function switchToLandscapeMode() {
            $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_DPS_VIEW);
        }

        function switchToPortraitMode() {
            $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_SPS_VIEW);
        }

        function onOrientationEvent(eventData) {
            eventData = eventData || {};

            switch(eventData.orientationDegrees) {
                case PORTRAIT:
                    switchToPortraitMode();
                    break;
                case PORTRAIT_UPSIDE_DOWN:
                    switchToPortraitMode();
                    break;
                case LANDSCAPE_LEFT:
                    switchToLandscapeMode();
                    break;
                case LANDSCAPE_RIGHT:
                    switchToLandscapeMode();
                    break;
                default:
                    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                    if(w > h) {
                        switchToLandscapeMode();
                    } else {
                        switchToPortraitMode();
                    }
                    break;
            }
            window.scrollTo(0, 1);

            var iframes = document.getElementsByTagName('iframe'),
                iframeRef;

            for(var i = 0, j = iframes.length; i < j; i++){
                iframeRef = iframes[i].contentWindow || iframes[i].contentDocument;
                window.iframe = iframeRef;
                iframeRef.postMessage(eventData, '*');
            }
        }

        function eventHandler(event){
            var eventData = event.data;

            if(typeof eventData === 'undefined'){
                var $topFrame = $(window),
                    innerWidth = $topFrame.innerWidth(),
                    innerHeight = $topFrame.innerHeight(),
                    orientation = (innerWidth > innerHeight ? 'landscape' : 'portrait'),
                    orientationDegrees = (orientation === 'landscape' ? 90 : 0);

                eventData = {
                    orientation: orientation,
                    orientationDegrees: orientationDegrees,
                    innerWidth: innerWidth,
                    innerHeight: innerHeight
                };
            }

            setTimeout(function(){
                onOrientationEvent(eventData);
            }, 500);
        }

        if(ActiveText.ViewUtils.isCardMode(activeTextInstance) === false) {

            var orientationEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
            orientationEvent += ' message';

            $(window).on(orientationEvent, function(event) {
                var newEvent = event.originalEvent || event;
                setTimeout(function(){
                    eventHandler(newEvent);
                }, 500);
            });

            onOrientationEvent();
        }
    }

    return {
        init: init
    };
};