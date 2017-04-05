/* global ActiveText, Modernizr */
/**
 * @class ActiveText.DrawingToolsController
 * @memberOf ActiveText.DrawingTools
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init, initStateForIndex: initStateForIndex, getStateForPage: getStateForPage, setStateForPage: setStateForPage, exportCurrentDrawing: exportCurrentDrawing}}
 * @constructor
 */
ActiveText.DrawingToolsController = function(activeTextInstance) {
    'use strict';

    /**
     * @type {{}}
     */
    var states = {};

    /**
     * @type {ActiveText.DrawingTools}
     */
    var drawingTools;

    function getStateForPage(pageIndex) {
        var rtn = states[String(pageIndex)];
        if(!rtn) {
            initStateForIndex(pageIndex);
            rtn = states[String(pageIndex)];
        }
        return  rtn;
    }

    function setStateForPage(pageIndex, context) {
        states[String(pageIndex)] = context;
    }

    function initStateForIndex(pageIndex) {
        setStateForPage(pageIndex, {
            clickX: [],
            clickY: [],
            clickColor: [],
            clickTool: [],
            clickSize: [],
            clickDrag: []
        });
    }

    /**
     * @param {number} pageIndex
     * @returns {{clickX: Array, clickY: Array, clickTool: Array, clickColor: Array, clickSize: Array, clickDrag: Array}}
     */
    function exportCurrentDrawing(pageIndex) {
        return getStateForPage(pageIndex);
    }

    /**
     * @param pageIndex {number}
     * @returns {string}
     */
    function getDrawingData(pageIndex) {
        var drawingData = exportCurrentDrawing(pageIndex);
        return JSON.stringify(drawingData);
    }

    /**
     * @param {object} event
     * @param {object} data
     */
    function saveDrawingDataFromEvent(event, data) {
        var pageIndex = data.index;
        var drawingData = getDrawingData(pageIndex);
        saveDrawingDataForPageIndex(pageIndex, drawingData);
    }

    function saveDrawingDataForPageIndex(pageIndex, drawingData) {
        if(typeof activeTextInstance.options.drawingToolsGetDataFunction === 'function') {
            activeTextInstance.options.drawingToolsGetDataFunction(activeTextInstance, pageIndex, drawingData);
        } else {
            ActiveText.DrawingToolsJStorageExtension.drawingToolsGetDataFunction(activeTextInstance, pageIndex, drawingData);
        }
    }

    function delayedInit() {
        $(activeTextInstance).on(ActiveText.Events.RESIZE, drawingTools.resize);
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, drawingTools.loadDrawingsOnPageChange);

        $(drawingTools).on(ActiveText.DrawingTools.Events.DRAWING_DELETED, saveDrawingDataFromEvent);
        $(drawingTools).on(ActiveText.DrawingTools.Events.DRAWING_UPDATED, saveDrawingDataFromEvent);

        var resizeFunction = ActiveText.ResizeUtils.getProportionalResizeBehaviour(activeTextInstance, 'drawing');
        $(activeTextInstance).on(ActiveText.Events.RESIZE, resizeFunction);

        $(activeTextInstance).on(ActiveText.Events.FRAME_CONTENT_LOADED, drawingTools.makeCanvasVisible);

        drawingTools.resize();

        // assume that the GO_TO_PAGE event has already fired, so manually re-trigger it.
        drawingTools.loadDrawingsOnPageChange(undefined, {
            toPage: activeTextInstance.model.getCurrentPageNumber()
        });
    }

    /**
     * @param instance {ActiveText.DrawingTools}
     */
    function init(instance) {
        drawingTools = instance;
        $(activeTextInstance).one(ActiveText.Events.BOOK_STRUCTURE_LOADED, delayedInit);
    }

    /**
     * @type {{init: init, initStateForIndex: initStateForIndex, getStateForPage: getStateForPage, setStateForPage: setStateForPage, exportCurrentDrawing: exportCurrentDrawing}}
     */
    var api = {
        init: init,
        initStateForIndex: initStateForIndex,
        getStateForPage: getStateForPage,
        setStateForPage: setStateForPage,
        exportCurrentDrawing: exportCurrentDrawing
    };

    return api;
};