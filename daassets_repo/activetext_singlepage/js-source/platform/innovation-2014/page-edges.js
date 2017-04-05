/* global ActiveText, Innovation */
/**
 * @class PageEdgeFactory
 * @memberOf Innovation
 * @param activeTextInstance {ActiveText}
 * @returns {{generateEdges: generateEdges, removeEdges: removeEdges, minimumWidth: number}}
 * @constructor
 */
Innovation.PageEdgeFactory = function(activeTextInstance) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var MINIMUM_OVERFLOW_WIDTH = 44;

    var MAX_FONT_ICON_SIZE = 100;

    var nextButtons = [],
        prevButtons = [];

    var leftEdge, rightEdge;

    function refreshAllButtons() {
        $(nextButtons).each(function(index, element) {
            var canGoAgain = activeTextInstance.navigation.canGoToNextPage();
            if(canGoAgain) {
                $(element).removeClass('disabled').attr('aria-disabled', false).fadeIn();
            } else {
                $(element).addClass('disabled').attr('aria-disabled', true).fadeOut();
            }
        });

        $(prevButtons).each(function(index, element) {
            var canGoAgain = activeTextInstance.navigation.canGoToPreviousPage();
            if(canGoAgain) {
                $(element).removeClass('disabled').attr('aria-disabled', false).fadeIn();
            } else {
                $(element).addClass('disabled').attr('aria-disabled', true).fadeOut();
            }
        });
    }

    function rightEdgeClickHandler() {
        activeTextInstance.navigation.gotoNextPage();
        refreshAllButtons();
    }

    function leftEdgeClickHandler() {
        activeTextInstance.navigation.gotoPrevPage();
        refreshAllButtons();
    }

    function onResize() {
        var dimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
        var buttonWidth = -(dimensions.width - dimensions.availWidth) / 2;
        var edges = $(leftEdge).add(rightEdge);
        var horizontalMargins = 10;

        if(buttonWidth < MINIMUM_OVERFLOW_WIDTH) {
            buttonWidth = MINIMUM_OVERFLOW_WIDTH;
            edges.addClass('overlap');
        } else {
            edges.removeClass('overlap');
        }

        var containerCoordinates = ActiveText.ViewUtils.getContainerCoordinates(activeTextInstance);
        var controlsExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'controls');
        var barHeight = 0;
        if(controlsExtension) {
            barHeight = controlsExtension.getBarHeight();
        }

        edges.css({
            width: buttonWidth,
            height: dimensions.availHeight + containerCoordinates.top + (containerCoordinates.bottom - barHeight)
        });

        if(buttonWidth > MAX_FONT_ICON_SIZE) {
            horizontalMargins = (buttonWidth - MAX_FONT_ICON_SIZE) / 2;
            buttonWidth = MAX_FONT_ICON_SIZE;
        }

        if(buttonWidth === MINIMUM_OVERFLOW_WIDTH) {
            leftEdge.width(buttonWidth + (horizontalMargins * 2));
            rightEdge.width(buttonWidth + (horizontalMargins * 2));
        }
    }

    function generateEdges(container) {
        if(!activeTextInstance.utils.isFullWindowScalingMode()) {
            container.css({
                position: 'relative'
            });
        }

        var leftTemplate = '<div class="left-edge page-edge" role="button" tabindex="0" title="Previous Page" aria-label="Previous Page"><a>' +
            '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33%" ' +
            'height="100%" viewBox="0 0 6.363 11.29" enable-background="new 0 0 6.363 11.29" xml:space="preserve" style="max-width:22px">' +
            '<polygon fill="url(#SVGID_1_)" points="0.707,4.926 0,5.633 0.707,6.34 1.883,7.517 5.655,11.29 6.363,10.583 1.414,5.633 6.34,0.707 5.632,0 2.809,2.824 "/>' +
            '</svg>' +
            '</a></div>';
        leftEdge = $(leftTemplate).css({
            left: 0,
            position: activeTextInstance.utils.isFullWindowScalingMode() ? 'fixed' : 'absolute',
            top: 0,
            zIndex: 1000,
            cursor: 'pointer'
        });
        leftEdge.find('a').css({
            left: 0,
            right: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            textAlign: 'center'
        });
        leftEdge.find('i').css({
            display: 'inline-block'
        });
        prevButtons.push(leftEdge);

        var template = '<div class="right-edge page-edge" role="button" tabindex="1" title="Next Page" aria-label="Next Page"><a>' +
            '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33%" ' +
            'height="100%" viewBox="0 0 6.364 11.29" enable-background="new 0 0 6.364 11.29" xml:space="preserve" style="max-width:22px">' +
            '<polygon fill="url(#SVGID_1_)" points="5.657,6.364 6.364,5.657 5.657,4.95 4.48,3.773 0.707,0 0,0.707 4.95,5.657 0.023,10.583 0.73,11.29 3.554,8.467 "/>' +
            '</svg>' +
            '</a></div>';
        rightEdge = $(template).css({
            right: 0,
            position: activeTextInstance.utils.isFullWindowScalingMode() ? 'fixed' : 'absolute',
            top: 0,
            zIndex: 1000,
            cursor: 'pointer'
        });
        rightEdge.find('a').css({
            left: 0,
            right: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            textAlign: 'center'
        });
        rightEdge.find('i').css({
            display: 'inline-block'
        });
        nextButtons.push(rightEdge);

        if(!activeTextInstance.navigation.canGoToNextPage()) {
            rightEdge.addClass('disabled').attr('aria-disabled', true);
        }
        if(!activeTextInstance.navigation.canGoToPreviousPage()) {
            leftEdge.addClass('disabled').attr('aria-disabled', true);
        }
        onResize();

        var whiteboardContainer = container.find('.whiteboard-container');
        leftEdge.insertAfter(whiteboardContainer);
        rightEdge.insertAfter(whiteboardContainer);

        rightEdge.click(rightEdgeClickHandler);
        leftEdge.click(leftEdgeClickHandler);

        $(activeTextInstance).one(ActiveText.Events.BOOK_STRUCTURE_LOADED, refreshAllButtons);
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, refreshAllButtons);
        $(activeTextInstance).on(ActiveText.Events.RESIZE, onResize);
    }

    function removeEdges() {
        leftEdge.remove();
        rightEdge.remove();
        nextButtons = [];
        prevButtons = [];
        $(activeTextInstance).off(ActiveText.Events.BOOK_STRUCTURE_LOADED, refreshAllButtons);
        $(activeTextInstance).off(ActiveText.Commands.GO_TO_PAGE, refreshAllButtons);
        $(activeTextInstance).off(ActiveText.Events.RESIZE, onResize);
    }

    return {
        generateEdges: generateEdges,
        removeEdges: removeEdges,
        minimumWidth: 64
    };
};