/* globals ActiveText */
/**
 * @class DrawingToolsJStorageExtension
 * @memberOf ActiveText
 * @type {{drawingToolsGetDataFunction:drawingToolsGetDataFunction, loadData:loadData}}
 */
ActiveText.DrawingToolsJStorageExtension = (function() {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     * @param pageIndex {number}
     * @param drawingData {*}
     */
    function drawingToolsGetDataFunction(activeTextInstance, pageIndex, drawingData) {
        var pageKey = getCurrentPageKey(activeTextInstance, pageIndex);
        $.jStorage.set(pageKey, drawingData);
    }

    /**
     * @param activeTextInstance {ActiveText}
     * @param pageIndex {number}
     * @returns {*}
     */
    function loadData(activeTextInstance, pageIndex) {
        var pageKey = getCurrentPageKey(activeTextInstance, pageIndex);
        return $.jStorage.get(pageKey, null);
    }

    /**
     * @param activeTextInstance {ActiveText}
     * @param pageIndex {number}
     * @returns {string}
     */
    function getCurrentPageKey(activeTextInstance, pageIndex) {
        var bookIdFromOPFMetaData;
        var returnPageKey;

        bookIdFromOPFMetaData = activeTextInstance.data.getMetaData();
        if(bookIdFromOPFMetaData && bookIdFromOPFMetaData.identifier !== null || bookIdFromOPFMetaData && bookIdFromOPFMetaData.identifier !== '') {
            bookIdFromOPFMetaData = bookIdFromOPFMetaData.identifier;
        } else {
            bookIdFromOPFMetaData = 'defaultBookId';
        }

        returnPageKey = pageIndex + '_' + bookIdFromOPFMetaData;
        return returnPageKey;
    }

    return {
        drawingToolsGetDataFunction: drawingToolsGetDataFunction,
        loadData: loadData
    };
})();