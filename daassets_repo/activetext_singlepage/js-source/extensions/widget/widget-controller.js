/* global ActiveText, ActiveText, requestAnimationFrame */
ActiveText.Widget = ActiveText.Widget || {};
/**
 * @class Controller
 * @memberOf ActiveText.Widget
 * @param activeTextInstance {ActiveText}
 * @returns {{openWidgetPopoverFromData: openWidgetPopoverFromData, getWidgetById: getWidgetById}}
 * @constructor
 */
ActiveText.Widget.Controller = function(activeTextInstance) {
    'use strict';

    /**
     * @type {ActiveText.Widget.Factory}
     */
    var widgetFactory = ActiveText.Widget.Factory;
    widgetFactory.insertCSS(activeTextInstance);

    /**
     * This is a dictionary object which uses the data object as a key to reference dialogs
     * which have been opened by clicking on a hotspot.
     *
     * @type {object}
     */
    var existingDialogs = {};

    function openWidgetPopoverFromData(data) {
        var hotspotId = getUniqueIdentifierFromData(data);
        var existingDialog = existingDialogs[hotspotId];
        if(existingDialog === undefined) {
            var newWidget = widgetFactory.createWidgetFromData(activeTextInstance, data.data);
            newWidget.dialog().dialog('widget').css({
                opacity: 0,
                transform: 'scale(0.8)'
            }).on('dialogbeforeclose', function(event, ui) {
                existingDialogs[hotspotId] = undefined;
            });
            setTimeout(function() {
                newWidget.dialog().dialog('widget').css({
                    transform: 'scale(1)',
                    opacity: 1
                });
            }, 100);
            existingDialogs[hotspotId] = newWidget;
        }
        else {
            existingDialog.dialog('open');
            requestAnimationFrame(function() {
                existingDialog.dialog().dialog('widget').css({
                    transform: 'scale(1.1)'
                });
                setTimeout(function() {
                    existingDialog.dialog().dialog('widget').css({
                        transform: 'scale(1)'
                    });
                }, 300);
            });
        }

        return false; // return false to suppress the click action elsewhere
    }

    function getWidgetById(id) {
        return existingDialogs[id];
    }

    function getUniqueIdentifierFromData(data) {
        var rtn = data.data.id;
        if(!rtn) {
            rtn = data.data.uri;
        }
        return rtn;
    }

    return {
        openWidgetPopoverFromData: openWidgetPopoverFromData,
        getWidgetById: getWidgetById
    };
};