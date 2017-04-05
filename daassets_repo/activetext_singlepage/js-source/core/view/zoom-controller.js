/* global ActiveText */
/**
 * @class ZoomController
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{register: register, deregister: deregister}}
 * @constructor
 */
ActiveText.ZoomController = function(activeTextInstance) {
    'use strict';

    /**
     * @param event {object}
     * @param spreadHeight {int}
     * @param spreadWidth {int}
     */
    function enableMouseDragScrolling(event) {
        var options = {};
        var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        options.isSPS = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
        options.isRightMostPage = ActiveText.ViewUtils.isTheRightHandPage(activeTextInstance, visiblePages);

        var dimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
        var magnificationValue = activeTextInstance.view.model.getMagnificationValue();
        var spreadWidth = (options.isSPS ? dimensions.width : dimensions.dpswidth) * magnificationValue;
        var spreadHeight = (options.isSPS ? dimensions.height : dimensions.dpsheight) * magnificationValue;
        var scaleMode = activeTextInstance.view.model.getScaleMode();
        var animateContainer = activeTextInstance.view.getContainer().find('.animate-container');

        if(scaleMode === 'ftw') {
            options.axis = 'y';
        }

        if(activeTextInstance.options.fitToWidthPageDragging === false) {
            allowWhiteBoardContainerToScroll(true);
            return;
        }

        applyZoomDraggableBehaviours(spreadHeight, spreadWidth, options);
        ActiveText.LayerUtils.disableDraggingWhenDrawing(activeTextInstance, ActiveText.LayerUtils.returnDrawingToolsState());
    }

    /**
     * @param {object} event
     */
    function disableMouseDragScrolling(event) {
        try {
            activeTextInstance.view.getContainer().draggable('destroy');
            activeTextInstance.view.getContainer().parent().draggable('destroy');
        } catch(e) {
            //debug.log('ViewResize: An Error occurred trying to destroy the draggable behaviours');
        }
    }

    /**
     * @param {boolean} allow
     */
    function allowWhiteBoardContainerToScroll(allow) {
        var whiteboardContainer = activeTextInstance.view.getContainer().parent();
        whiteboardContainer.css({
            top: 0,
            height: 'auto'
        });
    }

    function applyZoomDraggableBehaviours(spreadHeight, spreadWidth, extraOptions) {
        //        console.log('applyZoomDraggableBehaviours');
        var whiteboardContainer = activeTextInstance.view.getContainer().parent();
        var animateContainer = whiteboardContainer.find('.animate-container');

        if($('#panContainer').length < 1) {
            whiteboardContainer.parent().prepend('<div id="panContainer"></div>');
        }

        var containerCoordinates = ActiveText.ViewUtils.getContainerCoordinates(activeTextInstance);
        var targetHeight = whiteboardContainer.parent().height() -
            (containerCoordinates.top + containerCoordinates.bottom);
        var targetWidth = whiteboardContainer.parent().width() -
            (containerCoordinates.left + containerCoordinates.right);
        var cssLeft = containerCoordinates.left;

        var verticalOverlap = (spreadHeight - targetHeight);
        var horizontalOverlap = (spreadWidth - targetWidth);

        if(verticalOverlap < 0) {
            verticalOverlap = 0;
        }
        if(horizontalOverlap < 0) {
            cssLeft = (-horizontalOverlap) / 2;
            horizontalOverlap = 0;
            targetWidth = spreadWidth;
        }
        whiteboardContainer.css('left', cssLeft);

        $('#panContainer').css({
            position: 'absolute',
            height: ((verticalOverlap * 2) + targetHeight),
            width: ((horizontalOverlap * 2) + targetWidth),
            marginTop: -verticalOverlap,
            marginLeft: -horizontalOverlap,
            top: containerCoordinates.top,
            left: cssLeft
        });

        if(extraOptions.isSPS && extraOptions.isRightMostPage){
            setTimeout(function(){
                animateContainer.css('left', -spreadWidth);
            }, 250);
        } else {
            animateContainer.css('left', 0);
        }

        try {
            activeTextInstance.view.getContainer().draggable('destroy');
            activeTextInstance.view.getContainer().parent().draggable('destroy');
        } catch(e) {
            //debug.log('ViewResize: An Error occurred trying to destroy the draggable behaviours');
        }

        var defaults = {
            containment: '#panContainer'
        };

        if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
            //defaults.iframeFix = $('iframe');
            defaults.create = function() {
                var elements = $('iframe ~ div');
                var i, element;

                for(i = 0; i < elements.length; i++) {
                    element = $(elements[i]);

                    ActiveText.ViewUtils.setOpacityValue(element, 0);
                    element.css({
                        backgroundColor: '#000'
                    });
                }
            };
        }

        var options = $.extend({}, defaults, extraOptions);

        if(activeTextInstance.view.model.getScaleMode() === 'ftw') {
            try {
                activeTextInstance.view.getContainer().draggable(options);
            } catch(e) {
                //                    debug.log('ViewResize: An Error occurred trying to destroy the draggable behaviours');
            }
        } else {
            try {
                activeTextInstance.view.getContainer().parent().draggable(options);
            } catch(e) {
                //                    debug.log('ViewResize: An Error occurred trying to destroy the draggable behaviours');
            }
        }
    }

    /**
     * @param event {object}
     * @param mode {string}
     */
    function reactToScalingModeChange(event, mode) {
        var whiteboard = activeTextInstance.view.getContainer();
        var edgeFactory = activeTextInstance.view.getEdgeFactory();
        var isDoublePageView = ActiveText.ViewUtils.isDoublePageView(activeTextInstance);
        if(edgeFactory && edgeFactory.removeEdges) {
            edgeFactory.removeEdges();
        }

        if(mode === 'zoom') {
            if(isDoublePageView){
                $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_DPS_VIEW);
            } else {
                $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_SPS_VIEW);
            }
            disableAllPageInteractions();
            whiteboard.css({
                cursor: 'move'
            });
            activeTextInstance.options.containerElement.css({
                overflow: 'hidden'
            });
            allowWhiteBoardContainerToScroll(false);
        } else if(mode === 'ftw') {
            $('#panContainer').remove();

            if(edgeFactory && edgeFactory.generateEdges) {
                edgeFactory.generateEdges(whiteboard);
            }
            
            disableAllPageInteractions();
            activeTextInstance.options.containerElement.css({
                overflow: 'hidden'
            });
            $(activeTextInstance.view.getContainer()).css({
                cursor: 'move'
            });
        } else {
            $('#panContainer').remove();

            if(edgeFactory && edgeFactory.generateEdges) {
                edgeFactory.generateEdges(whiteboard);
            }

            whiteboard.css({
                top: 0,
                left: 0,
                cursor: ''
            });

            try {
                if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
                    $('iframe ~ div').css({
                        background: 'none'
                    });
                }
                whiteboard.draggable('destroy');
                whiteboard.parent().draggable('destroy');
            } catch(e) {
            }
            enableAllPageInteractions();
        }
        $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
    }

    function disableAllPageInteractions() {
        activeTextInstance.view.disableInteraction();
    }

    function enableAllPageInteractions() {
        activeTextInstance.view.enableInteraction();
    }

    function register() {
        $(activeTextInstance).on(ActiveText.Commands.ENABLE_PAGE_DRAGGING, enableMouseDragScrolling);
        $(activeTextInstance).on(ActiveText.Commands.DISABLE_PAGE_DRAGGING, disableMouseDragScrolling);
        $(activeTextInstance).on(ActiveText.Events.CHANGE_SCALING_MODE, reactToScalingModeChange);
    }

    function deregister() {
        $(activeTextInstance).off(ActiveText.Commands.ENABLE_PAGE_DRAGGING, enableMouseDragScrolling);
        $(activeTextInstance).off(ActiveText.Commands.DISABLE_PAGE_DRAGGING, disableMouseDragScrolling);
        $(activeTextInstance).off(ActiveText.Events.CHANGE_SCALING_MODE, reactToScalingModeChange);
    }

    return {
        register: register,
        deregister: deregister
    };
};
