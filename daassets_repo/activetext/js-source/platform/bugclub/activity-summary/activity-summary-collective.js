/* global ActiveText, BugClub */
ActiveText.namespace("BugClub.ActivitySummaryCollective");
BugClub.ActivitySummaryCollective = function() {
    "use strict";
    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {Array}
     */
    var collectiveResponses;

    /**
     * @type {BugClub.ActivitySummary}
     */
    var context;

    var CHANGE = "change";

    function init(instance) {
        activeTextInstance = instance;

        /* jshint validthis:true */
        context = this;

        $(activeTextInstance).on(ActiveText.Events.LOADED_OVERLAY_DATA, onOverlayDataLoaded);
        $(activeTextInstance).on(ActiveText.Events.OVERLAY_DATA_FAIL, onOverlayDataFail);
        $(activeTextInstance).on(ActiveText.SCORMIntegration.SCORM_DATA_UPDATED, updateActivityState);
    }

    function updateActivityStatusForPage(pageIndex, state, activityIds) {
        var responses = getData();
        responses[pageIndex] = {
            status: state,
            activityIds: activityIds
        };

        var newEventData = {
            pageIndex: pageIndex,
            status: state,
            activityIds: activityIds
        };

        $(context).trigger(CHANGE, newEventData);
    }

    function onOverlayDataLoaded(event, data) {
        var state = calculateStateFromData(data.data);
        var pageIndex = data.index;
        var activityIds = getActivityIdsFromData(data.data);

        updateActivityStatusForPage(pageIndex, state, activityIds);
    }

    function onOverlayDataFail(event, data) {
        var pageIndex = data.index;
        updateActivityStatusForPage(pageIndex, BugClub.ActivitySummaryStates.NONE, []);
    }

    function getStateCodeForActivity(activityId) {
        var state = 0;
        var scormActivityData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');
        var scormData = scormActivityData.getSCORMStateForKey(activityId);
        if(scormData && scormData.completion_status !== undefined) {
            if(scormData && scormData.completion_status !== undefined) {
                if(scormData.completion_status === "incomplete") {
                    state = 1;
                } else if(scormData.completion_status === "completed") {
                    state = 2;
                }
            }
        }
        return state;
    }

    function getActivityIdsFromData(data) {
        var rtn = [];
        var scormActivityData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');
        var validActivities = BugClub.ActivitySummaryUtils.getValidActivities(scormActivityData, data);
        if(validActivities.length) {
            for(var i = 0, l = validActivities.length; i < l; i++) {
                if(validActivities[i].data.id) {
                    rtn.push(validActivities[i].data.id);
                }
            }
        }
        return rtn;
    }

    function calculateStateFromData(data) {
        var scormActivityData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');
        var validActivities = BugClub.ActivitySummaryUtils.getValidActivities(scormActivityData, data);
        var activityIds = [];

        for(var i = 0, l = validActivities.length; i < l; i++) {
            activityIds.push(validActivities[i].data.id);
        }

        return calculateStateFromActivityIds(activityIds);
    }

    function calculateStateFromActivityIds(activityIds) {
        var rtn;

        if(activityIds.length) {
            var score = 0;
            for(var i = 0, l = activityIds.length; i < l; i++) {
                score += getStateCodeForActivity(activityIds[i]);
            }
            if(score >= (activityIds.length * 2)) {
                rtn = BugClub.ActivitySummaryStates.COMPLETED;
            } else if(score === 0) {
                rtn = BugClub.ActivitySummaryStates.INCOMPLETE;
            } else {
                rtn = BugClub.ActivitySummaryStates.PROGRESS;
            }
        } else {
            rtn = BugClub.ActivitySummaryStates.NONE;
        }
        return rtn;

    }

    function updateActivityState(event, scormData) {
        // get the SCORM results object
        var resultsObject;
        if(scormData && scormData.items) {
            resultsObject = scormData.items;
        } else {
            resultsObject = scormData;
        }
        // find the hotspots affected by this data change
        var state, item, pageIndex;
        for(var activityId in resultsObject) {
            item = resultsObject[activityId];

            pageIndex = getPageIndexForActivity(activityId);
            state = calculateStateFromActivityIds(collectiveResponses[pageIndex].activityIds);

            updateActivityStatusForPage(pageIndex, state, collectiveResponses[pageIndex].activityIds);
        }
    }

    function getPageIndexForActivity(activityId) {
        var rtn = 0;
        var allActivities = getData();
        for(var i = 0, l = allActivities.length; i < l; i++) {
            for(var k = 0, kl = allActivities[i].activityIds.length; k < kl; k++) {
                if(allActivities[i].activityIds[k] === activityId) {
                    rtn = i;
                    break;
                }
            }
        }
        return rtn;
    }

    function constructInitialSummaryObject() {
        var rtn = [];
        var numberOfPages = activeTextInstance.data.getFlatListOfNavigation().length;
        for(var i = 0; i < numberOfPages; i++) {
            rtn.push({
                status: BugClub.ActivitySummaryStates.NONE,
                activityIds: []
            });
        }
        return rtn;
    }

    function fetchData() {
        /* jshint validthis:true */
        collectiveResponses = constructInitialSummaryObject();
        $(context).trigger(CHANGE, collectiveResponses);
    }

    function getData() {
        if(!collectiveResponses || collectiveResponses.length === 0) {
            fetchData();
        }
        return collectiveResponses;
    }

    return {
        init: init,
        fetchData: fetchData,
        getData: getData,
        key: 'bugclubactivitysummary'
    };
};