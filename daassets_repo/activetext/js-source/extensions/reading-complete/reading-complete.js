/* global ActiveText */
/**
 * @class ReadingComplete
 * @memberOf ActiveText
 * @returns {{init: init}}
 * @constructor
 */
ActiveText.ReadingComplete = function() {
    'use strict';

    var activeTextInstance;

    function init(instance) {
        if(instance && instance.options && instance.options.containerElement) {
            activeTextInstance = instance;
            $(activeTextInstance.options.containerElement).on('remove', teardown);
            $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, onPageChange);
        }
    }

    function teardown() {
        $(activeTextInstance.options.containerElement).off('remove', teardown);
        $(activeTextInstance).off(ActiveText.Commands.GO_TO_PAGE, onPageChange);
        activeTextInstance = undefined;
    }

    function onPageChange(event, data) {
        var maxIndex = ActiveText.NavigationUtils.getMaximumValidPageIndex(activeTextInstance);
        var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        var isFinalPage = false;
        for(var i = 0, l = visiblePages.length; i < l; i++) {
            if(visiblePages[i] === maxIndex) {
                isFinalPage = true;
            }
        }
        if(isFinalPage) {
            $(activeTextInstance).trigger(ActiveText.ReadingComplete.Events.READING_COMPLETE);
        }
    }

    return {
        init: init,
        key: 'readingcomplete'
    };
};