/* global ActiveText, BugClub */
ActiveText.namespace('BugClub.SCORM.ActivityData');
BugClub.SCORM.ActivityData = function() {
    'use strict';

    /**
     * @type {object}
     */
    var dataCache;

    /**
     * @type {Array|Object}
     */
    var activityCache;

    /**
     * @type {object}
     */
    var scormDataCache;

    function init() {
        dataCache = {};
        scormDataCache = {};
    }

    function register(activeTextInstance) {
        deregister(activeTextInstance);
        $(activeTextInstance).on(ActiveText.Events.LOADED_OVERLAY_DATA, parseOverlayData);
        $(activeTextInstance).on(ActiveText.SCORMIntegration.SCORM_DATA_UPDATED, updateStateOfHotspots);
    }

    function deregister(activeTextInstance) {
        $(activeTextInstance).off(ActiveText.Events.LOADED_OVERLAY_DATA, parseOverlayData);
        $(activeTextInstance).off(ActiveText.SCORMIntegration.SCORM_DATA_UPDATED, updateStateOfHotspots);
    }

    function updateStateOfHotspots(event, data) {
        var resultsObject;
        if(data.items) {
            resultsObject = data.items;
        } else {
            resultsObject = data;
        }

        for(var uri in resultsObject) {
            cacheSCORMStateForKey(uri, resultsObject[uri]);
        }
    }

    function extractHotspotsFromOverlayData(data) {
        var allDivs;
        var objects = [];
        for(var i = 0, l = data.data.length; i < l; i++) {
            var item = data.data[i];
            if(item.type === 'hotspot') {
                objects.push(item);
            }
        }
        allDivs = $(objects);
        return allDivs;
    }

    /**
     * @param id {String}
     * @returns {Object}
     */
    function getActivityById(id) {
        return activityCache[id.toString()];
    }

    function setActivityById(id, data) {
        if(!activityCache) {
            activityCache = {};
        }

        if(id && id !== '') {
            activityCache[id.toString()] = data;
        }
        //        else
        //        {
        //            debug.log('BugClub.SCORM.ActivityData Error: Unable to set the activity data for activity with Id ', id);
        //        }
    }

    function parseOverlayData(event, data) {
        var hotspotsData = extractHotspotsFromOverlayData(data);
        $(api).trigger(BugClub.SCORM.ActivityData.PARSED_DATA, {
            index: data.index,
            data: hotspotsData
        });
    }

    function getHotspotWithId(hotspotId) {
        return dataCache[hotspotId];
    }

    function setIconForKey(key, item) {
        dataCache[key] = item;
    }

    function cacheSCORMStateForKey(key, data) {
        scormDataCache[key] = data;
    }

    function getSCORMStateForKey(key) {
        return scormDataCache[key];
    }

    init();

    var api = {
        init: register,
        deregister: deregister,
        parseOverlayData: parseOverlayData,
        getHotspotWithId: getHotspotWithId,
        setIconForKey: setIconForKey,
        cacheSCORMStateForKey: cacheSCORMStateForKey,
        getSCORMStateForKey: getSCORMStateForKey,
        getActivityById: getActivityById,
        setActivityById: setActivityById,
        key: 'bugclubscorm'
    };

    return  api;
};