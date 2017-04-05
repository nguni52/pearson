/* global ActiveText */
/**
 * @class MinimalPageEdgeFactory
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{generateEdges: generateEdges, removeEdges: removeEdges, minimumWidth: number}}
 * @constructor
 */
ActiveText.MinimalPageEdgeFactory = function(activeTextInstance) {
    'use strict';

    /** @const */
    var MINIMUM_OVERFLOW_WIDTH = 44;

    /** @const */
    var MAX_FONT_ICON_SIZE = 100;

    var nextButtons = [],
        prevButtons = [];

    var leftEdge, rightEdge;

    function refreshAllButtons() {
        $(nextButtons).each(function(index, element) {
            var canGoAgain = activeTextInstance.navigation.canGoToNextPage();
            if(canGoAgain) {
                $(element).removeClass('disabled').attr('aria-disabled', false);
            } else {
                $(element).addClass('disabled').attr('aria-disabled', true);
            }
        });

        $(prevButtons).each(function(index, element) {
            var canGoAgain = activeTextInstance.navigation.canGoToPreviousPage();
            if(canGoAgain) {
                $(element).removeClass('disabled').attr('aria-disabled', false);
            } else {
                $(element).addClass('disabled').attr('aria-disabled', true);
            }
        });
    }

    function rightEdgeClickHandler() {
        $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
            which: 'rightedge'
        });
        activeTextInstance.navigation.gotoNextPage();
        refreshAllButtons();
    }

    function leftEdgeClickHandler() {
        $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
            which: 'leftedge'
        });
        activeTextInstance.navigation.gotoPrevPage();
        refreshAllButtons();
    }

    function injectCSSTag() {
        if(ActiveText.UI && ActiveText.UI.FontInjection && !ActiveText.UI.FontInjection.hasBeenAdded()) {
            ActiveText.UI.FontInjection.injectFontTag();
        }

        var cssString = ActiveText.MinimalPageEdgeFactory.Style.getStyle(activeTextInstance);
        ActiveText.CSSUtils.embedCSS(cssString, activeTextInstance.options.containerElement.selector +
            '-minimal-page-edge');
    }

    function onResize() {
        var dimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
        var buttonWidth = -(dimensions.width - dimensions.availWidth) / 2;
        var edges = $(leftEdge).add(rightEdge);
        var buttons = $(leftEdge.find('i')).add(rightEdge.find('i'));
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
        buttons.css({
            fontSize: buttonWidth,
            lineHeight: Math.floor(buttonWidth * 0.7) + 'px',
            marginTop: (dimensions.availHeight - (Math.floor(buttonWidth) / 2)) / 2,
            paddingLeft: horizontalMargins,
            paddingRight: horizontalMargins
        });

        if(buttonWidth === MINIMUM_OVERFLOW_WIDTH) {
            leftEdge.width(buttonWidth + (horizontalMargins * 2));
            rightEdge.width(buttonWidth + (horizontalMargins * 2));
        }
    }

    function generateEdges(container) {
        injectCSSTag();

        container = container.parent().parent();

        if(!activeTextInstance.utils.isFullWindowScalingMode()) {
            container.css({
                position: 'relative'
            });
        }

        var leftEdgeString = '<div class="minimal-edge leftEdge" role="button" tabindex="0" title="Previous Page" aria-label="Previous Page">' +
            '<a role="presentation">' +
            '<i class="icon-angle-left"></i>' +
            //            '<i role="presentation">‹</i>' +

            '</a>' +
            '</div>';
        leftEdge = $(leftEdgeString).css({
            left: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            zIndex: 1000,
            textDecoration: 'none'
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

        var rightEdgeString = '<div class="minimal-edge rightEdge" role="button" tabindex="1" title="Next Page" aria-label="Next Page">' +
            '<a role="presentation">' +
            '<i class="icon-angle-right"></i>' +
            //            '<i role="presentation">›</i>' +
            '</a>' +
            '</div>';
        rightEdge = $(rightEdgeString).css({
            right: 0,
            position: 'absolute',
            top: 0,
            bottom: 0,
            zIndex: 1000,
            textDecoration: 'none'
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