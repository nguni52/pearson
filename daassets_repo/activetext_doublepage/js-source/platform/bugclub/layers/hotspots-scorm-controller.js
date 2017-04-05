/* global ActiveText, BugClub, Modernizr */
ActiveText.namespace('BugClub.Hotspots.SCORMController');
/**
 * @class SCORMController
 * @memberOf BugClub.Hotspots
 * @param options {*}
 * @param keyStage {string}
 * @param activeTextInstance {ActiveText}
 * @param scormActivityData {BugClub.SCORM.ActivityData}
 * @returns {{}}
 * @constructor
 */
BugClub.Hotspots.SCORMController = function(options, keyStage, activeTextInstance) {
    'use strict';
    function getIdFromURI(uri) {
        var uriData = ActiveText.DataUtils.parseURI(uri);
        var rtn = uri;
        if(uriData.id) {
            rtn = uriData.id;
        }
        if(uriData.seqid) {
            rtn = uriData.seqid;
        }
        return rtn;
    }

    function init() {
        // attach event listeners
        var scormActivityData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');
        if(scormActivityData) {
            $(activeTextInstance).on(ActiveText.SCORMIntegration.SCORM_DATA_UPDATED, updateStateOfHotspots);
            $(activeTextInstance).on('activetext.hotspot.created', function(event, data) {
                var hotspotId = getIdFromURI(data.uri);
                scormActivityData.setIconForKey(hotspotId, data.hotspot);
                updateHotspotWithDataFromSCORMByKey(data.hotspot, hotspotId);
            });
        }
    }

    function updateStateOfHotspots(event, data) {
        // get the SCORM results object
        var scormActivityData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');
        var resultsObject;
        if(data.items) {
            resultsObject = data.items;
        } else {
            resultsObject = data;
        }

        function update() {
            var hotspot;
            // find the hotspots affected by this data change
            for(var activityId in resultsObject) {
                hotspot = scormActivityData.getHotspotWithId(activityId);
                if(hotspot) {
                    updateHotspotWithDataFromSCORMByKey(hotspot, activityId);
                } else {
                    debug.log('Error: Unable to find hotspot with Id of', activityId);
                }
            }
        }

        update();
        setTimeout(update, 0);
    }

    /**
     * Splits the hotspot name to extract the value 'ks1' or 'ks2' and returns that.
     *
     * @param iconType {string}
     * @param defaultKeyStage {string}
     * @returns {string}
     */
    function keyForIcon(iconType, defaultKeyStage) {
        var key = defaultKeyStage;
        var iconSuffix = iconType.split('-')[1];
        if(iconSuffix) {
            key = iconSuffix;
        }
        return key;
    }

    function getSCORMStateForKey(key) {
        var rtn = 0;
        var scormActivityData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');
        var scormData = scormActivityData.getSCORMStateForKey(key);
        if(scormData && scormData.completion_status !== undefined) {
            if(scormData.completion_status === 'incomplete') {
                rtn = 1;
            } else if(scormData.completion_status === 'completed') {
                rtn = 2;
            }
        }
        return rtn;
    }

    function updateHotspotWithDataFromSCORMByKey(hotspot, key) {
        /**
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
        var state = getSCORMStateForKey(key);
        var images;
        var iconType = (hotspot.data() && hotspot.data().data &&
            hotspot.data().data.icon) ? hotspot.data().data.icon : '';
        var isAKeyStageTwoIcon = keyForIcon(iconType, keyStage) === 'ks2';
        if(isAKeyStageTwoIcon) {
            images = [
                    pathToResources + 'img/bugclub/legacy/ks2/hotspots/state-2.png',
                    pathToResources + 'img/bugclub/legacy/ks2/hotspots/state-1.png',
                    pathToResources + 'img/bugclub/legacy/ks2/hotspots/state-0.png'
            ];
            $(hotspot).attr('src', images[state]);
        } else {
            images = [
                    pathToResources + 'img/bugclub/legacy/ks1/hotspots/state-2.png',
                    pathToResources + 'img/bugclub/legacy/ks1/hotspots/state-1.png',
                    pathToResources + 'img/bugclub/legacy/ks1/hotspots/state-0.png'
            ];
            $(hotspot).attr('src', images[state]);
        }

        if($.browser.msie && !Modernizr.svg) {
            var img = $(hotspot),
                src = img.attr('src');

            img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
                .css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=\'true\',sizingMethod=\'crop\',src=\'' +
                    src + '\')');
        }

        $(hotspot).removeClass('complete,progress,incomplete');
        if(state === 2) {
            $(hotspot).addClass('complete');
        } else if(state === 1) {
            $(hotspot).addClass('progress');
        } else {
            $(hotspot).addClass('incomplete');
        }
    }

    init();

    return {};
};