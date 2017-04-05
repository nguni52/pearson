/* global ActiveText, ActiveText, requestAnimationFrame */
/**
 * @const
 * @type {string}
 */
var INVALID_EPUB_SPINE_MESSAGE = 'No valid ePub spine';

/**
 * @const
 * @type {string}
 */
var ERROR_LOADING_STRUCTURE = 'An Error Occurred loading the eBook structure';

/**
 * @class DataProvider
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{getSpineData: loadLocalSpineFile, getOPFURL: getOPFURL, setOPFURL: setOPFURL, getNCXURL: getNCXURL, setNCXURL: setNCXURL, getPathToPages: getPathToPages, getPathToMETA: getPathToMETA}}
 * @constructor
 */
ActiveText.DataProvider = function(activeTextInstance) {
    'use strict';

    /**
     * @type {string}
     */
    var cachedNCXURL;

    /**
     * @type {string}
     */
    var cachedOPFURL;

    /**
     * @type {Boolean}
     */
    var hasNCXFile;

    /**
     * A local cache of the NCX file, to make cross-referencing the OPF and NCX data easier and self-contained.
     * @type {object}
     */
    var ncxFileCache;

    var ua = navigator.userAgent, phantom = /phantom/i.test(ua);

    var shouldCacheTheseFiles = ActiveText.Constants.USE_LOCAL_CACHE;

    var numberingOffsetIncrement = 0;

    if(ua.match(/mozilla/i)) {
        shouldCacheTheseFiles = false;
    }

    function throwInvalidSpineError() {
        $(activeTextInstance).trigger(ActiveText.Commands.DISPLAY_ERROR, INVALID_EPUB_SPINE_MESSAGE);
    }

    function throwStructureLoadError(jqXHR, textStatus, errorThrown) {
        if(!phantom) {
            debug.log('An Error Occurred', jqXHR, textStatus, errorThrown);
        }
        //        debug.error('Unable to load epub structure from ' + cachedOPFURL);
        $(activeTextInstance).trigger(ActiveText.Events.RESOURCES_ERROR);
        $(activeTextInstance).trigger(ActiveText.Commands.DISPLAY_ERROR, errorThrown);
        //        $(activeTextInstance).trigger(ActiveText.Commands.DISPLAY_ERROR, ERROR_LOADING_STRUCTURE);
    }

    /**
     * @param status {string}
     * @return {Boolean}
     */
    function isValidResponse(status) {
        return status !== 'error';
    }

    function parseNCXFile(result, status) {
        $(activeTextInstance).trigger(ActiveText.Commands.SHOW_LOADER);

        if(isValidResponse(status)) {
            var navmapData = extractNavMapFromNCX(result);
            $(activeTextInstance).trigger(ActiveText.Events.NAVMAP_LOADED, [navmapData]);
            $(activeTextInstance).trigger(ActiveText.Commands.HIDE_LOADER);
        } else {
            //            debug.error('NCX is not a valid response.');
            throwStructureLoadError();
        }
    }

    function extractStructureFromOPF(result, status) {
        $(activeTextInstance).trigger(ActiveText.Commands.SHOW_LOADER);
        $(activeTextInstance).trigger(ActiveText.Events.OPF_DATA_LOADED, result);

        if(isValidResponse(status)) {
            var url = parseNCXReference(result);
            var resultPromise = convertOPFToAPIResponse(result);

            resultPromise.done(function(results) {
                if(results !== undefined) {
                    $(activeTextInstance).trigger(ActiveText.Events.BOOK_STRUCTURE_LOADED, [results]);
                    if(url !== '') {
                        loadNCXFile(url);
                    }

                    var existingVar = activeTextInstance.settings.getNumberingOffset();
                    activeTextInstance.settings.setNumberingOffset(existingVar + numberingOffsetIncrement);

                    if((numberingOffsetIncrement % 2)) {
                        activeTextInstance.settings.setFirstPageIsLeft(!activeTextInstance.settings.getFirstPageIsLeft());
                    }

                    if(results.length === 1) {
                        activeTextInstance.options.defaults = activeTextInstance.options.defaults || {};
                        activeTextInstance.options.defaults.pagesToDisplay = 1;
                        $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_SPS_VIEW);
                    }

                }
            });
        } else {
            debug.error('OPF Structure is not valid.');
            throwStructureLoadError();
        }
    }

    function loadNCXFile(url) {
        if(url) {
            setNCXURL(url);
            //            debug.log('Attempting to Load: ' + url);
            $.ajax({
                url: url,
                dataType: 'text xml',
                localCache: shouldCacheTheseFiles,
                success: parseNCXFile,
                error: throwStructureLoadError
            });
        } else {
            debug.error('Unable to load NCX data file for ActiveText instance, because path was ', url);
        }
        return url;
    }

    function loadOPFFile(url) {
        if(url) {
            setOPFURL(url);
            //            debug.log('Attempting to Load: ' + url);
            $.ajax({
                url: url,
                dataType: 'text xml',
                localCache: shouldCacheTheseFiles,
                success: extractStructureFromOPF,
                error: throwStructureLoadError
            });
        } else {
            debug.error('Unable to load OPF data file for ActiveText instance, because path was ', url);
        }
    }

    function loadLocalSpineFile() {
        var validSpine = false;
        if(activeTextInstance && activeTextInstance.options) {
            $(document).ready(function() {
                loadMetaInfContainer();
            });
            validSpine = true;
        } else {
            throwInvalidSpineError();
        }
        return validSpine;
    }

    function loadOPFFileOnEvent(e) {
        var opfurl = getOPFURL();
        loadOPFFile(opfurl);
    }

    function parseContainerXML(containerFileData) {
        $(activeTextInstance).trigger(ActiveText.Commands.SHOW_LOADER);

        if(containerFileData) {
            var nodes = $(containerFileData).find('container > rootfiles > rootfile');
            if(nodes.attr('media-type') === 'application/oebps-package+xml') {
                var pathToOPF = activeTextInstance.options.pathToAssets + nodes.attr('full-path');
                setOPFURL(pathToOPF);
                $(activeTextInstance).one(ActiveText.Settings.Events.LOADED + ' ' +
                    ActiveText.Settings.Events.LOAD_ERROR, loadOPFFileOnEvent);
            } else {
                throwInvalidSpineError();
            }
            $(activeTextInstance).trigger(ActiveText.Events.CONTAINER_XML_LOADED, containerFileData);
        } else {
            debug.error('Unable to load container.xml file for title.');
        }
    }

    function loadMetaInfContainer() {
        var url = activeTextInstance.options.pathToAssets + 'META-INF/container.xml';
        //        debug.log('Attempting to Load: ' + url);
        $.ajax({
            url: url,
            dataType: 'text xml',
            localCache: shouldCacheTheseFiles,
            success: parseContainerXML,
            error: throwStructureLoadError
        });
    }

    function extractNavPointDataFromNode(node, pages) {
        var currentNavPoint, currentNavPointSource, pageNumber;
        var numberingOffset = activeTextInstance.settings.getNumberingOffset();
        var navPoints = $(node).find('> navPoint');
        var rtn = [];
        for(var i = 0, l = navPoints.length; i < l; i++) {
            currentNavPoint = $(navPoints[i]);
            currentNavPointSource = currentNavPoint.find('> content').attr('src');
            pageNumber = parseInt(pages.find('> pageTarget content[src="' + currentNavPointSource +
                '"]').parent().attr('playOrder'), 10) + (numberingOffset - 1);
            if(isNaN(pageNumber)) {
                pageNumber = parseInt(currentNavPoint.attr('playOrder'), 10) + (numberingOffset - 1);
            }
            rtn.push({
                id: i,
                title: currentNavPoint.find('> navLabel text').text(),
                html_location: currentNavPointSource,
                number: pageNumber,
                children: extractNavPointDataFromNode(navPoints[i], pages)
            });
        }
        return rtn;
    }

    /**
     * @param ncxFileData {XMLDocument}
     * @returns {Array}
     */
    function extractNavMapFromNCX(ncxFileData) {
        ncxFileCache = ncxFileData;
        var nodes = $(ncxFileData).find('navMap');
        var pages = $(ncxFileData).find('pageList');
        return extractNavPointDataFromNode(nodes, pages);
    }

    /**
     * @param opfFileData {XMLDocument}
     * @returns {string}
     */
    function parseNCXReference(opfFileData) {
        var rtn = '';
        var parsedOPFData = $(opfFileData);
        var ncxItem = parsedOPFData.find('spine').attr('toc');
        if(ncxItem !== undefined) {
            hasNCXFile = true;
            rtn = getPathToPages() + parsedOPFData.find('manifest item[id="' + ncxItem + '"]').attr('href');
        } else {
            hasNCXFile = false;
        }
        return rtn;
    }

    function convertOPFToAPIResponse(opfFileData) {
        var rtn = $.Deferred();

        var parsedOPFData = $(opfFileData);
        var spine = parsedOPFData.find('spine');
        var manifest = parsedOPFData.find('manifest');
        var metadata = parsedOPFData.find('metadata');
        var spineNodes = spine.find('itemref[linear!="no"]');
        var opfMeta = {};
        var results = [];

        metadata = $(metadata).find(':not(meta)');
        metadata.each(function(i) {
            var nodeName = metadata[i].nodeName;
            /* Strip DC namespace from tags */
            nodeName = nodeName.replace(/(\/?)([^:>\s]*:)?([^>]+)/g, '$1$3');
            /* Check if the tag has content, if not return empty string */
            opfMeta[nodeName] = metadata[i].childNodes[0] ? metadata[i].childNodes[0].nodeValue : '';
        });

        $(activeTextInstance).trigger(ActiveText.Events.OPF_META_LOADED, [opfMeta]);

        function handleData(data, offset) {
            var idRef = $(spineNodes[offset]).attr('idref');
            var node = manifest.find('item[id="' + idRef + '"]');
            var pageEntry = {
                id: offset,
                index: offset,
                title: (hasNCXFile) ? '' : idRef,
                html_location: node.attr('href')
            };

            if(ActiveText.PageRangeHelper.isAllowedPageNumber(activeTextInstance, ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, offset))) {
                results.push(pageEntry);
            } else {
                // if nothing is allowed in yet, and we haven't had an initial page, we need to start incrementing the
                // starting page number.
                if(results.length === 0) {
                    numberingOffsetIncrement++;
                }
            }

            offset += 1;
            if(offset < data.length) {
                var loopFunction = function() {
                    handleData(data, offset);
                };

                if(phantom || !ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
                    loopFunction();
                } else {
                    requestAnimationFrame(loopFunction);
                }
            } else {
                rtn.resolve(results);

            }
        }

        handleData(spineNodes, 0);

        return rtn;
    }

    function getOPFURL() {
        return cachedOPFURL || '';
    }

    function setOPFURL(url) {
        cachedOPFURL = url;
    }

    function getNCXURL() {
        return cachedNCXURL || '';
    }

    function setNCXURL(url) {
        cachedNCXURL = url;
    }

    function getPathToPages() {
        var splitPath = getOPFURL().split('/');
        splitPath.pop();
        return splitPath.join('/') + '/';
    }

    function getPathToMETA() {
        return activeTextInstance.options.pathToAssets + 'META-INF/';
    }

    function init() {
        var customSettingsParser = new ActiveText.CustomSettingsParser();
        customSettingsParser.init(activeTextInstance);

        $(activeTextInstance).on(ActiveText.Events.NAVMAP_LOADED, replacePageTitleWithPageNumber);
    }

    /**
     * Merges the NCX navLabel elements with the flat list of content from the OPF, and fires out an updated
     * list of content that includes information from both files.
     *
     * @param event {Event=}
     */
    function replacePageTitleWithPageNumber(event) {
        var opfPageList = activeTextInstance.data.getFlatListOfNavigation();
        var navLabels = $(ncxFileCache).find('pageList > pageTarget > navLabel > text');
        for(var i = 0; i < opfPageList.length; i++) {
            opfPageList[i].title = $(navLabels[i]).text();
        }
        $(activeTextInstance).trigger(ActiveText.Events.BOOK_STRUCTURE_LOADED, [opfPageList]);

        ncxFileCache = null;
    }

    init();

    return {
        getSpineData: loadLocalSpineFile,
        getOPFURL: getOPFURL,
        setOPFURL: setOPFURL,
        getNCXURL: getNCXURL,
        setNCXURL: setNCXURL,
        getPathToPages: getPathToPages,
        getPathToMETA: getPathToMETA
    };
};