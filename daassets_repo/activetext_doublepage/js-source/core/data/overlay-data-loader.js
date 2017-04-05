/* global ActiveText, ActiveText, _ */
/**
 * @class OverlayData
 * @memberOf ActiveText
 * @returns {{init: init, loadDataForIndex: loadDataForIndex, loadDataForPageIndex: loadDataForPageIndex, getDataForIndex: getDataForIndex, hasOverlayDataForIndex: hasOverlayDataForIndex, key: string}}
 * @constructor
 */
ActiveText.OverlayData = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    var context;

    var cachedData;

    /**
     * @type {array}
     */
    var availableFileNames;

    /**
     * @type {boolean}
     */
    var hasManifest = false;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        /* jshint validthis:true */
        activeTextInstance = instance;
        context = this;
        cachedData = [];

        $(activeTextInstance).one(ActiveText.Events.CONTAINER_XML_LOADED, loadOverlayDataManifest);
        $(activeTextInstance).on(ActiveText.Commands.LOAD_RESOURCE_FOR_CURRENT_INDEX, loadOverlayDataForVisiblePages);
    }

    function loadOverlayDataManifest(event, data) {
        var url = activeTextInstance.loader.getDataProvider().getPathToMETA() + 'overlay-files.json';
        $.ajax({
            url: url,
            dataType: 'json',
            localCache: ActiveText.Constants.USE_LOCAL_CACHE,
            success: onManifestLoaded,
            error: onManifestLoadError
        });
    }

    function onManifestLoaded(data) {
        if($.isArray(data)) {
            availableFileNames = data;
            hasManifest = true;
        } else {
            debug.log('JSON overlay manifest loaded but data was not an array', data);
        }
    }

    function onManifestLoadError(xhr, status, error) {
        //            debug.log('Error loading the JSON overlay manifest.');
    }

    function loadOverlayDataForVisiblePages() {
        var numberOfPagesToLoadDataFor = activeTextInstance.view.model.getDisplayedPages();
        for(var i = 0; i < numberOfPagesToLoadDataFor; i++) {
            context.loadDataForIndex(i);
        }
    }

    function loadDataForIndex(dpsIndex) {
        var pageIndex = activeTextInstance.model.getCurrentIndex() + dpsIndex;
        loadDataForPageIndex(pageIndex);
    }

    function loadDataForPageIndex(index) {
        var path = activeTextInstance.loader.getDataProvider().getPathToMETA();
        var sourceURL = getOverlayURLForPageByIndex(index);

        if(hasOverlayDataForIndex(index)) {
            activeTextInstance.loader.addItemToQueue({
                index: index
            });
            fetchDataForURL(path + sourceURL, index);
        }
        //            else
        //            {
        //                debug.log('Not loading overlay for the page #' + index +
        //                    ' because it did not appear in the manifest', sourceURL);
        //            }
    }

    function hasOverlayDataForIndex(index) {
        var sourceURL = getOverlayURLForPageByIndex(index);
        return (!hasManifest || hasManifest && _.contains(availableFileNames, sourceURL));
    }

    function getOverlayURLForPageByIndex(index) {
        //            var path = activeTextInstance.loader.getDataProvider().getPathToMETA();
        var pagesPath = activeTextInstance.loader.getDataProvider().getPathToPages();

        if(activeTextInstance.utils.getSourcePathForIndex(index).indexOf('about:blank') === -1) {
            var pathToPageArray = activeTextInstance.utils.getSourcePathForIndex(index).split(pagesPath).join('').split('.');
            pathToPageArray.pop();
            var pathToPage = pathToPageArray.join('.') + '.json';
            return pathToPage;
        } else {
            return activeTextInstance.utils.getSourcePathForIndex(index);
        }
    }

    function getDataForIndex(index) {
        return cachedData[index];
    }

    function fetchDataForURL(sourceURL, pageIndex) {
        function handleAPIResponse(result, status) {
            activeTextInstance.loader.removeItemFromQueue({
                index: pageIndex
            });

            var eventData = {
                index: pageIndex,
                data: result
            };

            cachedData[pageIndex] = result;

            if(status === 'error') {
                $(activeTextInstance).trigger(ActiveText.Events.OVERLAY_DATA_FAIL, eventData);
            } else {
                $(activeTextInstance).trigger(ActiveText.Events.LOADED_OVERLAY_DATA, eventData);
            }
        }

        if(sourceURL === 'about:blank') {
            return;
        }

        $.ajax({
            url: sourceURL,
            dataType: 'json',
            localCache: ActiveText.Constants.USE_LOCAL_CACHE,
            success: handleAPIResponse,
            error: handleAPIResponse
        });
    }

    return {
        init: init,
        loadDataForIndex: loadDataForIndex,
        loadDataForPageIndex: loadDataForPageIndex,
        getDataForIndex: getDataForIndex,
        hasOverlayDataForIndex: hasOverlayDataForIndex,
        key: 'overlaydataloader'
    };
};
