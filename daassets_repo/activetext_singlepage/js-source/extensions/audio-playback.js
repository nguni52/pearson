/* global ActiveText, SoundManager */
/**
 * @class AudioPlayback
 * @memberOf ActiveText
 * @returns {{init: init, play: function, setSrc: setSrc, pause: function, stop: function, getMediaPlayer: getMediaPlayer, playing: function, key: string}}
 * @constructor
 */
ActiveText.AudioPlayback = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {object|SMSound}
     */
    var currentAudio;

    /**
     * @type {object|jQuery}
     */
    var deferredAudioObject;

    /**
     * @type {Boolean}
     */
    var isReady = false;

    /**
     * @type {SoundManager}
     */
    var soundManager;

    /**
     * @type {number}
     */
    var lastProgress;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;

        if(activeTextInstance && SoundManager) {
            soundManager = new SoundManager();
            soundManager.setup({
                url: ActiveText.SkinUtils.getPathToResources(activeTextInstance) + 'soundmanager2/',
                preferFlash: false,
                debugMode: false,
                debugFlash: false,
                useHighPerformance: true,
                onready: onready,
                ontimeout: ontimeout
            });
            soundManager.defaultOptions.multiShot = false;
            soundManager.beginDelayedInit();

            // important: SoundManager callbacks from Flash require window.soundManager to be set.
            // So the Flash fallbacks will never work if we don't include this line.
            window.soundManager = soundManager;
        }
    }

    function outputLoadState() {
        if(currentAudio) {
            if(currentAudio.readyState === 2) {
                if(currentAudio.url !== undefined && currentAudio.url !== 'beep.mp3') {
                    $(api).trigger('onerror', {url: currentAudio.url});
                }
            }

            if(currentAudio.readyState > 1) {
                $(activeTextInstance).trigger(ActiveText.Commands.HIDE_LOADER);
            }

            if(currentAudio.url !== '' && currentAudio.readyState !== 2 && currentAudio.readyState !== 3) {
                setTimeout(outputLoadState, 50);
            }
        }
    }

    /**
     * @private
     *
     * On iOS, audio remains muted until triggered as the result of a touch interaction, and cannot autoplay automatically.
     * Therefore we tap into the touch globally and try playing a dummy file. This won't work, but when the user taps the
     * screen again after this point, we'll be hooked in and we can play audio without restrictions after that point.
     */
    function applyIOSTouchStartHack() {
        function onFirstTouch() {
            getMediaPlayer();
            setSrc('beep.mp3');
            playAudio();
            activeTextInstance.options.containerElement.off('touchstart', onFirstTouch);
        }

        activeTextInstance.options.containerElement.on('touchstart', onFirstTouch);
    }

    function hideLoader(){
        $(activeTextInstance).trigger(ActiveText.Commands.HIDE_LOADER);
    }

    function onready() {
        isReady = true;

        if(ActiveText.BrowserUtils.isMobileDevice) {
            applyIOSTouchStartHack();
        }

        if(deferredAudioObject) {
            getMediaPlayer();
        }
    }

    function ontimeout() {
        // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
        $(activeTextInstance).trigger(ActiveText.Commands.DISPLAY_ERROR, 'Timeout Error: Unable to start Flash Audio Playback.');
    }

    function setSrc(value) {
        if(currentAudio && currentAudio.url !== value) {
            try {
                currentAudio.destruct();
            }
            catch(error) {
                //debug.log('An Error occurred trying to destroy the current audio object', error);
            }
        }

        if(!currentAudio || currentAudio && currentAudio.url !== value) {
            currentAudio = soundManager.createSound({
                id: value,
                url: value,
                autoPlay: false,
                autoLoad: true,
                flashPollingInterval: 5,
                html5PollingInterval: 5,
                useHighPerformance: true,
                onload: function() {
                    $(api).trigger('onload');
                    $(activeTextInstance).trigger(ActiveText.Commands.SHOW_LOADER);
                },
                onpause: function() {
                    $(api).trigger('onpause');
                },
                onplay: function() {
                    $(api).trigger('onplay');
                },
                onresume: function() {
                    $(api).trigger('onresume');
                },
                onfinish: function() {
                    // important: this is a hack around ie9 spuriously firing onfinish
                    // events when changing the source of the audio file
                    if(lastProgress > 0) {
                        $(api).trigger('onfinish');
                    }
                },
                whileplaying: function() {
                    lastProgress = currentAudio.position;
                    $(api).trigger('ontimeupdate', currentAudio);
                }
              });
            lastProgress = 0;
            setTimeout(outputLoadState, 50);
        }
    }

    function playAudio() {
        if(currentAudio) {
            var options = {url: currentAudio.url};
            currentAudio.play(options);
            hideLoader();
        }
    }

    function stopAudio() {
        if(currentAudio) {
            currentAudio.pause();
            currentAudio.position = 0;
            currentAudio.stop();
            hideLoader();
        }
    }

    function pauseAudio() {
        if(currentAudio) {
            currentAudio.pause();
            hideLoader();
        }
    }

    function getMediaPlayer() {
        var rtn;

        if(isReady) {
            if(deferredAudioObject) {
                rtn = deferredAudioObject;
                deferredAudioObject = undefined;
            }
            else {
                rtn = $.Deferred();
            }
            rtn.resolve(currentAudio);
        }
        else {
            if(!deferredAudioObject) {
                deferredAudioObject = $.Deferred();
            }
            rtn = deferredAudioObject;
        }
        return rtn;
    }

    /**
     * @returns {boolean}
     */
    function isPlaying() {
        var rtn = false;
        if(currentAudio) {
            rtn = !(currentAudio.paused || currentAudio.position === 0);
        }
        return rtn;
    }

    /**
     * @returns {float}
     */
    function getDuration() {
        var rtn = false;
        if(currentAudio) {
            rtn = currentAudio.durationEstimate;
        }
        return rtn;
    }

    /**
     * @returns {float}
     */
    function getPosition() {
        var rtn = false;
        if(currentAudio) {
            rtn = currentAudio.position;
        }
        return rtn;
    }

    function setPosition(value) {
        if(currentAudio && value) {
            currentAudio.setPosition(value);
        }
    }

    var api = {
        init: init,
        play: playAudio,
        setSrc: setSrc,
        pause: pauseAudio,
        stop: stopAudio,
        getMediaPlayer: getMediaPlayer,
        playing: isPlaying,
        getDuration: getDuration,
        getPosition: getPosition,
        setPosition: setPosition,
        key: 'audioplayback'
    };
    return api;
};