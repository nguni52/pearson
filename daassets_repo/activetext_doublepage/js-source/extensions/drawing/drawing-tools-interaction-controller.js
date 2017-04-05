/* global ActiveText */
/**
 * @class DrawingToolsInteractionController
 * @memberOf ActiveText
 * @type {{setCurrentTool: setCurrentTool, setActiveColour: setActiveColour, paint: boolean, curColor: string, curTool: string, curSize: number, createUserEvents: createUserEvents, destroyUserEvents: destroyUserEvents}}
 */
ActiveText.DrawingToolsInteractionController = function(activeTextInstance, drawingTools) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var ERASER_SIZE = 30;

    /**
     * @const
     * @type {number}
     */
    var PEN_SIZE = 5;

    /**
     * @const
     * @type {number}
     */
    var HIGHLIGHTER_SIZE = 20;

    var pathToResources;
    var largeSVG;
    var largePNG;
    var largeCUR;
    var mediumSVG;
    var mediumPNG;
    var mediumCUR;
    var smallSVG;
    var smallPNG;
    var smallCUR;

    function setCurrentTool(tool) {
        api.curTool = tool;
        var valid = false;

        var canvasElement = activeTextInstance.options.containerElement.find('.whiteboard-container');
        switch(tool) {
            case'pointer':
                valid = true;
                canvasElement.css('cursor', '');
                break;
            case 'eraser':
                valid = true;
                api.curSize = ERASER_SIZE;
                if($.browser.msie) {
                    canvasElement.css('cursor', 'url(' + largeCUR + '), crosshair');
                } else {
                    canvasElement.css('cursor', 'url(' + largeSVG + ') 17 17, url(' + largePNG +
                        ') 17 17, crosshair');
                }
                break;
            case 'pen':
                valid = true;
                api.curSize = PEN_SIZE;
                if($.browser.msie) {
                    canvasElement.css('cursor', 'url(' + smallCUR + '), crosshair');
                } else {
                    canvasElement.css('cursor', 'url(' + smallSVG + ') 5 5, url(' + smallPNG + ') 5 5, crosshair');
                }
                break;
            case 'highlighter':
                valid = true;
                api.curSize = HIGHLIGHTER_SIZE;
                if($.browser.msie) {
                    canvasElement.css('cursor', 'url(' + mediumCUR + '), crosshair');
                } else {
                    canvasElement.css('cursor', 'url(' + mediumSVG + ') 11 11, url(' + mediumPNG +
                        ') 11 11, crosshair');
                }
                break;
            default:
                valid = false;
                break;
        }

        if(valid && tool !== 'pointer') {
            canvasElement.find('.whiteboard').css({
                cursor: ''
            });
        } else if(tool === 'pointer') {
            if(activeTextInstance.view.model.getScaleMode() === 'zoom') {
                canvasElement.find('.whiteboard').css({
                    cursor: 'move'
                });
            }
        }

        return valid;
    }

    /**
     * @param hexCode {string}
     */
    function setActiveColour(hexCode) {
        api.curColor = hexCode;
    }

    function normaliseTouchEvent(event) {
        var mouseX, mouseY;
        if(event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0]) {
            mouseX = event.originalEvent.touches[0].pageX;
            mouseY = event.originalEvent.touches[0].pageY;
        } else {
            mouseX = event.pageX;
            mouseY = event.pageY;
        }
        return {mouseX: mouseX, mouseY: mouseY};
    }

    function press(event) {
        var pageNumber = $(event.data).attr('data-page');
        var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
        var offset = $(event.data).offset();
        var e = normaliseTouchEvent(event);
        var mouseX = e.mouseX;
        var mouseY = e.mouseY;
        api.paint = true;
        drawingTools.addClick(pageIndex, mouseX - offset.left, mouseY - offset.top, false);
        drawingTools.redraw(pageIndex);

        return false;
    }

    function drag(event) {
        if(api.paint) {
            var pageNumber = $(event.data).attr('data-page');
            var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
            var offset = $(event.data).offset();
            var e = normaliseTouchEvent(event);
            var mouseX = e.mouseX;
            var mouseY = e.mouseY;
            drawingTools.addClick(pageIndex, (mouseX - offset.left), (mouseY - offset.top), true);
            drawingTools.redraw(pageIndex);
        }

        return false;
    }

    function release(event) {
        var pageNumber = $(event.data).attr('data-page');
        var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
        api.paint = false;
        if(api.paint) {
            var offset = $(event.data).offset();
            var e = normaliseTouchEvent(event);
            var mouseX = e.mouseX;
            var mouseY = e.mouseY;
            drawingTools.addClick(pageIndex, (mouseX - offset.left), (mouseY - offset.top), false);
        }
        drawingTools.redraw(pageIndex);
        drawingTools.dispatchUpdate(pageIndex);

        return false;
    }

    function cancel() {
        api.paint = false;
        return false;
    }

    function cancelWithFinalPoint(event) {
        if(api.paint) {
            var container = activeTextInstance.view.getContainer();
            var offset = $(container).offset();

            // todo: Refactor this into a util function
            var isWithinBounds = (event.pageX > offset.left) && (event.pageX < offset.left + container.width()) &&
                (event.pageY > offset.top) && (event.pageY < offset.top + container.height());

            if(isWithinBounds) {
                var pageNumber = $(event.data).attr('data-page');
                var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
                var pageOffset = $(event.data).offset();
                drawingTools.addClick(pageIndex, (event.originalEvent.pageX -
                    pageOffset.left), (event.originalEvent.pageY - pageOffset.top), true);
                drawingTools.redraw(pageIndex);
            } else {
                cancel();
            }
        }

        return false;
    }

    function createUserEvents() {
        destroyUserEvents();

        var container = activeTextInstance.view.getContainer();
        var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        for(var i = 0, l = pages.length; i < l; i++) {
            var canvasElement = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, pages[i], 'drawing').parent();
            $(container).on({
                mousedown: press,
                mousemove: drag,
                mouseup: release,
                mouseout: cancelWithFinalPoint,
                touchstart: press,
                touchmove: drag,
                touchend: release,
                touchcancel: cancel
            }, canvasElement);

            setCurrentTool(api.curTool);
        }

        $(activeTextInstance).trigger(ActiveText.Commands.DISABLE_PAGE_DRAGGING);
        $(activeTextInstance).on(ActiveText.Commands.SWITCH_TO_ZOOM_MODE, checkCursors);
        $(activeTextInstance).on(ActiveText.Commands.SWITCH_TO_SPS_FTW_VIEW, checkCursors);
    }

    function destroyUserEvents() {
        var container = activeTextInstance.view.getContainer();
        $(container).off({
            mousedown: press,
            mousemove: drag,
            mouseup: release,
            mouseout: cancelWithFinalPoint,
            touchstart: press,
            touchmove: drag,
            touchend: release,
            touchcancel: cancel
        });

        var canvasElement = activeTextInstance.options.containerElement.find('.whiteboard-container');
        canvasElement.css('cursor', '');

        if(activeTextInstance.view.model.getScaleMode() === 'zoom') {
            canvasElement.find('.whiteboard').css({
                cursor: 'move'
            });
        }

        $(activeTextInstance).off(ActiveText.Commands.SWITCH_TO_ZOOM_MODE, checkCursors);
        $(activeTextInstance).off(ActiveText.Commands.SWITCH_TO_SPS_FTW_VIEW, checkCursors);
    }

    function checkCursors() {
        activeTextInstance.options.containerElement.find('.whiteboard-container .whiteboard').css({
            cursor: ''
        });
    }

    function preloadGraphicalElements() {
        pathToResources = ActiveText.SkinUtils.getPathToGlobalResource() + 'img/cursor/';
        largeSVG = pathToResources + '33x33-pointer.svg';
        largeCUR = pathToResources + '33x33-pointer.png';
        largePNG = pathToResources + '33x33-pointer.cur';
        mediumSVG = pathToResources + '23x23-pointer.svg';
        mediumCUR = pathToResources + '23x23-pointer.png';
        mediumPNG = pathToResources + '23x23-pointer.cur';
        smallSVG = pathToResources + '5x5-pointer.svg';
        smallCUR = pathToResources + '5x5-pointer.png';
        smallPNG = pathToResources + '5x5-pointer.cur';

        var ASSETS_TO_PRELOAD = [
            largeSVG,
            largePNG,
            mediumSVG,
            mediumPNG,
            smallSVG,
            smallPNG
        ];

        if($.browser.msie) {
            ASSETS_TO_PRELOAD = [
                largeCUR,
                mediumCUR,
                smallCUR
            ];
        }

        $(document).ready(function() {
            $.imgpreload(ASSETS_TO_PRELOAD);
        });
    }

    preloadGraphicalElements();

    /**
     * @type {{setCurrentTool: setCurrentTool, setActiveColour: setActiveColour, paint: boolean, curColor: string, curTool: string, curSize: number, createUserEvents: createUserEvents, destroyUserEvents: destroyUserEvents}}
     */
    var api = {
        setCurrentTool: setCurrentTool,
        setActiveColour: setActiveColour,
        paint: false,
        curColor: '#0000CD',
        curTool: 'pointer',
        curSize: PEN_SIZE,
        createUserEvents: createUserEvents,
        destroyUserEvents: destroyUserEvents
    };

    return api;
};
