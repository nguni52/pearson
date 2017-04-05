/* global ActiveText */
ActiveText.namespace("ActiveText.FormattingUtils");

ActiveText.FormattingUtils = (function(ActiveText) {
    "use strict";

    function formatPageLabel(activeTextInstance, singlePageFormat, multiPageFormat, pageNumber) {
        var label;

        var minPageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance));
        var maxPageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMaximumValidPageIndex(activeTextInstance));
        var firstPageIsLeft = activeTextInstance.settings.getFirstPageIsLeft();
        var isSinglePageView = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
        var pageIsLeft = ActiveText.NavigationUtils.isLeftPage(activeTextInstance, ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber));

        var onlyOnePageIsShowing = isSinglePageView || (pageNumber === maxPageNumber && pageIsLeft) ||
            (pageNumber === minPageNumber && !firstPageIsLeft);

        if(onlyOnePageIsShowing) {
            label = formatSinglePageLabel(activeTextInstance, singlePageFormat, pageNumber);
        } else {
            label = formatMultiPageLabel(activeTextInstance, multiPageFormat, pageNumber);
        }
        return label;
    }

    function formatSinglePageLabel(activeTextInstance, singlePageFormat, pageNumber) {
        var label;

        if(singlePageFormat.indexOf("%%title%%") !== -1) {
            var ebookStructure = activeTextInstance.data.getFlatListOfNavigation();
            var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
            var validIndex = (pageIndex >= 0) ? pageIndex : 0;
            var item = ebookStructure[validIndex];

            if(item) {
                label = singlePageFormat.replace("%%title%%", item.title);
            } else {
                label = singlePageFormat.replace("%%title%%", "");
            }
        } else {
            var firstPageIsLeft = activeTextInstance.settings.getFirstPageIsLeft();
            var isSinglePageView = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
            var minPageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance));
            var maxPageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMaximumValidPageIndex(activeTextInstance));

            if(pageNumber === minPageNumber && !firstPageIsLeft && !isSinglePageView) {
                pageNumber += 1;
            }

            label = singlePageFormat.replace("%%1", pageNumber).replace("%%2", maxPageNumber);
        }

        return label;
    }

    function formatMultiPageLabel(activeTextInstance, multiPageFormat, pageNumber) {
        var label;

        if(multiPageFormat.indexOf("%%title%%") !== -1) {
            var ebookStructure = activeTextInstance.data.getFlatListOfNavigation();
            var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);
            var validIndex = (pageIndex >= 0) ? pageIndex : 0;
            var item = ebookStructure[validIndex];
            var itemSibling = ebookStructure[validIndex + 1];

            if(item && itemSibling) {
                label = multiPageFormat.replace("%%title%%", item.title).replace("%%title2%%", itemSibling.title);
            } else {
                label = multiPageFormat.replace("%%title%%", "").replace("%%title2%%", "");
            }
        } else {
            var maxPageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMaximumValidPageIndex(activeTextInstance));

            label = multiPageFormat.replace("%%1", pageNumber).replace("%%2", pageNumber +
                1).replace("%%3", maxPageNumber);
        }

        return label;
    }

    return {
        formatPageLabel: formatPageLabel,
        formatSinglePageLabel: formatSinglePageLabel,
        formatMultiPageLabel: formatMultiPageLabel
    };
})(ActiveText);
