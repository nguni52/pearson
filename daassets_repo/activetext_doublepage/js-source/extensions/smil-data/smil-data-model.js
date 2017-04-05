/* global ActiveText */
/**
 * @class SMILDataModel
 * @memberOf ActiveText
 * @returns {{init: init, getSmilDataForPage: getSmilDataForPage, key: string}}
 * @constructor
 */
ActiveText.SMILDataModel = function() {
    'use strict';

    /**
     * @type {Array}
     */
    var pageAudioCollections = [];

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;
        $(activeTextInstance).on(ActiveText.SMILDataLoader.Events.SMIL_DATA_LOADED, extractDataFromSMILFile);
    }

    function extractDataFromSMILFile(event, data) {
        var pageIndex = data.index;
        var response = data.data;
        pageAudioCollections[pageIndex] = ActiveText.SMILFormatHelper.parseSMIL(response);
    }

    function getSmilDataForPage(pageIndex) {
        return pageAudioCollections[pageIndex];
    }

    return {
        init: init,
        getSmilDataForPage: getSmilDataForPage,
        key: 'smildatamodel'
    };
};