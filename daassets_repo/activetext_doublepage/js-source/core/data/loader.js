/* global ActiveText, ActiveText, fastdom */
/**
 * @class Loader
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init, getDataProvider: getDataProvider, hasLoadedAllResourcesForDisplayedPages: hasLoadedAllResourcesForDisplayedPages, hasLoadedAllResourcesForPage: hasLoadedAllResourcesForPage, loadNextDPS: loadNextDPS, loadPrevDPS: loadPrevDPS, addItemToQueue: addItemToQueue, removeItemFromQueue: removeItemFromQueue}}
 * @constructor
 */
ActiveText.Loader = function(activeTextInstance) {
    'use strict';

    /**
     * @type {object}
     */
    var loaderCache = {};

    var internalDataProvider;

    /**
     * @type {Array}
     */
    var activeQueue;

    /**
     * @type {Array}
     */
    var deferredQueue;

    function init() {
        var preloader = new ActiveText.ContentPreloader(activeTextInstance);
        preloader.init();

        activeQueue = [];
        deferredQueue = [];

        $.support.cors = true;

        var signalBus = $(activeTextInstance);
        signalBus.on(ActiveText.Commands.LOAD_PAGES_AT_INDEX, loadPagesAtIndex);
        signalBus.on(ActiveText.Commands.LOAD_RESOURCES, loadResourcesFromProviders);
        signalBus.on(ActiveText.Commands.LOAD_PAGE_BY_INDEX, loadPageByIndex);
    }

    function loadResourcesFromProviders() {
        var dataProvider = getDataProvider();
        if(dataProvider) {
            dataProvider.getSpineData();
        }
    }

    function getDataProvider() {
        if(activeTextInstance && !internalDataProvider) {
            if(activeTextInstance.options && typeof(window[activeTextInstance.options.dataProvider]) === 'function') {
                internalDataProvider = new window[activeTextInstance.options.dataProvider](activeTextInstance);
            } else if(activeTextInstance.options && typeof(activeTextInstance.options.dataProvider) === 'function') {
                internalDataProvider = new activeTextInstance.options.dataProvider(activeTextInstance);
            } else if(ActiveText && ActiveText.DataProvider && typeof(ActiveText.DataProvider) === 'function') {
                internalDataProvider = new ActiveText.DataProvider(activeTextInstance);
            } else {
                $(activeTextInstance).trigger(ActiveText.Commands.DISPLAY_ERROR, 'DataProvider is not defined.');
            }
        }

        return internalDataProvider;
    }

    function hasCachedVersionOfContentForURL(url) {
        return loaderCache[url] !== undefined;
    }

    //    function removeLoaderFromTargetFrame(index) {
    //        $(activeTextInstance).trigger(ActiveText.Events.FRAME_CONTENT_LOADED, {
    //            index: index
    //        });
    //    }

    /**
     * @param target
     * @returns {boolean}
     */
    function contentContainersHaveNotBeenGeneratedForPage(target) {
        return $(target).children('div.iframe').length === 0;
    }

    function insertContent(target, index, sourceURL) {
        //        removeLoaderFromTargetFrame(index);

        var response = loaderCache[sourceURL];
        if(contentContainersHaveNotBeenGeneratedForPage(target)) {
            var iframeContainerElement = ActiveText.ViewFactory.createPageContentsWithURL(activeTextInstance, sourceURL, index);

            target.find('.spinner').remove();
            iframeContainerElement.prependTo(target);

            $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
        }

        $(activeTextInstance).trigger(ActiveText.Commands.LOAD_RESOURCE_FOR_CURRENT_INDEX, {
            data: response,
            baseURL: sourceURL
        });

        $(activeTextInstance).trigger(ActiveText.Events.FRAME_CONTENT_LOADED, {
            index: index
        });
    }

    function parsePageDimensions(data) {
        var metadataTag = data.match(/<meta name=['|']viewport['|'] content=['|'](.*)['|'][ ]?[\/]?>/i);
        if(metadataTag && metadataTag[1]) {
            var pageSettings = {};
            var keyPairs = metadataTag[1].split(',');
            for(var i = 0; i < keyPairs.length; i++) {
                var trimmedKeyPair = keyPairs[i].replace(/^\s+|\s+$/g, '');
                var keyPair = trimmedKeyPair.split('=');
                pageSettings[keyPair[0]] = parseInt(keyPair[1], 10);
            }
            pageSettings.aspectRatio = pageSettings.width / pageSettings.height;
            activeTextInstance.view.model.setPageDimensions(pageSettings);
        } else {
            var matcher = data.match(/<div id='stop-overflow' style='width:(.*?)px; height:(.*?)px; overflow: hidden;'>/i);
            if(matcher) {
                var width = matcher[1];
                var height = matcher[2];

                activeTextInstance.view.model.setPageDimensions({
                    'width': width,
                    'height': height,
                    'aspectRatio': (width / height)
                });
            }
        }
    }

    function extractDimensionsWithoutAffectingHTML(data) {
        if(data.replace) {
            var correctedResponse = ActiveText.LoaderUtils.correctPointsToPixels(data);
            parsePageDimensions(correctedResponse);
        }
        //        else
        //        {
        //            console.log('unable to parse dimensions from content');
        //        }
    }

    function loadPageContents(sourceURL, targetFrame, index) {
        function parsePageContentsAndInsert(data) {
            extractDimensionsWithoutAffectingHTML(data);
            loaderCache[sourceURL] = data;
            insertContent(targetFrame, index, sourceURL);

        }

        function displayLoadErrorForPage(xmlHttpRequest, textStatus, errorThrown) {
            if(xmlHttpRequest.readyState === 0 || xmlHttpRequest.status === 0) {
                switch(window.location.protocol) {
                    case 'http:':
                    case 'https:':
                        //remote file over http or https
                        if(sourceURL.indexOf('cachebuster') === -1) {
                            setTimeout(function() {
                                getContentForFrame(sourceURL + '?cachebuster=' + Math.random(), targetFrame, index);
                            }, 100);
                        } else {
                            $(activeTextInstance).trigger(ActiveText.Events.FRAME_CONTENT_ERROR, {
                                index: index
                            });
                        }
                        break;
                    case 'file:':
                        //local file
                        insertContent(targetFrame, index, sourceURL);
                        break;
                    default:
                    //some other protocol
                }
                return;  // it's not really an error
            } else {
                /**
                 * If you see this error, you should REALLY go check whether your server is configured to allow
                 * CORS requests. http://bionicspirit.com/blog/2011/03/24/cross-domain-requests.html
                 *
                 * Seriously, go do it now.
                 */
                $(activeTextInstance).trigger(ActiveText.Events.FRAME_CONTENT_ERROR, {
                    index: index
                });
            }
        }

        switch(window.location.protocol) {
            case 'http:':
            case 'https:':
                //remote file over http or https
                if($.browser.msie) {
                    insertContent(targetFrame, index, sourceURL);
                } else {
                    $.ajax({
                        type: 'GET',
                        url: sourceURL,
                        contentType: 'text/plain',
                        crossDomain: true,
                        success: parsePageContentsAndInsert,
                        error: displayLoadErrorForPage
                    });
                }
                break;
            case 'file:':
                //local file
                insertContent(targetFrame, index, sourceURL);
                break;
            default:
            //some other protocol
        }
    }

    function getContentForFrame(sourceURL, targetFrame, index) {
        if(hasCachedVersionOfContentForURL(sourceURL)) {
            insertContent(targetFrame, index, sourceURL);
            $(activeTextInstance).trigger(ActiveText.Events.FRAME_CONTENT_LOADED, {
                index: index
            });
        } else if(ActiveText.LoaderUtils.sourceURLIsValid(sourceURL)) {

            loadPageContents(sourceURL, targetFrame, index);
        } else {
            if(targetFrame) {
                var iframeContainerElement = $('<div class="iframe"></div>').css({
                    position: 'absolute',
                    background: 'white'
                });
                iframeContainerElement.prependTo(targetFrame);
                targetFrame.find('.spinner').remove();
            }

            $(activeTextInstance).trigger(ActiveText.Events.FRAME_CONTENT_LOADED, {
                index: index
            });
        }
    }

    function loadPagesAtIndex(event, startIndex) {
        if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
            $(activeTextInstance).trigger(ActiveText.Commands.LOAD_PAGE_BY_INDEX, {
                index: startIndex
            });
        } else {
            var leftPageIndex = ActiveText.NavigationUtils.calculateLeftmostPageIndexFromIndex(activeTextInstance, startIndex);

            $(activeTextInstance).trigger(ActiveText.Commands.LOAD_PAGE_BY_INDEX, {
                index: leftPageIndex
            });

            $(activeTextInstance).trigger(ActiveText.Commands.LOAD_PAGE_BY_INDEX, {
                index: leftPageIndex + 1
            });
        }
    }

    function loadPageByIndex(event, data) {
        var index = data.index;
        var targetFrame = ActiveText.ViewUtils.getFrameForPageByIndex(activeTextInstance, index);
        var sourceURL = activeTextInstance.utils.getSourcePathForIndex(index);
        getContentForFrame(sourceURL, targetFrame, index);
    }

    function hasLoadedAllResourcesForDisplayedPages(index) {
        var isLeftPage = ActiveText.NavigationUtils.isLeftPage(activeTextInstance, index);
        var leftPage = isLeftPage ? index : index - 1;
        var rightPage = isLeftPage ? index + 1 : index;

        return $.when(
            hasLoadedAllResourcesForPage(leftPage),
            hasLoadedAllResourcesForPage(rightPage)
        );
    }

    function hasLoadedAllResourcesForPage(index) {
        var deferred = $.Deferred();
        var rtn = true;
        var currentItem;
        for(var i = 0, l = activeQueue.length; i < l; i++) {
            currentItem = activeQueue[i];
            if(currentItem.index === index) {
                rtn = false;
            }
        }
        deferredQueue[index] = deferred;
        if(rtn) {
            setTimeout(function() {
                deferred.resolve(index);
            }, 0);
        } else {
            if(deferredQueue[index]) {
                deferredQueue[index].resolve(index);
            }
        }
        return deferred;
    }

    function loadNextDPS() {
        var currentIndex = activeTextInstance.model.getCurrentIndex();
        $(activeTextInstance).trigger(ActiveText.Commands.LOAD_PAGES_AT_INDEX, [currentIndex + 2]);
    }

    function loadPrevDPS() {
        var currentIndex = activeTextInstance.model.getCurrentIndex();
        $(activeTextInstance).trigger(ActiveText.Commands.LOAD_PAGES_AT_INDEX, [currentIndex - 2]);
    }

    function addItemToQueue(item) {
        activeQueue.push(item);
    }

    function removeItemFromQueue(item) {
        for(var i = 0, l = activeQueue.length; i < l; i++) {
            if(activeQueue[i].index === item.index) {
                activeQueue.slice(i, 1);
            }
        }
        if(deferredQueue[item.index]) {
            deferredQueue[item.index].resolve(item.index);
        }
    }

    return {
        init: init,
        getDataProvider: getDataProvider,
        hasLoadedAllResourcesForDisplayedPages: hasLoadedAllResourcesForDisplayedPages,
        hasLoadedAllResourcesForPage: hasLoadedAllResourcesForPage,
        loadNextDPS: loadNextDPS,
        loadPrevDPS: loadPrevDPS,
        addItemToQueue: addItemToQueue,
        removeItemFromQueue: removeItemFromQueue
    };
};