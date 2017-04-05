/* global ActiveText, _, Modernizr */
ActiveText.LayerUtils = (function() {
    'use strict';

    var drawingToolsAreActive = false;

    /**
     * @param convertedIndex {number}
     * @param key {string}
     * @returns {jQuery}
     */
    function getOverlayForIndex(activeTextInstance, convertedIndex, key) {
        var page = ActiveText.ViewUtils.getFrameForPageByIndex(activeTextInstance, convertedIndex);
        return getOrCreateOverlayContainerForPage(activeTextInstance, page, convertedIndex, key);
    }

    /**
     * @param page {jQuery}
     * @param convertedIndex {number}
     * @param key {string}
     * @returns {jQuery}
     */
    function getOrCreateOverlayContainerForPage(activeTextInstance, page, convertedIndex, key) {
        var rtn;

        if(page !== undefined) {
            var host = page.parent();
            var pageClassName = activeTextInstance.utils.updatePageClassNameFor(convertedIndex);
            var existingRef = $(host.find('div.' + pageClassName + ' div.' + key));

            if(existingRef.length === 0) {
                rtn = createOverlayByKey(activeTextInstance, host, convertedIndex, key);
            } else {
                rtn = existingRef;
            }

            if(rtn) {
                rtn.css('top', 0);
            }
        }
        return rtn;
    }

    /**
     * @param host {jQuery}
     * @param convertedIndex {number}
     * @param key {string}
     * @returns {jQuery}
     */
    function createOverlayByKey(activeTextInstance, host, convertedIndex, key) {
        var returnKeyZindex = function returnKeyZindex() {
            var zIndex;
            if(key === 'drawing') {
                zIndex = drawingToolsAreActive ? 30 : 0;
            } else if(key === 'annotations') {
                zIndex = drawingToolsAreActive ? 20 : 40;
            } else if(key === 'standalone_hotspots') {
                zIndex = drawingToolsAreActive ? 10 : 30;
            }
            return zIndex;
        };
        var newChild = $('<div/>').addClass(key + ' page' + convertedIndex).css({
            'position': 'absolute',
            'z-index': returnKeyZindex,
            'pointerEvents': 'none'
        });

        var targetContainer = $(host.find('div.' +
            activeTextInstance.utils.updatePageClassNameFor(convertedIndex)));
        $(targetContainer).children('.' + key).remove();

        var newLayerShouldBeVisible = getLayerVisibility(activeTextInstance, key);
        if(!newLayerShouldBeVisible) {
            newChild.hide();
        }
        newChild.appendTo(targetContainer);
        return newChild;
    }

    /**
     * @param key {string}
     */
    function hideLayerByKey(activeTextInstance, key) {
        activeTextInstance.view.getOverlayElements().filter('.' + key).hide();
    }

    /**
     * @param key {string}
     */
    function showLayerByKey(activeTextInstance, key) {
        activeTextInstance.view.getOverlayElements().filter('.' + key).show();
    }

    /**
     * @param layerKey {string}
     * @param visibleBoolean {boolean}
     */
    function setLayerVisibility(activeTextInstance, layerKey, visibleBoolean) {
        if(layerKey && typeof(layerKey) === 'string') {
            getModelForInstance(activeTextInstance)[layerKey] = Boolean(visibleBoolean);
        }

        if(Boolean(visibleBoolean)) {
            showLayerByKey(activeTextInstance, layerKey);
        } else {
            hideLayerByKey(activeTextInstance, layerKey);
        }
    }

    function getModelForInstance(activeTextInstance) {
        var rtn;
        if(activeTextInstance) {
            if(activeTextInstance.layerVisibility === undefined) {
                activeTextInstance.layerVisibility = {};
            }
            rtn = activeTextInstance.layerVisibility;
        }
        return  rtn;
    }

    /**
     * @param layerKey {string}
     * @returns {boolean}
     */
    function getLayerVisibility(activeTextInstance, layerKey) {
        var modelForInstance = getModelForInstance(activeTextInstance);
        return Boolean(modelForInstance && modelForInstance[layerKey] !== false);
    }

    function bringLayerToFront(activeTextInstance) {
        drawingToolsAreActive = true;
        toggleAnnotationLayers();
        disableDraggingWhenDrawing(activeTextInstance, drawingToolsAreActive);
    }

    function returnLayerToOriginalDepth(activeTextInstance) {
        drawingToolsAreActive = false;
        toggleAnnotationLayers();
        disableDraggingWhenDrawing(activeTextInstance, drawingToolsAreActive);
    }

    function disableDraggingWhenDrawing(activeTextInstance, drawingToolsAreActive) {
        var scaleMode = activeTextInstance.view.model.getScaleMode();
        if(scaleMode === 'ftw') {
            if(drawingToolsAreActive) {
                var whiteboard = $('.whiteboard');
                try {
                    activeTextInstance.view.getContainer().draggable('disable');
                }
                catch(e) {
                    // do nothing
                    activeTextInstance.view.getContainer().data({'uiDraggable': false});
                }
                whiteboard.css('opacity', 1);
            } else {
                try {
                    activeTextInstance.view.getContainer().draggable('enable');
                }
                catch(e) {
                    // do nothing
                    activeTextInstance.view.getContainer().data({'uiDraggable': true});
                }
            }
        }
    }

    function returnDrawingToolsState() {
        return drawingToolsAreActive;
    }

    function toggleAnnotationLayers() {
        if(drawingToolsAreActive === true) {
            $('.drawing').css('z-index', '30');
            $('.standalone_hotspots').css('z-index', '10');
            $('.annotations').css('z-index', '20');
        } else if(drawingToolsAreActive === false) {
            $('.drawing').css('z-index', '0');
            $('.standalone_hotspots').css('z-index', '30');
            $('.annotations').css('z-index', '40');
        }
    }

    return {
        bringLayerToFront: bringLayerToFront,
        returnLayerToOriginalDepth: returnLayerToOriginalDepth,
        getOverlayForIndexByKey: getOverlayForIndex,
        setLayerVisibility: setLayerVisibility,
        getLayerVisibility: getLayerVisibility,
        disableDraggingWhenDrawing: disableDraggingWhenDrawing,
        returnDrawingToolsState: returnDrawingToolsState
    };
})();
