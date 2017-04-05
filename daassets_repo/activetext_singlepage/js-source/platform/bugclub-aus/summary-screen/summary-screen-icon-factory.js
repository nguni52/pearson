/* global ActiveText, BugClub */
ActiveText.namespace('BugClubAus.SummaryScreenIconFactory');
BugClubAus.SummaryScreenIconFactory = (function(ActiveText) {
    'use strict';

    function preloadIconImages(activeTextInstance, skinCode) {
        function preload(images) {
            var i;
            for(i in images) {
                $('<img/>')[0].src = images[i];
            }
        }

        var pathPrefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        if(skinCode === 'ks1') {
            preload([
                    pathPrefix + 'img/bugclub/legacy/ks1/pupil/Canvas_bug.png',
                    pathPrefix + 'img/bugclub/legacy/ks1/pupil/Canvas_bugOverlay.png'
            ]);
        } else {
            preload([
                    pathPrefix + 'img/bugclub/legacy/ks2/KS2_ActivityToggle_Green_face_yellow_1.png',
                    pathPrefix + 'img/bugclub/legacy/ks2/KS2_ActivityToggle_yellow_2.png',
                    pathPrefix + 'img/bugclub/legacy/ks2/KS2_ActivityToggle_yellow_1.png'
            ]);
        }
    }

    function getIconHTMLForStatus(activeTextInstance, status, skinCode) {
        var rtn = '';
        var pathPrefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        if(status === 'completed') {
            rtn = '<img class="icon" src="' + pathPrefix +
                'img/bugclub/legacy/ks2/KS2_ActivityToggle_Green_face_yellow_1.png" width="35" height="36" />';
        } else if(status === 'progress') {
            rtn = '<img class="icon" src="' + pathPrefix +
                'img/bugclub/legacy/ks2/KS2_ActivityToggle_yellow_2.png" width="35" height="37" />';
        } else if(status === 'incomplete') {
            rtn = '<img class="icon" src="' + pathPrefix +
                'img/bugclub/legacy/ks2/KS2_ActivityToggle_yellow_1.png" width="35" height="37" />';
        }
        return rtn;
    }

    return {
        preloadIconImages: preloadIconImages,
        getIconHTMLForStatus: getIconHTMLForStatus
    };
})(ActiveText);
