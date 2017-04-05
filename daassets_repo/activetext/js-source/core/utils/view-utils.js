/* global ActiveText, Modernizr */
ActiveText.ViewUtils = (function() {
    "use strict";

    function isDoublePageView(activeTextInstance) {
        return Boolean(activeTextInstance.view.model.getDisplayedPages() === 2);
    }

    function isSinglePageView(activeTextInstance) {
        return Boolean(activeTextInstance.view.model.getDisplayedPages() === 1);
    }

    function isFitToHeightView(activeTextInstance) {
        return activeTextInstance.view.model.getScaleMode() === "fth";
    }

    function isFitToWidthView(activeTextInstance) {
        return activeTextInstance.view.model.getScaleMode() === "ftw";
    }

    function isCardMode(activeTextInstance) {
        return activeTextInstance.view.model.returnCardMode();
    }

    function setOpacityValue(element, value) {
        function setOpacityValueForIE(element, value) {
            if($.browser.msie) {
                var version = parseInt($.browser.version, 10);
                if(version <= 7) {
                    element.css({
                        filter: 'alpha(opacity=' + value + ')'
                    });
                } else {
                    element.css({
                        MsFilter: '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value + ')"'//,
                        //                        filter : 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value + ')'
                    });
                }
            }
        }

        element.css({
            opacity: value
        });
        setOpacityValueForIE(element, value);
    }

    function getUnscaledDPSTargetDimensions(activeTextInstance) {
        var pageAspectRatio;
        var pageDimensions = activeTextInstance.view.model.getPageDimensions();
        pageAspectRatio = (pageDimensions.height) /
            (pageDimensions.width * activeTextInstance.view.model.getDisplayedPages());
        var isPageLandscape = (pageAspectRatio <= 1);
        var availableDimensions = fetchAvailableDimensions(activeTextInstance);
        var availableWidth = availableDimensions.width;
        var availableHeight = availableDimensions.height;

        var chosenAspect = pageAspectRatio;
        var readerTargetWidth, readerTargetHeight;

        var resizedPageHeight = (availableWidth * chosenAspect);
        var resizedPageWidth = (availableHeight / chosenAspect);
        var viewportIsShorterThanAvailHeight = ( availableHeight < resizedPageHeight );
        var viewportIsShorterThanScaledHeight = resizedPageHeight > availableHeight;
        var scaledOnWidth = false;

        if(activeTextInstance.view.model.getScaleMode() === 'ftw') {
            readerTargetHeight = Math.floor(resizedPageHeight);
            readerTargetWidth = Math.floor(availableWidth);
            scaledOnWidth = true;
        } else {
            if(isPageLandscape) {
                if(viewportIsShorterThanAvailHeight) {
                    readerTargetHeight = Math.floor(availableHeight);
                    readerTargetWidth = Math.floor(resizedPageWidth);
                } else {
                    readerTargetHeight = Math.floor(resizedPageHeight);
                    readerTargetWidth = Math.floor(availableWidth);
                    scaledOnWidth = true;
                }
            } else {
                if(viewportIsShorterThanAvailHeight) {
                    readerTargetHeight = Math.floor(availableHeight);
                    readerTargetWidth = Math.floor(resizedPageWidth);
                } else {
                    if(viewportIsShorterThanScaledHeight) {
                        readerTargetHeight = Math.floor(availableHeight);
                        readerTargetWidth = Math.floor(resizedPageWidth);
                    } else {
                        readerTargetHeight = Math.floor(resizedPageHeight);
                        readerTargetWidth = Math.floor(availableWidth);
                        scaledOnWidth = true;
                    }
                }
            }
        }

        if(!scaledOnWidth) {
            var magnificationValue = activeTextInstance.view.model.getMagnificationValue();
            var widthReduction = 1 * magnificationValue;

            readerTargetWidth += widthReduction;
        }

        var edgeButtonsWidth = 0;
        var edgeFactory = activeTextInstance.view.getEdgeFactory();
        if(!activeTextInstance.behaviours.allowOverlappingButtons() && edgeFactory &&
            typeof(edgeFactory.minimumWidth) === "number") {
            edgeButtonsWidth = edgeFactory.minimumWidth * 2;
        }

        if(scaledOnWidth || (availableWidth - readerTargetWidth) < edgeButtonsWidth) {
            readerTargetWidth = availableWidth - edgeButtonsWidth;
            readerTargetHeight = (availableWidth - edgeButtonsWidth) * chosenAspect;
        }

        var isSinglePage = (isSinglePageView(activeTextInstance)) ? 1 : 0;
        return {
            width: readerTargetWidth,
            height: readerTargetHeight,
            dpswidth: readerTargetWidth + (readerTargetWidth * isSinglePage),
            dpsheight: readerTargetHeight,
            availWidth: availableWidth,
            availHeight: availableHeight
        };
    }

    function getScaleValue(activeTextInstance) {
        var pageDimensions = activeTextInstance.view.model.getPageDimensions();
        var dimensions = getUnscaledDPSTargetDimensions(activeTextInstance);
        var vFit = pageDimensions.width / (dimensions.width + 1);
        var hFit = pageDimensions.height / (dimensions.height + 1);
        var rtn = (vFit < hFit) ? hFit : vFit;
        return rtn;
    }

    function getVisiblePages(activeTextInstance) {
        var pagesToCheck = [];
        var currentIndex = activeTextInstance.model.getCurrentIndex();
        for(var i = 0, l = activeTextInstance.view.model.getDisplayedPages(); i < l; i++) {
            pagesToCheck.push(currentIndex + i);
        }
        return pagesToCheck;
    }

    var cachedContainerHeight;
    var cachedParentHeight;
    var cachedContainerWidth;
    var cachedParentWidth;

    function hasExistingFrameForPage(activeTextInstance, index) {
        return activeTextInstance.view.getIFrames()[index] !== undefined;
    }

    function doNotHaveExistingFrameForPage(activeTextInstance, index) {
        return !hasExistingFrameForPage(activeTextInstance, index);
    }

    function indexLessThanMin(index) {
        return index > -1;
    }

    function indexIsNotGreaterThanMax(activeTextInstance, index) {
        return index <= ActiveText.NavigationUtils.getMaximumValidPageIndex(activeTextInstance);
    }

    function isValidPageIndex(activeTextInstance, index) {
        return indexLessThanMin(index) && indexIsNotGreaterThanMax(activeTextInstance, index);
    }

    function getFrameForPageByIndex(activeTextInstance, index) {
        if(isValidPageIndex(activeTextInstance, index) && doNotHaveExistingFrameForPage(activeTextInstance, index)) {
            ActiveText.ViewFactory.createFrameForPage(activeTextInstance, index);
        }
        return activeTextInstance.view.getIFrames()[index];
    }

    function isTheRightHandPage(activeTextInstance, pageNumber) {
        if(pageNumber === undefined) {
            var currentIndex = activeTextInstance.model.getCurrentIndex();
            pageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, currentIndex);
        }
        var pageIndex = ActiveText.NavigationUtils.pageNumberToPageIndex(activeTextInstance, pageNumber);

        return activeTextInstance.utils.updatePageClassNameFor(pageIndex) === "rightPage";
    }

    function getCurrentReader(activeTextInstance) {
        var model = activeTextInstance.model;
        var currentIndex = model.getCurrentIndex();
        var frameForCurrentPage = getFrameForPageByIndex(activeTextInstance, currentIndex);
        if(frameForCurrentPage) {
            return frameForCurrentPage.parent();
        } else {
            return undefined;
        }
    }

    function getReaderForPage(activeTextInstance, pageIndex) {
        var frameForPage = getFrameForPageByIndex(activeTextInstance, pageIndex);
        if(frameForPage) {
            return frameForPage.parent();
        } else {
            return undefined;
        }
    }

    function getPrevReader(activeTextInstance) {
        var model = activeTextInstance.model;
        var prevIndex = model.getCurrentIndex() - 2;
        if(prevIndex >= ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance)) {
            var frameForPreviousPage = getFrameForPageByIndex(activeTextInstance, prevIndex);
            if(frameForPreviousPage) {
                return frameForPreviousPage.parent();
            } else {
                return undefined;
            }
        }
    }

    function getNextReader(activeTextInstance) {
        var model = activeTextInstance.model;
        var nextIndex = model.getCurrentIndex() + 2;
        var frameForNextPage = getFrameForPageByIndex(activeTextInstance, nextIndex);
        if(frameForNextPage) {
            return frameForNextPage.parent();
        }
    }

    function isLeftPage(activeTextInstance, inputFrameIndex) {
        return activeTextInstance.utils.updatePageClassNameFor(inputFrameIndex) === "leftPage";
    }

    function pagesArePartOfTheSameDPS(activeTextInstance, fromPage, toPage) {
        var fromIndex = fromPage;
        var toIndex = toPage;

        if(!isLeftPage(activeTextInstance, fromIndex)) {
            fromIndex -= 1;
        }

        if(!isLeftPage(activeTextInstance, toIndex)) {
            toIndex -= 1;
        }

        var rtn = Boolean(toIndex === fromIndex);

        return rtn;
    }

    function getDPSByFrameIndex(activeTextInstance, index) {
        var rtn;
        var currentPage = getFrameForPageByIndex(activeTextInstance, index);
        if(currentPage) {
            rtn = currentPage.parent();
        }
        return rtn;
    }

    function scaleHTMLElement(activeTextInstance, element, scale) {
        scale = Math.ceil(scale * 1000) / 1000;
        if(!Modernizr.csstransforms) {
            var filterValue = "progid:DXImageTransform.Microsoft.Matrix(M11=" + scale +
                ", M12=0.000000, M21=0.000000, M22=" + scale + ", sizingMethod='auto expand')";
            var scaleCss = {
                "filter": filterValue,
                "-ms-filter": '"' + filterValue + '"'
            };

            element.css(scaleCss);
        } else {
            // jQuery 1.8 auto-prepends vendor prefixes, so this still works!
            element.css({
                transform: "scale(" + scale + ")",
                transformOriginX: 0,
                transformOriginY: 0,
                transformOrigin: "0 0"
            });
        }
    }

    function getContainerCoordinates(activeTextInstance) {
        var containerCoordinates;
        if(activeTextInstance.options.containerCoordinates !== undefined) {
            containerCoordinates = activeTextInstance.options.containerCoordinates;
        } else {
            containerCoordinates = {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            };
        }
        return containerCoordinates;
    }

    function fetchAvailableDimensions(activeTextInstance) {
        var availableWidth, availableHeight;
        var containerCoordinates = getContainerCoordinates(activeTextInstance);
        var verticalSpacing = (containerCoordinates.top + containerCoordinates.bottom);
        var horizontalSpacing = (containerCoordinates.left + containerCoordinates.right);

        var isFullWindowScalingMode = activeTextInstance.utils.isFullWindowScalingMode();
        if(isFullWindowScalingMode) {
            availableWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            availableHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        } else {
            availableHeight = getParentHeight(activeTextInstance);
            availableWidth = getParentWidth(activeTextInstance);
        }

        availableHeight -= verticalSpacing;
        availableWidth -= horizontalSpacing;

        return {
            width: availableWidth,
            height: availableHeight
        };
    }

    function invalidateSizeCaches(activeTextInstance) {
        // todo: Use lodash for this.
        cachedContainerHeight = undefined;
        cachedContainerWidth = undefined;
        cachedParentHeight = undefined;
        cachedParentWidth = undefined;
    }

    function updateAllClassNamesAndResizePages(activeTextInstance) {
        var allPages = $(activeTextInstance.options.containerElement).find("div.dps-container").find(".leftPage, .rightPage");
        var startIndex = ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance);
        var len = allPages.length - 1 - startIndex;

        for(var i = startIndex; i < len; i++) {
            getFrameForPageByIndex(activeTextInstance, i);
        }
    }

    function getParentHeight(activeTextInstance) {
        if(!cachedParentHeight || !activeTextInstance.utils.isFullWindowScalingMode()) {
            cachedParentHeight = $(activeTextInstance.options.containerElement).height();
        }
        return cachedParentHeight;
    }

    function getParentWidth(activeTextInstance) {
        if(!cachedParentWidth || !activeTextInstance.utils.isFullWindowScalingMode()) {
            cachedParentWidth = $(activeTextInstance.options.containerElement).width();
        }
        return cachedParentWidth;
    }

    return {
        getNextReader: getNextReader,
        getPrevReader: getPrevReader,
        getCurrentReader: getCurrentReader,
        getReaderForPage: getReaderForPage,
        getFrameForPageByIndex: getFrameForPageByIndex,
        isTheRightHandPage: isTheRightHandPage,
        getDPSByFrameIndex: getDPSByFrameIndex,
        pagesArePartOfTheSameDPS: pagesArePartOfTheSameDPS,
        isLeftPage: isLeftPage,
        scaleHTMLElement: scaleHTMLElement,
        updateAllClassNamesAndResizePages: updateAllClassNamesAndResizePages,
        invalidateSizeCaches: invalidateSizeCaches,
        getContainerCoordinates: getContainerCoordinates,
        isDoublePageView: isDoublePageView,
        isSinglePageView: isSinglePageView,
        isFitToHeightView: isFitToHeightView,
        isFitToWidthView: isFitToWidthView,
        setOpacityValue: setOpacityValue,
        getUnscaledDPSTargetDimensions: getUnscaledDPSTargetDimensions,
        getScaleValue: getScaleValue,
        getVisiblePages: getVisiblePages,
        isCardMode: isCardMode
    };
})();
