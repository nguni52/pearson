/* global ActiveText */
/**
 * @class SMILDataLoader
 * @memberOf ActiveText
 * @returns {{init: init, hasSMILForPage: hasSMILForPage, key: string}}
 * @constructor
 */
ActiveText.SMILDataLoader = function() {
    'use strict';

    /**
     * @type {Array}
     */
    var smilRefs = [];

    /**
     * @type {object}
     */
    var smilCache = {};

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;
        $(activeTextInstance).on(ActiveText.Events.OPF_DATA_LOADED, extractSMILReferencesFromOPFData);
        $(activeTextInstance).on(ActiveText.Commands.LOAD_PAGE_BY_INDEX, loadSMILForIndex);
    }

    /**
     * @param data {Document}
     */
    function extractSMILReferencesFromOPFData(event, data) {
        smilRefs = [];

        var opfFile = $(data);
        var spineData = opfFile.find('spine itemref[linear!="no"]');
        for(var i = 0, l = spineData.length; i < l; i++) {
            var idRef = $(spineData[i]).attr('idref');
            var smilRef = opfFile.find('manifest item[id="' + idRef + '"]').attr('media-overlay');
            var smilHref = opfFile.find('manifest item[id="' + smilRef + '"]').attr('href');
            if(!smilHref) {
                smilHref = opfFile.find('manifest item[id="' + idRef + '"]').attr('media-overlay');
            }
            smilRefs[i] = smilHref;
        }
    }

    /**
     * @param pageIndex {Number}
     * @returns {Boolean}
     */
    function hasSMILForPage(pageIndex) {
        return Boolean(getSMILReferenceForPage(pageIndex) !== undefined);
    }

    /**
     * @param pageIndex {Number}
     * @returns {String}
     */
    function getSMILReferenceForPage(pageIndex) {
        return smilRefs[pageIndex];
    }

    /**
     * @param pageIndex {Number}
     * @returns {XMLDocument}
     */
    function getCachedSMILReferenceForPage(pageIndex) {
        return smilCache[pageIndex];
    }

    /**
     * @param pageIndex {number}
     * @return {jQuery}
     */
    function haveHaveLoadedSMILDataForIndex(pageIndex) {
        function onSMILLoaded(resp) {
            smilCache[pageIndex] = resp;
            deferred.resolve(pageIndex, resp);
        }

        function onSMILError(e) {
            //                debug.log(e);
            deferred.resolve(pageIndex);
            $(activeTextInstance).trigger(ActiveText.SMILDataLoader.Events.SMIL_DATA_ERROR, {
                index: pageIndex
            });
        }

        var deferred = $.Deferred();
        var urlFromSMILReference = getSMILReferenceForPage(pageIndex);
        var cachedSMILData = getCachedSMILReferenceForPage(pageIndex);

        if(cachedSMILData) {
            setTimeout(function() {
                deferred.resolve(pageIndex, cachedSMILData);
            }, 0);
        } else if(!urlFromSMILReference) {
            setTimeout(function() {
                deferred.resolve(pageIndex);
            }, 0);
        }
        else {
            $.ajax({
                url: ActiveText.DataUtils.correctURLPath(activeTextInstance, urlFromSMILReference),
                dataType: 'text xml',
                success: onSMILLoaded,
                error: onSMILError
            });
        }

        return deferred;
    }

    function makeSMILDataAvailable(pageIndex, response) {
        if(response) {
            $(activeTextInstance).trigger(ActiveText.SMILDataLoader.Events.SMIL_DATA_LOADED, {
                index: pageIndex,
                data: response
            });
        }
        else {
            $(activeTextInstance).trigger(ActiveText.SMILDataLoader.Events.SMIL_DATA_ERROR, {
                index: pageIndex
            });
        }
    }

    /**
     * @param event
     * @param data {{index:number}}
     */
    function loadSMILForIndex(event, data) {
        var pageIndex = 0;
        if(ActiveText.NavigationUtils.isValidPageIndex(activeTextInstance, data.index)) {
            pageIndex = data.index;
        }
        $.when(haveHaveLoadedSMILDataForIndex(pageIndex)).then(makeSMILDataAvailable);
    }

    return {
        init: init,
        hasSMILForPage: hasSMILForPage,
        key: 'smildataloader'
    };
};