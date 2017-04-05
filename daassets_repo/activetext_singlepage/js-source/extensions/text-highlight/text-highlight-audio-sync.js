/* global ActiveText */
/**
 * @class TextHighlightAudioSync
 * @memberOf ActiveText
 * @param options
 * @returns {{init: Function, key: string}}
 * @constructor
 */
ActiveText.TextHighlightAudioSync = function(options) {
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
     * @type {ActiveText.ReadToMe}
     */
    var readToMeClass;

    /**
     * @type {ActiveText.SMILDataModel}
     */
    var smilDataModel;

    /**
     * @type {string}
     */
    var TIME_UPDATE = 'ontimeupdate';

    var timeoutReference;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;

        getDependencies();

        $(readToMeClass).on(ActiveText.ReadToMe.Events.UPDATE, onAudioUpdateEvent);
        $(audioPlayback).on(TIME_UPDATE, onAudioUpdateEvent);
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, resetTextSelectionForPage);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(readToMeClass).off(ActiveText.ReadToMe.Events.UPDATE, onAudioUpdateEvent);
            $(audioPlayback).off(TIME_UPDATE, onAudioUpdateEvent);
            $(activeTextInstance).off(ActiveText.Commands.GO_TO_PAGE, resetTextSelectionForPage);

            $(activeTextInstance.options.containerElement).off('remove', teardown);
            smilDataModel = undefined;
            readToMeClass = undefined;
            audioPlayback = undefined;
            activeTextInstance = undefined;
        }
    }

    function resetTextSelectionForPage(event, data) {
        var activePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        _(activePages).forEach(function(pageIndex) {
            removeHighlightingFromAllElementsExcept(pageIndex);
        });
        onAudioUpdateEvent();
    }

    function getDependencies() {
        readToMeClass = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'readtome');
        if(!readToMeClass) {
            readToMeClass = new ActiveText.ReadToMe(options);
            readToMeClass.init(activeTextInstance);
            activeTextInstance.extensions.push(readToMeClass);
        }

        smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');

        audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);

        var settings = new ActiveText.TextHighlightSettings(activeTextInstance);
        ActiveText.TextHighlightPageInjection(activeTextInstance, settings);
    }

    function getSiblingClasses(initialSelector, page) {
        var selector;
        var classesOnElement = page.contents().find(initialSelector).attr('class');
        if(classesOnElement) {
            var classesAsArray = classesOnElement.split(' ');
            var selectionClassName = ActiveText.TextHighlightHelper.getSelectionClassName();
            var index = classesAsArray.indexOf(selectionClassName);
            if(index !== -1) {
                classesAsArray.splice(index, 1);
            }
            for(var i = 0, l = classesAsArray.length; i < l; i++) {
                classesAsArray[i] = '.' + classesAsArray[i];
            }
            classesAsArray.push(initialSelector);
            selector = classesAsArray.join(',');
        } else {
            selector = initialSelector;
        }
        return page.contents().find(selector);
    }

    function selectText(media, pageIndex) {
        var currentTime = 0;
        if(media) {
            currentTime = media.position / 1000;
        }
        var audioSourceFile = readToMeClass.getState().activeFile;

        var currentCharacter = ActiveText.CharacterSelection.getCharacter();
        var shouldHighlight = Boolean(options && options.selectionModeHighlightByDefault);
        var smilDataForThisPage = smilDataModel.getSmilDataForPage(pageIndex);

        function selectItems(item) {
            function highlightContent() {
                if(item) {
                    var frame = ActiveText.ViewUtils.getFrameForPageByIndex(activeTextInstance, pageIndex);
                    var iframeElement = frame.find('iframe');
                    var siblingClasses = getSiblingClasses(item.highlightId, iframeElement);
                    colourCode = item.highlightColour;
                    if(phrases) {
                        phrases.add(siblingClasses);
                    } else {
                        phrases = siblingClasses;
                    }
                }

                if(currentTime > 0) {
                    removeHighlightingFromAllElementsExcept(pageIndex, phrases);
                }

                if(phrases) {
                    removeHighlightingFromAllElementsExcept(pageIndex, phrases);
                    highlightElement(phrases, colourCode);
                } else {
                    removeHighlightingFromAllElementsExcept(pageIndex, phrases);
                }
            }

            function checkLoadStatus() {
                var frame = ActiveText.ViewUtils.getFrameForPageByIndex(activeTextInstance, pageIndex);
                var iframeElement = frame.find('iframe');
                var iframeIsReady = iframeElement.contents().find('body').children().length > 0;

                if(timeoutReference) {
                    clearTimeout(timeoutReference);
                }
                if(iframeIsReady) {
                    timeoutReference = setTimeout(highlightContent, 100);
                } else {
                    if(iframeElement.length) {
                        timeoutReference = setTimeout(checkLoadStatus, 100);
                    } else {
                        timeoutReference = setTimeout(checkLoadStatus, 100);
                    }
                }
            }

            checkLoadStatus();
        }

        function pauseAudio(){
            readToMeClass.pause();
        }

        if(smilDataForThisPage) {
            var selection;
            var phrases;
            var colourCode;
            for(var i = 0, l = smilDataForThisPage.length; i < l; i++) {
                var item = smilDataForThisPage[i];
                if(audioSourceFile.indexOf(item.audioSource) !== -1) {
                    var audioFileCharacter = item.character;
                    if(currentCharacter === audioFileCharacter) {
                        var delay = ActiveText.BrowserUtils.IEVersion && ActiveText.BrowserUtils.IEVersion < 10 ? 400 : 0;
                        setTimeout(pauseAudio, delay);
                        shouldHighlight = true;
                    }

                    if(shouldHighlight) {
                        var clipBegin = 0;
                        if(item.clipBegin && !isNaN(item.clipBegin)) {
                            clipBegin = item.clipBegin;
                        }

                        var clipEnd = media.duration / 1000;
                        if(item.clipEnd && !isNaN(item.clipEnd)) {
                            clipBegin = item.clipEnd;
                        }

                        if(currentTime >= clipBegin && currentTime <= clipEnd) {
                            selection = item;
                        }
                    }
                }
            }

            removeHighlightsFromNonActivePage(pageIndex);
            selectItems(selection);
        } else {
            removeHighlightsFromNonActivePage();
        }
    }

    function removeHighlightsFromNonActivePage(pageIndex) {
        var activePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        var pages = _.without(activePages, pageIndex);
        _(pages).forEach(function(pageIndex) {
            removeHighlightingFromAllElementsExcept(pageIndex);
        });
        if(timeoutReference) {
            clearTimeout(timeoutReference);
        }
    }

    function onAudioUpdateEvent(e) {
        $.when(audioPlayback.getMediaPlayer()).then(function(media) {
            var state = readToMeClass.getState();
            var pageIndex = state.activePage;
            selectText(media, pageIndex);
        });
    }

    function removeHighlightingFromAllElementsExcept(index, exceptions) {
        var selectionClassName = ActiveText.TextHighlightHelper.getSelectionClassName();
        var page = $('#iframe' + index);
        var elements = page.contents().find('.' + selectionClassName);
        if(exceptions) {
            elements = elements.not(exceptions);
        }
        $(elements).removeClass(selectionClassName).css('background-color', '').children().css('background-color', '');
    }

    function highlightElement(elements, colourCode) {
        var selectionClassName = ActiveText.TextHighlightHelper.getSelectionClassName();
        $(elements).addClass(selectionClassName).css('background-color', colourCode).children().css('background-color', colourCode);
    }

    /**
     * @type {{init: Function, key: string}}
     */
    var api = {
        init: init,
        key: 'texthighlightaudiosync'
    };

    return api;
};