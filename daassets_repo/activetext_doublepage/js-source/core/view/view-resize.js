/* global ActiveText, requestAnimationFrame, Modernizr */
ActiveText.View = ActiveText.View || {};
/**
 * @class Resize
 * @memberOf ActiveText.View
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init, register: register, deregister: deRegister}}
 * @constructor
 */
ActiveText.View.Resize = function(activeTextInstance) {
    'use strict';

    /**
     * @type {object}
     */
    var whiteboardContainer;

    function init(container) {
        whiteboardContainer = container;
        $(activeTextInstance.options.containerElement).on('remove', teardown);
    }

    function teardown() {
        $(activeTextInstance.options.containerElement).off('remove', teardown);
        $(window, window.top).off('orientationchange');
        removeWindowResizeListeners();
        whiteboardContainer = undefined;
    }

    function register() {
        setupWindowResizeListeners();
    }

    function deRegister() {
        removeWindowResizeListeners();
    }

    function onWindowResize() {
        resizeReaderToFitContainer();
        fixPositions();
    }

    function setupWindowResizeListeners() {
        $(activeTextInstance).on(ActiveText.Events.RESIZE, onWindowResize);
        if(activeTextInstance.utils.isFullWindowScalingMode()) {
            $(window, window.top).on('orientationchange', onWindowResize);
        }
        onWindowResize();
    }

    function removeWindowResizeListeners() {
        $(activeTextInstance).off(ActiveText.Events.RESIZE, onWindowResize);
        $(window, window.top).off('orientationchange', onWindowResize);
    }

    function fixPositions() {
        if(typeof(activeTextInstance.view.getAnimator().fixPagePositions) === 'function') {
            activeTextInstance.view.getAnimator().fixPagePositions();
        }

        if(activeTextInstance.utils.isFullWindowScalingMode()) {
            setTimeout(function() {
                // Hide the address bar!
                window.scrollTo(0, 1);
            }, 0);
        }
    }

    function fitView(dimensions, dpsElement, iframeWrappers, scaleValue) {
        var magnificationValue = activeTextInstance.view.model.getMagnificationValue();
        var individualPages = iframeWrappers.parent();
        var readerWidth = dimensions.width * magnificationValue;
        var dpsWidth = dimensions.dpswidth * magnificationValue;
        var dpsHeight = dimensions.dpsheight * magnificationValue;
        var readerHeight = dimensions.height * magnificationValue;
        var whiteboard = activeTextInstance.view.getContainer();
        var magnifiedScaleValue = scaleValue;
        var iframeElementWidth;
        var iframeElementHeight = Math.ceil(readerHeight * magnifiedScaleValue);
        var pageElementWidth;
        var pageElementHeight = readerHeight;
        var isNotZoomMode = activeTextInstance.view.model.getScaleMode() !== 'zoom';
        var widthReduction = (0 * magnificationValue);
        if(isNotZoomMode) {
            whiteboardContainer.width(readerWidth).height(readerHeight);
        }
        var isSinglePageFitToWidth = ActiveText.ViewUtils.isSinglePageView(activeTextInstance) &&
            activeTextInstance.view.model.getScaleMode() === 'ftw';

        whiteboard.height(readerHeight);
        whiteboardContainer.width(readerWidth - (widthReduction * 2));

        if(isSinglePageFitToWidth) {
            whiteboard.width(readerWidth);
            whiteboardContainer.height(dimensions.availHeight);
            whiteboard.css({
                marginTop: 0
            });
            whiteboardContainer.css({
                overflowY: 'hidden'
            });
        } else {
            whiteboard.width(dpsWidth);

            if(activeTextInstance.behaviours.shouldAllowOverlappingContent()) {
                whiteboard.css({
                    overflowY: 'visible',
                    overflowX: 'visible'
                });
            } else {
                whiteboard.css({
                    overflowY: 'hidden',
                    overflowX: 'hidden'
                });
            }

            whiteboardContainer.css({
                overflowY: 'hidden',
                overflowX: 'hidden'
            });
        }

        if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
            iframeElementWidth = Math.ceil(readerWidth * magnifiedScaleValue);
            pageElementWidth = readerWidth;
        } else {
            iframeElementWidth = Math.ceil(readerWidth * magnifiedScaleValue) / 2;
            pageElementWidth = readerWidth / 2;
        }

        dpsElement.height(readerHeight).width(dpsWidth);
        individualPages.width(pageElementWidth).height(pageElementHeight);

        // empty children don't get scaled down, so we need to do that manually.
        dpsElement.children(':empty').width(readerWidth).height(readerHeight);

        // we want the left page to be slightly thinner, and then no gap in the middle!
        //        individualPages.filter('.leftPage').css({
        //            marginRight: -widthReduction
        //        });

        if(isNotZoomMode) {
            iframeWrappers.width(iframeElementWidth).height(iframeElementHeight);
        } else {
            iframeWrappers.width(pageElementWidth /
                (1 / scaleValue * magnificationValue)).height(pageElementHeight /
                (1 / scaleValue * magnificationValue));
        }

        var isFullWindowScalingMode = activeTextInstance.utils.isFullWindowScalingMode();
        if(isFullWindowScalingMode) {
            activeTextInstance.options.containerElement.css({
                minWidth: window.document.clientWidth,
                minHeight: window.document.clientHeight
            });
        }

        var drawingToolsActive = false;
        var drawingTools = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'drawingtools');
        if(drawingTools) {
            drawingToolsActive = drawingTools.active;
        }
        var isZoomMode = !isNotZoomMode;
        if(isZoomMode && !drawingToolsActive || isSinglePageFitToWidth) {
            $(activeTextInstance).trigger(ActiveText.Commands.ENABLE_PAGE_DRAGGING);
        }
    }

    function resetStyles(parentElement) {
        parentElement.css({
            padding: 0,
            left: 'auto',
            marginTop: 0,
            marginBottom: 0
        });
    }

    function verticallyCenterWhiteboardInsideContainer(activeTextInstance, dimensions, whiteboardContainer) {
        var containerCoordinates = ActiveText.ViewUtils.getContainerCoordinates(activeTextInstance);
        var verticalPaddingSpace = (dimensions.availHeight - dimensions.height) / 2;
        whiteboardContainer.css({
            top: verticalPaddingSpace + containerCoordinates.top,
            marginRight: containerCoordinates.right,
            bottom: verticalPaddingSpace + containerCoordinates.bottom,
            marginLeft: containerCoordinates.left
        });
    }

    function horizontallyAlign(dpsCollection) {
        dpsCollection.css({
            margin: '0',
            marginLeft: 'auto',
            marginRight: 'auto'
        });
    }

    function delayedResizeAction(dimensions, container, activeTextContainer, dpsCollection) {
        function setDimensions() {
            if(activeTextInstance.view.model.getScaleMode() !== 'zoom') {
                whiteboardContainer.height(dimensions.height).width((dimensions.width));
            }
            container.height(dimensions.height).width(dimensions.width - 5);
        }

        function verticallyAlign() {
            verticallyCenterWhiteboardInsideContainer(activeTextInstance, dimensions, whiteboardContainer);
        }

        if(whiteboardContainer) {
            var horizontalDiff = (dimensions.availWidth - dimensions.width) / 2;

            if(activeTextInstance.view.model.getScaleMode() === 'ftw') {
                resetStyles(activeTextContainer);
                whiteboardContainer.css({
                    left: horizontalDiff,
                    top: 0
                });
            } else {
                setDimensions();
                if(activeTextInstance.view.model.getScaleMode() === 'zoom') {
                    whiteboardContainer.css({
                        left: 0
                    });
                } else {
                    verticallyAlign();
                    horizontallyAlign(dpsCollection);
                    whiteboardContainer.css({
                        left: horizontalDiff
                    });
                }
            }

            var scaleValue = ActiveText.ViewUtils.getScaleValue(activeTextInstance);
            var pageWrappers = dpsCollection.find('.rightPage, .leftPage');
            var iFrameWrappers = pageWrappers.find('div.iframe');

            var magnification = activeTextInstance.view.model.getMagnificationValue();
            if(Modernizr.csstransforms) {
                ActiveText.ViewUtils.scaleHTMLElement(activeTextInstance, iFrameWrappers, (1 / scaleValue *
                    magnification));
            } else {
                var iframeElements = iFrameWrappers.find('iframe');
                ActiveText.ViewUtils.scaleHTMLElement(activeTextInstance, iframeElements, (1 / scaleValue *
                    magnification));

                var transformValue = scaleValue;
                if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
                    transformValue = 1 / scaleValue;
                }

                iFrameWrappers.find('div').css({
                    width: 100 * (transformValue) + '%',
                    height: 100 * (transformValue) + '%'
                });
            }

            fitView(dimensions, dpsCollection, iFrameWrappers, scaleValue);
        }
    }

    function resizeReaderToFitContainer() {
        var dimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
        var whiteboard = activeTextInstance.view.getContainer();
        var dpsCollection = activeTextInstance.view.getAllReaders();

        function delayedResizeActionCall() {
            delayedResizeAction(dimensions, whiteboard, $(activeTextInstance.options.containerElement), dpsCollection);
        }

        requestAnimationFrame(delayedResizeActionCall);
    }

    return {
        init: init,
        register: register,
        deregister: deRegister
    };
};