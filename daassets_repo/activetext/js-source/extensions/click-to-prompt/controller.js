/* global ActiveText, Modernizr */
/**
 * @class ClickToPrompt
 * @memberOf ActiveText
 * @returns {{init: init, key: string}}
 * @constructor
 */
ActiveText.ClickToPrompt = function() {
    'use strict';

    /**
     * @class ActiveText
     */
    var activeTextInstance;

    /**
     * @param {ActiveText} instance
     */
    function init(instance) {
        if(instance && instance.options && instance.options.containerElement) {
            activeTextInstance = instance;
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }
    }

    function teardown() {
        $(activeTextInstance.options.containerElement).off('remove', teardown);
        activeTextInstance = undefined;
        api.audioPlaybackController = undefined;
    }

    function audioPromptClickHandler(e, data) {

        if(!api.audioPlaybackController) {
            api.audioPlaybackController = new ActiveText.AudioPlayback();
            api.audioPlaybackController.init(activeTextInstance);
        }

        var fileExtension = '.mp3';
        var params = ActiveText.DataUtils.parseURI(data.data.uri);
        var fileName = params.source;
        var doTrack = true;
        var hotSpotType = params.type;
        var globalAudioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
        var audioPlayback = api.audioPlaybackController;
        var parentElement = $(e.target).parents('.target-area');

        var activeStylesOn, activeStylesOff;
        if(Modernizr.rgba) {
            activeStylesOn = {'background': 'rgba(250,250,0,0.2)'};
            activeStylesOff = {'background': ''};
        }
        else {
            activeStylesOn = {'border': '1px solid yellow'};
            activeStylesOff = {'border': 'none'};
        }

        var readToMeExtension = ActiveText.ExtensionUtils.getExtensionByKey('readtome');

        $.when(audioPlayback.getMediaPlayer()).then(function() {
            if(audioPlayback.playing() || globalAudioPlayback && globalAudioPlayback.playing() ||
                readToMeExtension && readToMeExtension.getState().activeFile !== '') {
                if(hotSpotType === 'audio') {
                    audioPlayback.stop();
                }
            }
            else {
                audioPlayback.setSrc(activeTextInstance.options.pathToAssets + 'OPS/media/' + fileName +
                    fileExtension);
                audioPlayback.play();
                parentElement.css(activeStylesOn);

                $(audioPlayback).on('onfinish', function() {
                    parentElement.css(activeStylesOff);
                });

				if(params.hasOwnProperty('report')){
					if(params.report === 'false'){
						doTrack = false;
					}
				}

                $(activeTextInstance).trigger(ActiveText.ClickToPrompt.Events.ACTIVATED, {
                    word: fileName,
                    track: doTrack
                });
            }
        });
    }

    var api = {
        init: init,
        audioPlaybackController: undefined,
        hotspotClickFunction: audioPromptClickHandler,
        key: 'clicktoprompt'
    };

    return  api;
};