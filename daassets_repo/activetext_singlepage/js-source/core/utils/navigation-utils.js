/* global ActiveText */
ActiveText.namespace("ActiveText.NavigationUtils");
ActiveText.NavigationUtils = (function() {
    "use strict";

    function getMinimumValidPageIndex(activeTextInstance) {
        if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
            return 0;
        } else {
            if(activeTextInstance.settings.getFirstPageIsLeft()) {
                return 0;
            } else {
                return -1;
            }
        }
    }

    function getMaximumValidPageIndex(activeTextInstance) {
        var pages = activeTextInstance.data.getFlatListOfNavigation();
        return (pages.length - 1);
    }

    function pageIndexToPageNumber(activeTextInstance, index) {
        return activeTextInstance.settings.getNumberingOffset() + parseInt(index, 10);
    }

    function pageNumberToPageIndex(activeTextInstance, number) {
        return parseInt(number, 10) - activeTextInstance.settings.getNumberingOffset();
    }

    function isValidPageIndex(activeTextInstance, index) {
        var minimumValidIndex = getMinimumValidPageIndex(activeTextInstance);
        var maximumValidIndex = getMaximumValidPageIndex(activeTextInstance);
        var indexIsLessThanTheMinimum = index < minimumValidIndex;
        var indexIsGreaterThanTheMaximum = index > maximumValidIndex;

        return !(indexIsLessThanTheMinimum || indexIsGreaterThanTheMaximum);
    }

    function getNearestValidPageIndexFromIndex(activeTextInstance, index) {
        var currentIndex = activeTextInstance.model.getCurrentIndex();
        var minimumValidIndex = getMinimumValidPageIndex(activeTextInstance);
        var maximumValidIndex = getMaximumValidPageIndex(activeTextInstance);
        var parsedIndex = parseInt(index, 10);

        if(isNaN(parsedIndex)) {
            return currentIndex;
        } else if(isValidPageIndex(activeTextInstance, parsedIndex)) {
            return parsedIndex;
        } else if(index > maximumValidIndex) {
            return getMaximumValidPageIndex(activeTextInstance);
        } else if(index < minimumValidIndex) {
            return getMinimumValidPageIndex(activeTextInstance);
        } else {
            return  currentIndex;
        }
    }

    function calculateLeftmostPageIndexFromIndex(activeTextInstance, index) {
        index = getNearestValidPageIndexFromIndex(activeTextInstance, index);
        if(isLeftPageIndex(activeTextInstance, index)) {
            return index;
        } else {
            return index - 1;
        }
    }

    function getSiblingPageNumberForPageNumber(activeTextInstance, pageNumber) {
        var index = pageNumberToPageIndex(activeTextInstance, pageNumber);
        if(isLeftPageIndex(activeTextInstance, index)) {
            return pageNumber + 1;
        } else {
            return pageNumber - 1;
        }
    }

    /**
     * @param index {number}
     * @return {Boolean}
     */
    function isLeftPageIndex(activeTextInstance, index) {
        if(activeTextInstance.settings.getFirstPageIsLeft()) {
            return (index % 2) === 0;
        } else {
            return Math.abs(index % 2) === 1;
        }
    }

    return {
        isLeftPage: isLeftPageIndex,
        isValidPageIndex: isValidPageIndex,
        getMinimumValidPageIndex: getMinimumValidPageIndex,
        getMaximumValidPageIndex: getMaximumValidPageIndex,
        pageIndexToPageNumber: pageIndexToPageNumber,
        pageNumberToPageIndex: pageNumberToPageIndex,
        calculateLeftmostPageIndexFromIndex: calculateLeftmostPageIndexFromIndex,
        getNearestValidPageFromIndex: getNearestValidPageIndexFromIndex,
        getSiblingPageNumberForPage: getSiblingPageNumberForPageNumber
    };
})();
