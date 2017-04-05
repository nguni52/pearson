/* global ActiveText, Modernizr */
ActiveText.Analytics = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    var startTime;

    var pageTimes = {};

    var navHasLoaded = false;

    function init(instance) {
        if(instance && instance.options && instance.options.containerElement) {
            activeTextInstance = instance;
            $(activeTextInstance.options.containerElement).on('remove', teardown);

            startTime = new Date().getTime();

            var $activeTextInstance = $(activeTextInstance);
            $activeTextInstance.on(ActiveText.Events.BOOK_STRUCTURE_LOADED, bookLoadEvent);
            $activeTextInstance.on(ActiveText.Events.NAVMAP_LOADED, navMapLoaded);
            $activeTextInstance.on(ActiveText.Commands.GO_TO_PAGE, currentPageChanged);
            $activeTextInstance.on(ActiveText.Hotspots.Events.CLICKED, hotspotClicked);

            $activeTextInstance.on(ActiveText.Events.FRAME_CONTENT_LOADED, frameLoad);
            $activeTextInstance.on(ActiveText.Events.FRAME_CONTENT_ERROR, frameLoad);

            $activeTextInstance.on(ActiveText.Events.UI_ELEMENT_CLICKED, uiElementClicked);

            window.onbeforeunload = beforeClose;
        }
    }

    function teardown() {
        $(activeTextInstance.options.containerElement).off('remove', teardown);

        var $activeTextInstance = $(activeTextInstance);
        $activeTextInstance.off(ActiveText.Events.BOOK_STRUCTURE_LOADED, bookLoadEvent);
        $activeTextInstance.off(ActiveText.Events.NAVMAP_LOADED, navMapLoaded);
        $activeTextInstance.off(ActiveText.Commands.GO_TO_PAGE, currentPageChanged);
        $activeTextInstance.off(ActiveText.Hotspots.Events.CLICKED, hotspotClicked);

        $activeTextInstance.off(ActiveText.Events.FRAME_CONTENT_LOADED, frameLoad);
        $activeTextInstance.off(ActiveText.Events.FRAME_CONTENT_ERROR, frameLoad);

        $activeTextInstance.off(ActiveText.Events.UI_ELEMENT_CLICKED, uiElementClicked);

        window.onbeforeunload = undefined;
    }

    function dispatchEventWithData(type, data) {
        var eventData = $.extend(data, {
            timestamp: new Date().getTime(),
            browser: window.navigator.userAgent,
            whichbook: activeTextInstance.options.pathToAssets,
            host: window.location.href
        });
        //        debug.log('Dispatching Event with type ', type, ' and data is ', eventData);
        $(activeTextInstance).trigger(type, eventData);
    }

    function navMapLoaded() {
        navHasLoaded = true;
    }

    function bookLoadEvent() {
        if(navHasLoaded) {
            var timeToLoad = (new Date().getTime() - startTime) + 'ms';

            var capabilitiesArray = [];
            for(var prop in Modernizr) {
                if(typeof(Modernizr[prop]) === 'boolean') {
                    capabilitiesArray.push(prop);
                }
            }
            var capabilitiesString = capabilitiesArray.toString();

            var extensionsString = '';
            if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.extensions) {
                var extensions = [];
                for(var i = 0, l = activeTextInstance.options.extensions.length; i < l; i++) {
                    extensions.push(activeTextInstance.options.extensions[i].key || '');
                }
                extensionsString = extensions.toString();
            }

            var eventObject = {
                timetoload: timeToLoad,
                capabilities: capabilitiesString,
                extensions: extensionsString,
                screendimensions: window.screen.availWidth + 'x' + window.screen.availHeight
            };

            dispatchEventWithData(ActiveText.Analytics.Events.BOOK_OPENED, eventObject);
        }
    }

    function frameLoad(event, data) {
        var ebookStructure = activeTextInstance.data.getFlatListOfNavigation();
        var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        if(_.contains(visiblePages, data.index)) {
            if(ebookStructure[data.index]) {
                var startTime = parseInt(pageTimes[data.index], 10);
                var loadTime = new Date().getTime() - startTime;
                var eventObject = {
                    pagetitle: ebookStructure[data.index].title,
                    pageindex: data.index,
                    pagenumber: ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, data.index),
                    pageurl: activeTextInstance.utils.getSourcePathForIndex(data.index),
                    viewmode: activeTextInstance.view.model.getScaleMode(),
                    timetoload: loadTime + 'ms'
                };
                dispatchEventWithData(ActiveText.Analytics.Events.PAGE_VIEW, eventObject);
            }
        }
    }

    function uiElementClicked(event, data) {
        var eventObject = {
            elementname: data.which,
            interactiontype: 'click'
        };

        dispatchEventWithData(ActiveText.Analytics.Events.UI_ACTIVATED, eventObject);
    }

    function currentPageChanged(event, data) {
        var startTime = new Date().getTime();
        var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        for(var i = 0, l = visiblePages.length; i < l; i++) {
            pageTimes[visiblePages[i]] = startTime;
        }
    }

    function hotspotClicked(event, data) {
        var uridata = '';
        if(data && data.data) {
            uridata = data.data.uri;
        }
        var eventObject = {
            uridata: uridata,
            type: data.type
        };

        dispatchEventWithData(ActiveText.Analytics.Events.OVERLAY_ACTIVATED, eventObject);
    }

    function beforeClose(event, data) {
        var eventObject = {
        };

        dispatchEventWithData(ActiveText.Analytics.Events.BOOK_CLOSED, eventObject);
    }

    return {
        init: init,
        key: 'analytics'
    };
};