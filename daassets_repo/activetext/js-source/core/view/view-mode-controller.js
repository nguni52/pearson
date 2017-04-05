/* global ActiveText */
ActiveText.View = ActiveText.View || {};
/**
 * @class Controller
 * @memberOf ActiveText.View
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init}}
 * @constructor
 */
ActiveText.View.Controller = function(activeTextInstance) {
    'use strict';

    function init() {
        var signalBus = $(activeTextInstance);
        signalBus.on(ActiveText.Commands.SWITCH_TO_DPS_VIEW, switchToDPSView);
        signalBus.on(ActiveText.Commands.SWITCH_TO_SPS_VIEW, switchToSinglePageFitToHeightView);
        signalBus.on(ActiveText.Commands.SWITCH_TO_SPS_FTW_VIEW, switchToSinglePageFitToWidthView);
        signalBus.on(ActiveText.Commands.SWITCH_TO_ZOOM_MODE, switchToZoomMode);
    }

    function scrollContainerToTop() {
        activeTextInstance.options.containerElement.find('.whiteboard-container,.whiteboard').animate({
            scrollTop: 0
        }, 0);
    }

    function switchToDPSView() {
        if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
            var currentIndex = activeTextInstance.model.getCurrentPageNumber();
            activeTextInstance.view.model.setDisplayedPages(2);
            setScalingModeToFitToHeight();
            activeTextInstance.navigation.gotoPage(currentIndex, true);
            $(activeTextInstance).trigger(ActiveText.Events.VIEW_MODE_CHANGED);
            $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
        }
    }

    function switchToZoomMode() {
        activeTextInstance.options.containerElement.find('.whiteboard-container,.whiteboard').animate({
            top: 0,
            scrollTop: 0
        }, 0);

        activeTextInstance.view.model.setScaleMode('zoom');
        $(activeTextInstance).trigger(ActiveText.Events.VIEW_MODE_CHANGED);
        $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
    }

    function setScalingModeToFitToWidth() {
        activeTextInstance.view.model.setScaleMode('ftw');
    }

    function setScalingModeToFitToHeight() {
        if(activeTextInstance.view.model.getScaleMode() !== 'zoom'){
            scrollContainerToTop();
            activeTextInstance.view.model.setScaleMode('fth');
        }
    }

    function switchToSinglePageView() {
        activeTextInstance.view.getContainer().parent().css({
            overflow: 'hidden'
        });

        // todo: I'm sure there's a cleaner way to ask this.
        var isInDPSViewMode = Boolean(activeTextInstance.view.model.getDisplayedPages() > 1);
        if(isInDPSViewMode) {
            var leftMostPageNumber = activeTextInstance.model.getCurrentPageNumber();
            activeTextInstance.view.model.setDisplayedPages(1);
            activeTextInstance.navigation.gotoPage(leftMostPageNumber, true);
        }
    }

    function switchToSinglePageFitToWidthView() {
        switchToSinglePageView();
        setScalingModeToFitToWidth();
        $(activeTextInstance).trigger(ActiveText.Events.VIEW_MODE_CHANGED);
        $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
    }

    function switchToSinglePageFitToHeightView() {
        switchToSinglePageView();
        setScalingModeToFitToHeight();
        $(activeTextInstance).trigger(ActiveText.Events.VIEW_MODE_CHANGED);
        $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
    }

    return {
        init: init
    };
};
