/* global ActiveText */
/**
 * @class ExtensionUtils
 * @memberOf ActiveText
 * @returns {{getExtensionByKey:function, getAudioPlayback:function}}
 */
ActiveText.ExtensionUtils = (function() {
    'use strict';

    function getExtensionByKey(activeTextInstance, key) {
        var rtn, extension;
        if(activeTextInstance && activeTextInstance.extensions && $.isArray(activeTextInstance.extensions)) {
            for(var i = 0, l = activeTextInstance.extensions.length; i < l; i++) {
                extension = activeTextInstance.extensions[i];
                if(extension.key === key) {
                    rtn = extension;
                }
            }
        }
        return rtn;
    }

    /**
     * @param {ActiveText} activeTextInstance
     * @returns {ActiveText.AudioPlayback}
     */
    function getAudioPlayback(activeTextInstance) {
        var rtn = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'audioplayback');
        if(!rtn) {
            rtn = new ActiveText.AudioPlayback();
            rtn.init(activeTextInstance);
            if(!activeTextInstance.extensions) {
                activeTextInstance.extensions = [];
            }
            activeTextInstance.extensions.push(rtn);
        }
        return rtn;
    }

    return {
        getExtensionByKey: getExtensionByKey,
        getAudioPlayback: getAudioPlayback
    };
})();
