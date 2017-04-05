/* global ActiveText */
/**
 * @class NoteDataService
 * @memberOf ActiveText
 * @param {ActiveText} activeTextInstance
 * @returns {{setCacheForPage: setCacheForPage, loadData: loadData}}
 * @constructor
 */
ActiveText.NoteDataService = function(activeTextInstance) {
    'use strict';

    /**
     * @type {ActiveText.NoteDataJStorageService}
     */
    var backupClass;

    function init() {
        backupClass = new ActiveText.NoteDataJStorageService(api);
        $(activeTextInstance).on(ActiveText.Events.FRAME_CONTENT_LOADED, fetchNotesDataForPage);
        $(activeTextInstance).on(ActiveText.Events.LOADED_OVERLAY_DATA, fetchNotesDataForPage);
    }

    /**
     * @param pageIndex {number}
     * @param data {object}
     */
    function setCacheForPage(pageIndex, data) {
        if(typeof activeTextInstance.options.noteSetDataFunction === 'function') {
            activeTextInstance.options.noteSetDataFunction(activeTextInstance, pageIndex, data);
        }
        else {
            backupClass.noteSetDataFunction(pageIndex, data);
        }
    }

    /**
     * @param pageIndex {number}
     */
    function getCacheForPage(pageIndex) {
        if(typeof activeTextInstance.options.noteLoadDataFunction === 'function') {
            activeTextInstance.options.noteLoadDataFunction(activeTextInstance, pageIndex);
        }
        else {
            backupClass.noteLoadDataFunction(pageIndex);
        }
    }

    /**
     * @param pageIndex {number}
     * @param data {object}
     */
    function loadData(pageIndex, data) {
        if(dataIsValid(data)) {
            $(api).trigger(ActiveText.Events.LOADED_NOTES_FOR_INDEX, {
                index: pageIndex,
                data: data
            });
        }
        //        else
        //        {
        //            console.log('data is not valid', pageIndex, data);
        //        }
    }

    /**
     * @param event {object}
     * @param eventData {{index:number, data:Object}}
     */
    function fetchNotesDataForPage(event, eventData) {
        var index = eventData.index;
        getCacheForPage(index);
    }

    /**
     * @param data {array}
     * @returns {boolean}
     */
    function dataIsValid(data) {
        return Boolean($.isArray(data) && data.length > 0);
    }

    /**
     * @type {{setCacheForPage: setCacheForPage, loadData: loadData}}
     */
    var api = {
        setCacheForPage: setCacheForPage,
        loadData: loadData
    };

    init();

    return api;
};