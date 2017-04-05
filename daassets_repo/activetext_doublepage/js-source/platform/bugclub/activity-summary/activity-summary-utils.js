/* global ActiveText, BugClub */
ActiveText.namespace("BugClub.ActivitySummaryUtils");
BugClub.ActivitySummaryUtils = (function(ActiveText) {
    "use strict";

    /**
     * @param scormActivityData {BugClub.SCORM.ActivityData}
     * @param data {object}
     * @returns {Array}
     */
    function getValidActivities(scormActivityData, data) {
        var objects = [];

        for(var i = 0, l = data.length; i < l; i++) {
            var item = data[i];

            if(item.type === "hotspot") {
                if(item.data && item.data.uri) {
                    var parsed = ActiveText.DataUtils.parseURI(item.data.uri);

                    for(var key in parsed) {
                        item.data[key] = parsed[key];
                    }
                }

                objects.push(item);
                scormActivityData.setActivityById(item.data.seqid ? item.data.seqid : item.data.id, item);
            }
        }

        return objects;
    }

    return {
        getValidActivities: getValidActivities
    };
})(ActiveText);