/* global ActiveText, Modernizr */
/**
 * @class ErrorMessages
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init}}
 * @constructor
 */
ActiveText.ErrorMessages = function(activeTextInstance) {
    'use strict';

    function showMessage(event, data) {
        $('#messages-placeholder').notify(data, {
            position: 'bottom center',
            style: 'base',
            autoHide: true,
            clickToHide: true,
            arrowShow: false,
            showAnimation: 'slideDown',
            gap: 8
        });
    }

    function attachEvents() {
        $(activeTextInstance).on(ActiveText.Commands.DISPLAY_ERROR, showMessage);
    }

    function init() {
        generatePlaceHolderElement();
        attachEvents();

        $.notify.addStyle('base', {
            html: '<div role="alert" aria-live="assertive"><span data-notify-text/></div>',
            classes: {
                base: {
                    'color': '#ffffff',
                    'white-space': 'nowrap',
                    'background-color': (Modernizr.rgba) ? 'rgba(0,0,0,0.5)' : '#666',
                    'padding': '5px 8px 2px',
                    'border-radius': '8px',
                    'border': '1px solid #000000'
                }
            }
        });
    }

    function generatePlaceHolderElement() {
        if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.containerElement) {
            var container = activeTextInstance.options.containerElement;
            var placeholderElement = $('<div id="messages-placeholder"></div>').css({
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                position: 'absolute',
                zIndex: 1001 // puts the loading graphic on top of the bumper bars
            });
            container.append(placeholderElement);
        }
    }

    return {
        init: init
    };
};