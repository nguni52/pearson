/* global ActiveText */
/**
 * @class State
 * @memberOf ActiveText.ReadToMe
 * @param {ActiveText} activeTextInstance
 * @returns {{setAutoPlay: function, getAutoPlay: function, playing: isPlaying, getActiveCharacter: getActiveCharacter, queuePos: number, activePage: number, shouldAutoPlay: boolean, activeCharacter: string}}
 * @constructor
 */
ActiveText.ReadToMe.State = function(activeTextInstance) {
    'use strict';

    function getAutoPlay(eventType) {
        var rtn;
        if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.audioPlaybackController) {
            rtn = activeTextInstance.options.audioPlaybackController(undefined, eventType);
        } else {
            rtn = api.shouldAutoPlay;
        }
        return rtn;
    }

    function setAutoPlay(value, eventType) {
        if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.audioPlaybackController) {
            activeTextInstance.options.audioPlaybackController(value, eventType);
        } else {
            api.shouldAutoPlay = Boolean(value);
        }
    }

    /**
     * @returns {boolean}
     */
    function isPlaying() {
        var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
        var smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');
        var rtn = false;
        $.when(audioPlayback.getMediaPlayer()).then(function(mp) {
            var existingSrc = '';
            if(mp) {
                existingSrc = mp.url;
            }
            var found = false;
            if(existingSrc) {
                var pageAudioCollection = smilDataModel.getSmilDataForPage(api.activePage);
                if(pageAudioCollection) {
                    for(var i = 0, l = pageAudioCollection.length; i < l; i++) {
                        if(existingSrc.indexOf(pageAudioCollection[i].audioSource) !== -1) {
                            found = true;
                        }
                    }
                }
            }
            if(found) {
                rtn = audioPlayback.playing();
            }
        });
        return rtn;
    }

    /**
     * @returns {string}
     */
    function getActiveCharacter() {
        return api.activeCharacter;
    }

    var api = {
        setAutoPlay: setAutoPlay,
        getAutoPlay: getAutoPlay,
        playing: isPlaying,
        getActiveCharacter: getActiveCharacter,
        queuePos: 0,
        activePage: 0,
        shouldAutoPlay: false,
        activeCharacter: '',
        activeFile: ''
    };
    return  api;
};