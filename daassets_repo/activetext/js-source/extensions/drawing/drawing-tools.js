/* global ActiveText, Modernizr */
/**
 * @class ActiveText.DrawingTools
 * @memberOf ActiveText
 * @typedef {{init: init, key: string, setCurrentTool: setCurrentTool, clearDrawings: clearDrawings, setActiveColour: setActiveColour, enable: enable, disable: disable, exportCurrentDrawing: exportCurrentDrawing, importDrawing: importDrawing, loadData: function, redraw: redraw, addClick: addClick, dispatchUpdate: dispatchUpdate}}
 * @constructor
 */
ActiveText.DrawingTools = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {ActiveText.DrawingToolsModel}
     */
    var model;

    /**
     * @type {ActiveText.DrawingToolsInteractionController}
     */
    var interactionController;

    /**
     * @type {ActiveText.DrawingToolsSelectionController}
     */
    var selectionController;

    /**
     * @type {ActiveText.DrawingToolsController}
     */
    var controller;

    /**
     * @type {jQuery}
     */
    var viewContainer;

    function getContextForPage(pageIndex) {
        var rtn;
        var container = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, pageIndex, 'drawing');
        if(container) {
            var canvasElement = container.find('canvas').get(0);
            if(canvasElement) {
                rtn = canvasElement.getContext('2d');
            }
        }
        return rtn;
    }

    /**
     * @param pageIndex {number}
     */
    function clearCanvas(pageIndex) {
        var context = getContextForPage(pageIndex);
        if(context !== undefined) {
            var dimensions = activeTextInstance.view.model.getPageDimensions();
            context.clearRect(0, 0, dimensions.width, dimensions.height);
        }
    }

    /**
     * @param pageIndex {number}
     * @param doNotSendDeletedEvent {boolean}
     */
    function clearDrawings(pageIndex, doNotSendDeletedEvent) {
        controller.initStateForIndex(pageIndex);

        clearCanvas(pageIndex);

        if(doNotSendDeletedEvent !== true) {
            $(api).trigger(ActiveText.DrawingTools.Events.DRAWING_DELETED, {index: pageIndex});
        }
    }

    /**
     * @param pageIndex {number}
     */
    function redraw(pageIndex) {
        var radius, i, l;
        var context = getContextForPage(pageIndex);
        var state = controller.getStateForPage(pageIndex);

        if(context === undefined || state === undefined) {
            return;
        }

        clearCanvas(pageIndex);

        var dimensions = activeTextInstance.view.model.getPageDimensions();

        context.save();
        context.fillStyle = ActiveText.ColourUtils.convertHexToRGB('#FFFFFF', 0);
        context.fillRect(0, 0, dimensions.width, dimensions.height);
        context.restore();
        context.save();
        context.beginPath();

        var previousX, previousY, currentX, currentY;

        for(i = 0, l = state.clickX.length; i < l; i++) {
            var currentColour = state.clickColor[i];
            var currentTool = state.clickTool[i];

            if(currentTool === 'pointer') {
                return;
            }

            currentX = state.clickX[i];
            currentY = state.clickY[i];

            if(previousX !== undefined && previousY !== undefined) {
                context.moveTo(previousX, previousY);
            } else {
                context.moveTo(currentX - 1, currentY - 1);
            }

            context.lineTo(currentX, currentY);
            previousX = currentX;
            previousY = currentY;

            radius = state.clickSize[i];

            if(currentTool === 'eraser') {
                context.globalCompositeOperation = 'destination-out';
                context.strokeStyle = 'white';
            } else {
                if(currentTool === 'pen') {
                    context.globalCompositeOperation = 'source-over';
                    context.strokeStyle = currentColour;
                } else if(currentTool === 'highlighter') {
                    context.globalCompositeOperation = 'source-over';
                    context.strokeStyle = ActiveText.ColourUtils.convertHexToRGB(state.clickColor[i], 0.5);
                }
            }
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = radius;

            var thisIsTheLastPointInTheArray = state.clickTool[i + 1] !== undefined;
            var currentToolHasChanged = currentTool !== state.clickTool[i + 1];
            var currentColourHasChanged = currentColour !== state.clickColor[i + 1];
            var currentDragStateHasChanged = (state.clickDrag[i] !== state.clickDrag[i + 1]);
            var falseToFalse = state.clickDrag[i] === false && state.clickDrag[i + 1] === false;
            var isDragging = state.clickDrag[i] === true;

            var shouldFinishLineAndRestart = thisIsTheLastPointInTheArray && currentToolHasChanged ||
                falseToFalse || isDragging && currentDragStateHasChanged || currentColourHasChanged;

            if(shouldFinishLineAndRestart) {
                previousX = undefined;
                previousY = undefined;
                context.stroke();
                context.closePath();
                context.beginPath();
            }
        }
        context.stroke();
        context.closePath();
        context.restore();
        context.globalAlpha = 1;
    }

    /**
     * @param pageIndex {number}
     * @param x {number}
     * @param y {number}
     * @param dragging {boolean}
     */
    function addClick(pageIndex, x, y, dragging) {
        var magnification = 1 / activeTextInstance.view.model.getMagnificationValue();
        var state = controller.getStateForPage(pageIndex);
        var scaleVar = 1 / model.getScale();
        var fixedXPos = x * scaleVar * magnification;
        var fixedYPos = y * scaleVar * magnification;
        var fixedToolSize = interactionController.curSize * scaleVar * magnification;

        state.clickX.push(fixedXPos);
        state.clickY.push(fixedYPos);
        state.clickTool.push(interactionController.curTool);
        state.clickColor.push(interactionController.curColor);
        state.clickSize.push(fixedToolSize);
        state.clickDrag.push(dragging);
    }

    /**
     * @param pageIndex {number}
     */
    function dispatchUpdate(pageIndex) {
        $(api).trigger(ActiveText.DrawingTools.Events.DRAWING_UPDATED, {index: pageIndex});
    }

    /**
     * @param pageIndex {number}
     */
    function enable(pageIndex) {
        api.active = true;
        selectionController.createUserEvents();
        interactionController.createUserEvents();
        ActiveText.LayerUtils.bringLayerToFront(activeTextInstance, pageIndex, 'drawing');

        $(activeTextInstance).on(ActiveText.Events.CHANGE_SCALING_MODE, reactToScalingModeChange);
    }

    function reactToScalingModeChange(event, mode) {
        if(mode === 'zoom' || mode === 'ftw') {
            $(activeTextInstance).trigger(ActiveText.Commands.DISABLE_PAGE_DRAGGING);
        }
    }

    /**
     * @param pageIndex {number}
     */
    function disable(pageIndex) {
        api.active = false;
        selectionController.destroyUserEvents();
        interactionController.destroyUserEvents();

        viewContainer.css({
            userSelect: ''
        }).attr('unselectable', '');

        var drawingToolsExtension = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, pageIndex, 'drawing');
        if(drawingToolsExtension) {
            var canvasElement = drawingToolsExtension.parent();
            canvasElement.css('cursor', '');

            ActiveText.LayerUtils.returnLayerToOriginalDepth(activeTextInstance, pageIndex, 'drawing');
        }

        if(activeTextInstance.view.model.getScaleMode() === 'zoom' ||
            activeTextInstance.view.model.getScaleMode() === 'ftw') {
            $(activeTextInstance).trigger(ActiveText.Commands.ENABLE_PAGE_DRAGGING);
        }
    }

    function resizeCanvas() {
        var dimensions = activeTextInstance.view.model.getPageDimensions();
        var canvas = $(activeTextInstance.options.containerElement).find('canvas');

        $(canvas).attr({
            width: dimensions.width,
            height: dimensions.height
        });

        /**
         * @type {Array}
         */
        var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        for(var i = 0, l = pages.length; i < l; i++) {
            redraw(pages[i]);
        }
    }

    /**
     * @param pageIndex {number}
     * @param drawingData {object}
     */
    function populateDrawingArraysFromObject(pageIndex, drawingData) {
        controller.setStateForPage(pageIndex, drawingData);
    }

    /**
     * @param pageIndex {number}
     * @param drawingData {object}
     */
    function importDrawing(pageIndex, drawingData) {
        clearDrawings(pageIndex, true);
        populateDrawingArraysFromObject(pageIndex, drawingData);
        redraw(pageIndex);
    }

    /**
     * @param pageIndex {number}
     * @param loadedData {string}
     */
    function renderDrawingFromData(pageIndex, loadedData) {
        $(activeTextInstance).trigger(ActiveText.DrawingTools.Events.DRAWING_TOOLS_LOAD_START, {index: pageIndex});

        var parsedData = JSON.parse(loadedData);
        importDrawing(pageIndex, parsedData);

        $(activeTextInstance).trigger(ActiveText.DrawingTools.Events.DRAWING_TOOLS_LOAD_COMPLETE, {index: pageIndex});
    }

    function internalLoadDataFunction(pageIndex, data) {
        var savedDrawingData = null;

        if(typeof data === 'undefined' || typeof data !== 'string') {
            // data not defined so fallback to localStorage
            savedDrawingData = ActiveText.DrawingToolsJStorageExtension.loadData(activeTextInstance, pageIndex);
        } else if(typeof data === 'string') {
            // otherwise if its a string as expected do something with it.
            savedDrawingData = data;
        }

        if(savedDrawingData !== null) {
            renderDrawingFromData(pageIndex, savedDrawingData);
        } else {
            clearDrawings(pageIndex, true);
        }
    }

    function loadDrawingsOnPageChange(event, data) {
        /**
         * @type {Array}
         */
        var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);

        /**
         * @type {Function}
         */
        var loadFunction = function(scope, page, data) {
            internalLoadDataFunction.call(this, page);
        };

        if(typeof activeTextInstance.options.drawingToolsLoadDataFunction === 'function') {
            loadFunction = activeTextInstance.options.drawingToolsLoadDataFunction;
        }

        for(var i = 0, l = pages.length; i < l; i++) {
            var canvasContainer = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, pages[i], 'drawing');
            canvasContainer.css({
                visibility: 'hidden'
            });
            createCanvasElementForContainer(pages[i], canvasContainer);
            clearCanvas(pages[i]);
            loadFunction(activeTextInstance, pages[i]);
        }
    }

    function makeCanvasVisible(event, data) {
        var canvasContainer = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, data.index, 'drawing');
        if(canvasContainer) {
            canvasContainer.css({
                visibility: ''
            });
        }
    }

    function createCanvasElementForContainer(pageIndex, canvasContainer) {
        if(canvasContainer) {
            if(!$(canvasContainer).find('canvas').length) {
                var canvas = ActiveText.DrawingTools.Factory.createCanvas();

                viewContainer.css({
                    userSelect: 'none'
                }).attr('unselectable', 'on');

                canvasContainer.get(0).appendChild(canvas);
            }
        }
    }

    function delayedInit() {
        viewContainer = activeTextInstance.view.getContainer();
        model = new ActiveText.DrawingToolsModel(activeTextInstance, viewContainer);
    }

    function init(instance) {
        if(supported) {
            activeTextInstance = instance;
            $(activeTextInstance).one(ActiveText.Events.BOOK_STRUCTURE_LOADED, delayedInit);

            controller = new ActiveText.DrawingToolsController(activeTextInstance);
            controller.init(api);

            selectionController = new ActiveText.DrawingToolsSelectionController(activeTextInstance, api);
            interactionController = new ActiveText.DrawingToolsInteractionController(activeTextInstance, api);

            if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.containerElement) {
                $(activeTextInstance.options.containerElement).on('remove', teardown);
            }
        }
    }

    function teardown() {
        $(activeTextInstance).off(ActiveText.Events.BOOK_STRUCTURE_LOADED, delayedInit);
        $(activeTextInstance.options.containerElement).off('remove', teardown);
        $(activeTextInstance).off(ActiveText.Events.CHANGE_SCALING_MODE, reactToScalingModeChange);
    }

    function setCurrentTool() {
        return interactionController.setCurrentTool.apply(api || window, arguments);
    }

    function setActiveColour() {
        return interactionController.setActiveColour.apply(api || window, arguments);
    }

    function exportCurrentDrawing(pageIndex) {
        return controller.exportCurrentDrawing(pageIndex);
    }

    function supported() {
        return Modernizr.canvas;
    }

    var api = {
        init: init,
        key: 'drawingtools',
        setCurrentTool: setCurrentTool,
        clearDrawings: clearDrawings,
        setActiveColour: setActiveColour,
        enable: enable,
        disable: disable,
        exportCurrentDrawing: exportCurrentDrawing,
        importDrawing: importDrawing,
        loadData: internalLoadDataFunction,
        redraw: redraw,
        addClick: addClick,
        dispatchUpdate: dispatchUpdate,
        supported: supported,
        resize: resizeCanvas,
        loadDrawingsOnPageChange: loadDrawingsOnPageChange,
        makeCanvasVisible: makeCanvasVisible,
        active: false
    };

    return api;
};