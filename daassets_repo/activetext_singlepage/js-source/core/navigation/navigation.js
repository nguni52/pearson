/* global ActiveText */
ActiveText.Navigation = ActiveText.Navigation || {};
/**
 * @class Controller
 * @memberOf ActiveText.Navigation
 * @param activeTextInstance {ActiveText}
 * @returns {{canGoToPreviousPage: canGoToPreviousPage, gotoPrevPage: gotoPrevPage, canGoToNextPage: canGoToNextPage, gotoNextPage: gotoNextPage, gotoPage: goToPage}}
 * @constructor
 */
ActiveText.Navigation.Controller = function(activeTextInstance) {
    'use strict';

    /**
     * @param from {number}
     * @param to {number}
     * @param immediate {boolean=}
     */
    function internalGoToPage(from, to, immediate) {
        var duration;
        if(immediate) {
            duration = 0;
        }

        $(activeTextInstance).trigger(ActiveText.Commands.GO_TO_PAGE, {
            fromPage: from,
            toPage: to,
            duration: duration
        });
    }

    /**
     * @param pageNumber {number}
     * @param immediate {boolean=}
     */
    function goToPage(pageNumber, immediate) {
        var oldIndex = activeTextInstance.model.getCurrentIndex();
        var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
        var nearestValidPageIndex = ActiveText.NavigationUtils.getNearestValidPageFromIndex(activeTextInstance, pageIndex);
        var newIndex = nearestValidPageIndex;
        if(!ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
            newIndex = ActiveText.NavigationUtils.calculateLeftmostPageIndexFromIndex(activeTextInstance, nearestValidPageIndex);
        }

        var validIndex = activeTextInstance.model.setCurrentIndex(newIndex);
        internalGoToPage(oldIndex, validIndex, immediate);
    }

    /**
     * @returns {boolean}
     */
    function canGoToPreviousPage() {
        return (activeTextInstance.model.getCurrentIndex() - activeTextInstance.view.model.getDisplayedPages()) >=
            ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance);
    }

    /**
     * @returns {boolean}
     */
    function canGoToNextPage() {
        var pages = activeTextInstance.data.getFlatListOfNavigation();
        return (activeTextInstance.model.getCurrentIndex() + activeTextInstance.view.model.getDisplayedPages()) <
            pages.length;
    }

    /**
     * @returns {boolean}
     */
    function gotoNextPage() {
        var success = false;
        if(canGoToNextPage()) {
            var originalIndex = activeTextInstance.model.getCurrentIndex();
            var newIndex = originalIndex + activeTextInstance.view.model.getDisplayedPages();
            var validIndex = activeTextInstance.model.setCurrentIndex(newIndex);
            internalGoToPage(originalIndex, validIndex);
            success = true;
        }
        return success;
    }

    /**
     * @returns {boolean}
     */
    function gotoPrevPage() {
        var success = false;
        if(canGoToPreviousPage()) {
            var originalIndex = activeTextInstance.model.getCurrentIndex();
            var newIndex = originalIndex - activeTextInstance.view.model.getDisplayedPages();
            var validIndex = activeTextInstance.model.setCurrentIndex(newIndex);
            internalGoToPage(originalIndex, validIndex);
            success = true;
        }
        return success;
    }

    return {
        canGoToPreviousPage: canGoToPreviousPage,
        gotoPrevPage: gotoPrevPage,
        canGoToNextPage: canGoToNextPage,
        gotoNextPage: gotoNextPage,
        gotoPage: goToPage
    };
};