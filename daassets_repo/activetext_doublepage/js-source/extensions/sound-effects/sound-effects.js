/* global ActiveText */
/**
 * @class SoundEffects
 * @memberOf ActiveText
 * @returns {{init: init, hasSoundEffectsForPage: hasSoundEffectsForPage, hasLoadedOverlayDataForPages: hasLoadedOverlayDataForPages, key: string}}
 * @constructor
 */
ActiveText.SoundEffects = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {ActiveText.AudioPlayback}
     */
    var audioPlayback;

    /**
     * @type {Array}
     */
    var soundEffectsData;

    /**
     * @type {Array}
     */
    var soundEffectPromises;

    /**
     * @type {Function}
     * @returns {ActiveText.OverlayData}
     */
    var getOverlayDataLoader = _.memoize(function() {
        return ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'overlaydataloader');
    }, _.identifier);

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        /* jshint validthis:true */
        activeTextInstance = instance;
        soundEffectsData = [];
        soundEffectPromises = [];

        audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(instance);

        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, changePage);
        $(activeTextInstance).on(ActiveText.Events.LOADED_OVERLAY_DATA, parseOverlayData);
    }

    function changePage() {
        var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        var deferredObjects = [];
        for(var i = 0, l = visiblePages.length; i < l; i++) {
            deferredObjects.push(getPromiseFor(visiblePages[i]));
        }
        $.when.apply($, deferredObjects).then(playSoundEffectsForPages);
    }

    function getPromiseFor(page) {
        if(soundEffectPromises[page] === undefined) {
            soundEffectPromises[page] = $.Deferred();
        }

        var shouldHaveDataForIndex = getOverlayDataLoader().hasOverlayDataForIndex(page);
        if(!shouldHaveDataForIndex) {
            soundEffectPromises[page].resolve();
        }

        return soundEffectPromises[page];
    }

    function hasLoadedOverlayDataForPages(visiblePages) {
        var rtn = $.Deferred();

        var deferredObjects = [];
        for(var i = 0, l = visiblePages.length; i < l; i++) {
            deferredObjects.push(getPromiseFor(visiblePages[i]));
        }

        $.when.apply($, deferredObjects).then(function() {
            rtn.resolve(visiblePages);
        });

        return rtn;
    }

    function getSoundEffectsFileForPages(visiblePages) {
        var rawSrc;
        for(var i = 0, l = visiblePages.length; i < l; i++) {
            if(soundEffectsData[visiblePages[i]] !== undefined && soundEffectsData[visiblePages[i]] !== true) {
                rawSrc = soundEffectsData[visiblePages[i]];
            }
        }
        return rawSrc;
    }

    function hasSoundEffectsForPage(visiblePages) {
        return Boolean(getSoundEffectsFileForPages(visiblePages));
    }

    function playSoundEffectsForPages() {
        var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);

        function whenGotPlayerReference() {
            setTimeout(function() {
                var rawSrc = getSoundEffectsFileForPages(visiblePages);
                var src = ActiveText.DataUtils.correctURLPath(activeTextInstance, rawSrc);
                audioPlayback.stop();
                audioPlayback.setSrc(src);
                // todo: refactor this, please. (as 20140902)
                setTimeout(function(){
                    audioPlayback.play();
                }, 0);
            }, 0);
        }

        if(hasSoundEffectsForPage(visiblePages)) {
            $.when(audioPlayback.getMediaPlayer()).then(whenGotPlayerReference);
        }
    }

    /**
     * @param event {object}
     * @param data {{index:Number, data:object}}
     */
    function parseOverlayData(event, data) {
        soundEffectsData[data.index] = true;

        /**
         * @type {audio:{src:{string}}}
         */
        var item;
        for(var i = 0, l = data.data.length; i < l; i++) {
            item = data.data[i];
            if(item.type === 'sound-effect' && item.audio !== undefined && item.audio.src !== undefined) {
                soundEffectsData[data.index] = item.audio.src;
            }
        }

        if(soundEffectPromises[data.index] === undefined) {
            soundEffectPromises[data.index] = $.Deferred();
        }
        soundEffectPromises[data.index].resolve();

        $(api).trigger(ActiveText.SoundEffects.Events.UPDATE, {index: data.index});
    }

    var api = {
        init: init,
        hasSoundEffectsForPage: hasSoundEffectsForPage,
        hasLoadedOverlayDataForPages: hasLoadedOverlayDataForPages,
        key: 'soundeffects'
    };
    return  api;
};
