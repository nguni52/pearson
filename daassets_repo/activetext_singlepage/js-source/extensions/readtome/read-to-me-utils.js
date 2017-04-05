/* global ActiveText */
/**
 * @class Utils
 * @memberOf ActiveText.ReadToMe
 * @type {{autoInjectSMILLoader:autoInjectSMILLoader}}
 */
ActiveText.ReadToMe.Utils = (function(ActiveText) {
    'use strict';

    function autoInjectSMILLoader(activeTextInstance) {
        var smilLoader = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildataloader');
        if(!smilLoader && typeof(ActiveText.SMILDataLoader) === 'function') {
            smilLoader = new ActiveText.SMILDataLoader();
            smilLoader.init(activeTextInstance);
            activeTextInstance.extensions.push(smilLoader);
        }
    }

    /**
     * @param pagesToCheck {Array}
     * @returns {jQuery.Deferred}
     */
    function hasLoadedSMILFilesForVisiblePages(activeTextInstance, pagesToCheck) {
        var rtn = $.Deferred();
        var smilDataExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildataloader');
        var smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');

        function checkCurrentState() {
            var hasAllSMILFiles = true;
            for(var i = 0, l = pagesToCheck.length; i < l; i++) {
                var pageIndex = pagesToCheck[i];
                if(smilDataExtension.hasSMILForPage(pageIndex) &&
                    smilDataModel.getSmilDataForPage(pageIndex) === undefined) {
                    hasAllSMILFiles = false;
                }
            }

            if(hasAllSMILFiles) {
                rtn.resolve(pagesToCheck);
            } else {
                $(activeTextInstance).off(ActiveText.SMILDataLoader.Events.SMIL_DATA_LOADED, checkCurrentState).on(ActiveText.SMILDataLoader.Events.SMIL_DATA_LOADED, checkCurrentState);//.off(ActiveText.SMILDataLoader.Events.SMIL_DATA_ERROR, checkCurrentState).on(ActiveText.SMILDataLoader.Events.SMIL_DATA_ERROR, checkCurrentState);
            }
        }

        checkCurrentState();

        return rtn;
    }

    return {
        autoInjectSMILLoader: autoInjectSMILLoader,
        hasLoadedSMILFilesForVisiblePages: hasLoadedSMILFilesForVisiblePages
    };
})(ActiveText);