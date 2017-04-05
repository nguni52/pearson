/* global ActiveText */
/**
 * @class NoteDataJStorageService
 * @memberOf ActiveText
 * @param parentClass
 * @returns {{noteSetDataFunction: noteSetDataFunction, noteLoadDataFunction: noteLoadDataFunction}}
 * @constructor
 */
ActiveText.NoteDataJStorageService = function(parentClass) {
    'use strict';

    /**
     * @type {number}
     */
    var userId = 1;

    /**
     * @type {number}
     */
    var bookId = 1;

    function noteLoadDataFunction(pageIndex) {
        var data = getStoredDataForPage(pageIndex);
        parentClass.loadData(pageIndex, data);
    }

    function getStoredDataForPage(pageIndex) {
        return $.jStorage.get(bookId + '-' + pageIndex + '-' + userId, undefined);
    }

    function noteSetDataFunction(page, data) {
        return $.jStorage.set(bookId + '-' + page + '-' + userId, data);
    }

    /**
     * @type {{noteSetDataFunction: noteSetDataFunction, noteLoadDataFunction: noteLoadDataFunction}}
     */
    var api = {
        noteSetDataFunction: noteSetDataFunction,
        noteLoadDataFunction: noteLoadDataFunction
    };

    return api;
};
