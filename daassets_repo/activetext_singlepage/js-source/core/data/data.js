/* global ActiveText */
/**
 * @class Data
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init, getFlatListOfNavigation: getFlatListOfNavigation, getNavigationStructure: getNavigationStructure, getMetaData: getMetaData}}
 * @constructor
 */
ActiveText.Data = function(activeTextInstance) {
    'use strict';

    var flatListCache,
        nestedListCache,
        rawNavMapCache,
        rawFlatPagesCache,
        OPFMetaData;

    function init() {
        $(activeTextInstance).on(ActiveText.Events.BOOK_STRUCTURE_LOADED, storeProductPagesAPIResponse);
        $(activeTextInstance).on(ActiveText.Events.NAVMAP_LOADED, storeNavMapAPIResponse);
        $(activeTextInstance).on(ActiveText.Events.OPF_META_LOADED, storeOPFMetaDataAPIResponse);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }
    }

    function teardown() {
        $(activeTextInstance).off(ActiveText.Events.BOOK_STRUCTURE_LOADED, storeProductPagesAPIResponse);
        $(activeTextInstance).off(ActiveText.Events.NAVMAP_LOADED, storeNavMapAPIResponse);
        $(activeTextInstance).off(ActiveText.Events.OPF_META_LOADED, storeOPFMetaDataAPIResponse);
        $(activeTextInstance.options.containerElement).off('remove', teardown);

        flatListCache = undefined;
        nestedListCache = undefined;
        rawNavMapCache = undefined;
        rawNavMapCache = undefined;
        OPFMetaData = undefined;
    }

    function isValidAPIResponse(response) {
        return !(!response || !response.length);
    }

    // todo: Bad name
    function recursiveParseItem(item, rtn) {
        var newElement = {};
        newElement.title = item.title;
        newElement.src = ActiveText.DataUtils.correctURLPath(activeTextInstance, item.html_location);
        newElement.id = item.id;
        newElement.number = item.number;
        rtn.push(newElement);
        if(item.children !== undefined && $.isArray(item.children) && item.children.length > 0) {
            var subnav = [];
            for(var i = 0, len = item.children.length; i < len; i++) {
                recursiveParseItem(item.children[i], subnav);
            }
            rtn.push(subnav);
        }
    }

    // todo: Bad name
    function parseAPIResponse(response) {
        var rtn = [];
        if(response && isValidAPIResponse(response)) {
            for(var i = 0; i < response.length; i++) {
                var item = response[i];
                recursiveParseItem(item, rtn);
            }
        }
        return rtn;
    }

    function getFlatListOfNavigation() {
        var rtn;
        if(flatListCache === undefined || flatListCache.length === 0) {
            flatListCache = parseAPIResponse(rawFlatPagesCache);
        }
        rtn = flatListCache;
        return rtn;
    }

    function storeProductPagesAPIResponse(event, data) {
        rawFlatPagesCache = data;
        $(activeTextInstance).trigger(ActiveText.Events.RESOURCES_LOADED, rawFlatPagesCache);
    }

    function storeNavMapAPIResponse(event, data) {
        rawNavMapCache = data;
    }

    function storeOPFMetaDataAPIResponse(event, data) {
        OPFMetaData = data;
    }

    function getNavigationStructure() {
        var rtn;
        if(nestedListCache === undefined || nestedListCache.length === 0) {
            nestedListCache = parseAPIResponse(rawNavMapCache);
        }
        rtn = nestedListCache;
        return rtn;
    }

    function getMetaData() {
        var rtn;
        if(OPFMetaData !== null || OPFMetaData !== undefined) {
            rtn = OPFMetaData;
        }
        return rtn;
        //            else
        //            {
        //                debug.log(OPFMetaData);
        //            }
    }

    return {
        init: init,
        getFlatListOfNavigation: getFlatListOfNavigation,
        getNavigationStructure: getNavigationStructure,
        getMetaData: getMetaData
    };
};