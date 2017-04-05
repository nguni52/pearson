/* global ActiveText, ActiveText */
ActiveText.namespace('ActiveText.CustomSettingsParser');
ActiveText.CustomSettingsParser = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;
        $(activeTextInstance).one(ActiveText.Events.CONTAINER_XML_LOADED, loadCustomSettings);
    }

    function loadCustomSettings() {
        var url = activeTextInstance.loader.getDataProvider().getPathToMETA() + 'custom.json';
        $.ajax({
            url: url,
            dataType: 'json',
            localCache: ActiveText.Constants.USE_LOCAL_CACHE,
            success: onSettingsLoaded,
            error: onSettingsLoadError
        });
    }

    /**
     * Sets the dimensions for the book from the custom.json file.
     * @param data {{width: number, height: number}}
     */
    function setDimensionsFromData(data) {
        if(data.width !== undefined && data.height !== undefined) {
            var width = parseInt(data.width, 10);
            var height = parseInt(data.height, 10);
            var aspectRatio = width / height;
            activeTextInstance.view.model.setPageDimensions({
                width: width,
                height: height,
                aspectRatio: aspectRatio
            });

            // legacy code from ActiveTeach where zoom area dimensions
            // could be different to the actual page dimensions
            activeTextInstance.view.model.setZoomAreaDimensions({
                width: width,
                height: height
            });
        }
    }

    /**
     * Sets the firstPageIsLeft and numberingOffset parameters from the custom.json file.
     * @param data {{versoStart: number|boolean, numberingOffset: number}}
     */
    function setPageNumberingFromData(data) {
        var firstPageIsLeftOptionNotSet = !activeTextInstance.options || activeTextInstance.options &&
            activeTextInstance.options.firstPageIsLeft === undefined;

        if(firstPageIsLeftOptionNotSet) {
            if(data.versoStart !== undefined) {
                var firstPageIsLeft = Boolean(data.versoStart);
                activeTextInstance.settings.setFirstPageIsLeft(firstPageIsLeft);
            }
        }

        if(data.versoStart !== numberingOffset) {
            var numberingOffset = parseInt(-(data.numberingOffset) + 1, 10);
            activeTextInstance.settings.setNumberingOffset(numberingOffset);
        }
    }

    function setManifestReferenceFromData(data) {
        var hasShortManifest = Boolean(parseInt(data.shortManifest, 10));
        if(hasShortManifest) {
            var currentOPFURL = activeTextInstance.loader.getDataProvider().getOPFURL();
            var re = new RegExp('.opf', 'gi');
            var newOPFURL = currentOPFURL.replace(re, '-short.opf');
            activeTextInstance.loader.getDataProvider().setOPFURL(newOPFURL);
        }
    }

    function setCardMode(data) {
        var cardMode = false;

        window.hasOwnProperty = window.hasOwnProperty || function(obj) {
            return (this[obj]) ? true : false;
        };

        if(data.hasOwnProperty('cardMode')) {
            cardMode = Boolean(data.cardMode);
            if(cardMode) {
                $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_SPS_VIEW);
            }
        }
        activeTextInstance.view.model.setCardMode(cardMode);
    }

    /**
     * Fires when the custom.json file has been loaded and the contents successfully JSON-decoded.
     * @param data {{width: number, height: number, versoStart: number|boolean, numberingOffset: number}}
     */
    function onSettingsLoaded(data) {
        setDimensionsFromData(data);
        setPageNumberingFromData(data);
        setManifestReferenceFromData(data);
        setCardMode(data);
        $(activeTextInstance).trigger(ActiveText.Settings.Events.LOADED, [data]);
    }

    function onSettingsLoadError(xhr, status, error) {
        $(activeTextInstance).trigger(ActiveText.Settings.Events.LOAD_ERROR);
    }

    return {
        init: init
    };
};
