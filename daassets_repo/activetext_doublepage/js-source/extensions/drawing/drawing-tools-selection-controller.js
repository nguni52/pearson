/* global ActiveText */
/**
 * @class DrawingToolsSelectionController
 * @memberOf ActiveText
 * @class {{createUserEvents: createUserEvents, destroyUserEvents: destroyUserEvents}}
 */
ActiveText.DrawingToolsSelectionController = function(activeTextInstance) {
    'use strict';

    function removeSelection() {
        if(document.selection) {
            document.selection.clear();
        }
    }

    function press() {
        removeSelection();
    }

    function drag() {
        removeSelection();
    }

    function release() {
        removeSelection();
    }

    function createUserEvents() {
        destroyUserEvents();

        var container = activeTextInstance.view.getContainer();
        $(container).on({
            mousedown: press,
            mousemove: drag,
            mouseup: release,
            selectstart: cancelEvent,
            touchstart: press,
            touchmove: drag,
            touchend: release
        });
    }

    function cancelEvent() {
        return false;
    }

    function destroyUserEvents() {
        var container = activeTextInstance.view.getContainer();
        $(container).off({
            mousedown: press,
            mousemove: drag,
            mouseup: release,
            selectstart: cancelEvent,
            touchstart: press,
            touchmove: drag,
            touchend: release
        });
    }

    /**
     * @type {{createUserEvents: createUserEvents, destroyUserEvents: destroyUserEvents}}
     */
    var api = {
        createUserEvents: createUserEvents,
        destroyUserEvents: destroyUserEvents
    };

    return api;
};
