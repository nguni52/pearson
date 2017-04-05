/* global ActiveText */
ActiveText.RecordAndPlay = function(options) {
    'use strict';

    var activeTextInstance;
    var eventType;
    var recObject = {
            hasConfirmed: false,
            isPlaying: false,
            isRecording: false,
            hasPlayed: false,
            hasRecorded: false
        };

    function insertButtonsDiv(){
        var $buttons = $('.button.record, .button.play');
        var $playbackDiv = $('<div />', {
            'class': 'playbackDiv'
        });
        $buttons.wrapAll($playbackDiv);

        if(!hasFlash()){
            $('.playbackDiv').hide();
        }
    }

    function embedSWFrecorder(){
        var resourcePath = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
        var swfPath = resourcePath + 'swf/ActiveTextRecordAndRateWidget.swf';
        var opt = {
                swfUrl: swfPath,
                id: 'flashRecorder',
                width: 467,
                height: 174,
                version: '9.0.0',
                expressInstall: false,
                flashvars: {},
                params: {
                    movie: swfPath,
                    wmode: 'transparent',
                    quality: 'high',
                    allowscriptaccess: 'always'
                }
            };
        var $swfWrapper = $('<div />', {'class': 'recordingWidget'}).hide();
        $('<div />', {'id': 'flashRecorder'}).appendTo($swfWrapper);
        $('body').append($swfWrapper);

        swfobject.embedSWF(opt.swfUrl, opt.id, opt.width, opt.height, opt.version, opt.expressInstall, opt.flashvars, opt.params);

        recObject.wrapper = $swfWrapper;
    }

    function pauseReadToMe(){
        if(recObject.readToMeAudio){
            recObject.readToMeAudio.pause();
        }
    }

    function openRecPopup(){
        pauseReadToMe();
        recObject.wrapper.show();

        // temporary measure to enable the recording only after the user allowed it.
        return true;
    }

    function toggleRecord(){
        pauseReadToMe();
        if(recObject.hasConfirmed && !recObject.isPlaying){
            eventType = recObject.isRecording ? 'stop' : 'record';
            recObject.element = $('#flashRecorder')[0];
            recObject.element.recPressed();
            recObject.isRecording = !recObject.isRecording;
            recObject.hasRecorded = true;

            // trigger the event to allow the button control to behave accordingly.
            $(activeTextInstance).trigger(eventType);
        }

        recObject.hasPlayed = recObject.isPaused = false;

        // not true. but if the user didn't allow and it doesn't work, well..
        recObject.hasConfirmed = openRecPopup();
    }

    function togglePlay(){
        pauseReadToMe();
        if(recObject.hasRecorded && !recObject.isRecording){

            recObject.element.playPausePressed();

            if(!recObject.isPlaying && !recObject.isPaused){
                eventType = 'play';
            }

            if(recObject.isPlaying){
                eventType = 'pause';
            }

            if(recObject.isPaused){
                eventType = 'resume';
            }

            recObject.isPlaying = !recObject.isPlaying;
            recObject.isPaused = !recObject.isPaused;
        
            recObject.hasPlayed = true;

            // trigger the event to allow the button control to behave accordingly.
            $(activeTextInstance).trigger(eventType);
        }
    }

    function swfIsRecording(){
        return recObject.isRecording;
    }

    function swfIsPlaying(){
        return recObject.isPlaying;
    }

    function swfHasRecorded(){
        return recObject.hasRecorded;
    }

    function updateStates(isRecording, isPlaying){
        if(!isPlaying){
            setTimeout(function(){
                $(activeTextInstance).trigger('finish');
                recObject.isPlaying = false;
            }, 1000);
        }
    }
    window.updateStates = updateStates;

    function hasFlash(){
        return(swfobject.hasFlashPlayerVersion("9.0.18"));
    }

    function init(instance) {
        activeTextInstance = instance;
        embedSWFrecorder();
        recObject.readToMeAudio = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);

        $(activeTextInstance).on(ActiveText.Events.UI_ELEMENT_LOADED, function(e){
            if(e.element === 'controls-bar'){
                insertButtonsDiv();
            }
        });
    }

    var api = {
        init: init,
        swfIsRecording: swfIsRecording,
        swfIsPlaying: swfIsPlaying,
        toggleRecord: toggleRecord,
        togglePlay: togglePlay,
        hasRecorded: swfHasRecorded,
        hasFlash: hasFlash,
        key: 'recordandplay'
    };

    return api;

};