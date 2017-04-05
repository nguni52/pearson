/* global ActiveText */
ActiveText.Navigation = ActiveText.Navigation || {};
/**
 * @class Model
 * @memberOf ActiveText.Navigation
 * @param activeTextInstance {ActiveText}
 * @type {{init: init, getCurrentPageNumber: getCurrentPageNumber, setCurrentIndex: setCurrentIndex, getCurrentIndex: getCurrentIndex}}
 * @constructor
 */
ActiveText.Navigation.Model = function(activeTextInstance) {
    "use strict";

    /**
     * @type {number}
     */
    var currentIndex = 0;

    /**
     * @type {{pagesToDisplay: number, scaleMode: string, wmode: string}}
     */
    var defaultValues = {};

    function getCurrentIndex() {
        return currentIndex;
    }

    function setCurrentIndex(value) {
        currentIndex = parseInt(value, 10);
        return currentIndex;
    }

    function parseDefaults() {
        var defaults = (activeTextInstance && activeTextInstance.options &&
            activeTextInstance.options.defaults) ? activeTextInstance.options.defaults : defaultValues;
        for(var prop in defaultValues) {
            if(defaults[prop] === undefined) {
                defaults[prop] = defaultValues[prop];
            }
        }
    }

    parseDefaults();

    function init() {
        $(activeTextInstance).one(ActiveText.Events.RESOURCES_LOADED, initialiseCurrentIndexValueFromOptions);
    }

    function initialiseCurrentIndexValueFromOptions() {
        var utils = activeTextInstance.utils;
        var initialPageIndex;
        if(activeTextInstance.options.initialPageId) {
            initialPageIndex = utils.getPageNumberFromId(activeTextInstance.options.initialPageId);
        } else if(activeTextInstance.options.initialPageNumber) {
            initialPageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, activeTextInstance.options.initialPageNumber);
        } else {
            initialPageIndex = ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance);
        }
        activeTextInstance.navigation.gotoPage(ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, initialPageIndex), true);
    }

    function getCurrentPageNumber() {
        if(activeTextInstance && activeTextInstance.utils) {
            return ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, currentIndex);
        } else {
            return currentIndex;
        }
    }

    return {
        init: init,
        getCurrentPageNumber: getCurrentPageNumber,
        setCurrentIndex: setCurrentIndex,
        getCurrentIndex: getCurrentIndex
    };
};