/* global ActiveText, namespace */
/**
 * @class ViewFactory
 * @memberOf ActiveText
 */
ActiveText.ViewFactory = (function(ActiveText) {
    "use strict";

    /**
     * Generates an individual page for the specified id and returns it.
     *
     * @param index {number}
     * @return {object}
     */
    function createIndividualPage(activeTextInstance, index) {
        var currentPage;
        var pageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, index);
        var classNames = activeTextInstance.utils.updatePageClassNameFor(index);

		currentPage = $('<div></div>').css({
            float: "left",
            height: "100%",
			position: "relative"
        }).addClass(classNames + ' page' + index).attr('data-page', pageNumber);

        return currentPage;
    }

    /**
     * @param index The page index to generate the DPS for.
     */
    function generateDPS(activeTextInstance, index) {

        var dpsElement = $("<div class='dps-container'></div>").css({
            margin: 0,
            height: '100%',
            width: '100%',
            position: "absolute",
            top: 0,
            display: 'none',
            left: "100%"
        });
        
        var iOSversion = ActiveText.BrowserUtils.iOSversion[0];
        if(!iOSversion || iOSversion < 7){
            dpsElement.css({
                transform: iOSversion < 7 ? 'rotate(360deg)' : 'translateZ(0)'
            });
        }

        var frame;
        var iFrames = activeTextInstance.view.getIFrames();
        var startIndex = 0;

        for(var i = startIndex; i < (2 + startIndex); i++) {
            frame = createIndividualPage(activeTextInstance, index + i);

            iFrames[index + i] = frame;
            frame.appendTo(dpsElement);

			//TODO: Event below not actually used by anything
            $(activeTextInstance).trigger(ActiveText.Events.FRAME_CREATED, [index + i]);
        }

        var rightEdge = activeTextInstance.view.getContainer().find(".rightEdge");
        if(rightEdge.length > 0) {
            dpsElement.insertBefore(rightEdge);
        } else {
            dpsElement.appendTo(activeTextInstance.view.getContainer());
        }
    }

    function createFrameForPage(activeTextInstance, index) {
        var newIndex = ActiveText.NavigationUtils.calculateLeftmostPageIndexFromIndex(activeTextInstance, index);

        generateDPS(activeTextInstance, newIndex);
    }

    function initialiseWhiteboard(activeTextInstance, containerElement) {
        var backgroundColor = activeTextInstance.theme.getPageBackgroundColor();
        var whiteboardTemplate = '<div class="whiteboard-container"><div class="whiteboard"></div></div>';
        var whiteboardContainer = $(whiteboardTemplate).css({
            position: "relative",
            backgroundColor: backgroundColor,
            overflow: "hidden",
            display: "block"
        }).attr("role", "document");
        whiteboardContainer.appendTo(containerElement);

        var whiteboard = whiteboardContainer.find('.whiteboard');
        whiteboard.css({
            backgroundColor: backgroundColor,
            position: "relative"
        });

        return whiteboardContainer;
    }

    function createPageContentsWithURL(activeTextInstance, sourceURL, index) {
        var iframeContainerElement = $('<div class="iframe"></div>').css({
            position: 'absolute',
            background: 'white'
        });

        var iframeAsString = '<iframe src="' + sourceURL + '" id="iframe' + index +
            '" scrolling="no" class="content" title="Page Content" role="main" frameborder="0" height="100%" width="100%" aria-atomic="true" aria-live="polite" aria-describedby="iframe-content-' +
            index + '" seamless></iframe>';
        var iframe = $(iframeAsString).css({
            position: 'absolute',
            lineHeight: 'normal',
            background: 'white'
        }).appendTo(iframeContainerElement);

        var contentsLink = $('<a id="iframe-content-' + index + '" aria-hidden="true" href="' + sourceURL +
            '">Accessible Link to Page ' +
            ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, index) +
            '</a>');
        iframeContainerElement.append(contentsLink);

        var clickInteractionBlocker = $("<div style='position:absolute;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,0);'></div>");
        $(iframeContainerElement).append(clickInteractionBlocker);

        return iframeContainerElement;
    }

    return {
        createPageContentsWithURL: createPageContentsWithURL,
        createFrameForPage: createFrameForPage,
        initialiseWhiteboard: initialiseWhiteboard
    };
})(ActiveText);
