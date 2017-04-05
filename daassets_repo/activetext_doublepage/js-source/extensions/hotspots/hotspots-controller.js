/* global ActiveText, ActiveText, requestAnimationFrame, Modernizr */
ActiveText.Hotspots = ActiveText.Hotspots || {};
/**
 * @class Controller
 * @memberOf ActiveText.Hotspots
 * @param activeTextInstance {ActiveText}
 * @param hotspotFactory {Function}
 * @param options {*}
 * @returns {{}}
 * @constructor
 */
ActiveText.Hotspots.Controller = function(activeTextInstance, hotspotFactory, options) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var LAYER_KEY = 'standalone_hotspots';

    /**
     * @type {ActiveText.Widget.Controller}
     */
    var widgetController;

    function init() {
        widgetController = new ActiveText.Widget.Controller(activeTextInstance);

        $(activeTextInstance).on(ActiveText.Events.LOADED_OVERLAY_DATA, addIconsToOverlay);

        var resizeFunction = ActiveText.ResizeUtils.getProportionalResizeBehaviour(activeTextInstance, LAYER_KEY);
        $(activeTextInstance).on(ActiveText.Events.RESIZE, resizeFunction);

        if(!hotspotFactory || typeof(hotspotFactory) !== 'function') {
            hotspotFactory = ActiveText.Hotspots.Factory.createHotspotIcon;
        }

        var autoLaunchingWidgetController = new ActiveText.Hotspots.AutoLoadingWidgetsController(activeTextInstance, options);
        autoLaunchingWidgetController.init(api);
    }

    function teardown() {
        $(activeTextInstance).off(ActiveText.Events.LOADED_OVERLAY_DATA, addIconsToOverlay);
        var resizeFunction = ActiveText.ResizeUtils.getProportionalResizeBehaviour(activeTextInstance, LAYER_KEY);
        $(activeTextInstance).off(ActiveText.Events.RESIZE, resizeFunction);
    }

    function checkIfURILinksToAWidget(uri) {
        return uri.indexOf('wdgt') !== -1;
    }

    function accessibleClick(event) {
        /* jshint validthis:true */
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode === ActiveText.Keymap.ENTER) {
            $(this).click();
        }
    }

    /**
     * @param event {event}
     * @param overlayData {object}
     */
    function addIconsToOverlay(event, overlayData) {
        var data = overlayData.data;
        var index = overlayData.index;
        var dimensions = activeTextInstance.view.model.getZoomAreaDimensions();
        var overlayWrapperElement;
        var newIcons = [];
        var newIcon;
        var len = data.length;
        var item;
        var uri = '';

        if(!(data.length === 1 && data[0].type === 'description')) {
            overlayWrapperElement = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, index, LAYER_KEY);
            overlayWrapperElement.empty();
        }

        for(var i = 0; i < len; i++) {
            item = data[i];
            if(item.data && item.data.uri) {
                uri = item.data.uri;
                item.data.parsedUri = ActiveText.DataUtils.parseURI(uri);
            }
            item.widget = checkIfURILinksToAWidget(uri);
            //$.extend(item.data, dataParsedFromURI);
            if(item.type) {
                if(item.type.toLowerCase() === 'hotspot' || item.type.toLowerCase() === 'audio') {
                    newIcon = hotspotFactory(activeTextInstance, item, dimensions, options);
                } else if(item.type.toLowerCase() === 'target-area') {
                    newIcon = ActiveText.Hotspots.TargetAreaFactory.createTarget(item);
                }
            }

            if(newIcon && newIcon !== null) {
                if($.browser.msie && !Modernizr.svg) {
                    var img = $(newIcon),
                        src = img.attr('src');

                    img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
                        .css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled="true",sizingMethod="crop",src="' +
                            src + '")');
                }
                newIcon.data(item);
                $(activeTextInstance).trigger('activetext.hotspot.created', {
                    hotspot: newIcon,
                    uri: uri
                });
                newIcon.on({
                    click: _.debounce(hotspotClickHandler, 500, true), // debounce catches double clicks and turns them into single clicks
                    keypress: accessibleClick
                });

                if(newIcon.find('polygon').length === 0) {
                    newIcon.attr({
                        tabindex: 100,
                        role: 'button',
                        'aria-label': item.type
                    });
                } else {
                    newIcon.find('polygon').attr({
                        tabindex: 100,
                        role: 'button',
                        'aria-label': item.type
                    });
                }

                newIcons.push(newIcon);
            }
            newIcon = null;
        }

        if(newIcons.length > 0){
            if(Modernizr.csstransforms) {
                $(newIcons).appendTo(overlayWrapperElement);
            } else {
                $(newIcons).each(function() {
                    var wrapper = $('<div style="position:absolute;zoom:1;z-index:1;width:100%;filter:inherit"></div>');
                    $(this).appendTo(wrapper);
                    wrapper.appendTo(overlayWrapperElement);
                });
            }
            $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
        }

    }

    function callHotspotClickActionWithData(event, data) {
        if(options && options.hotspotClickFunction && typeof(options.hotspotClickFunction) === 'function') {
            /* jshint validthis:true */
            options.hotspotClickFunction(event, data);
        } else {
            debug.log('HotspotController click action called but no valid function attached.');
        }
    }

    function widgetClickHandler(e, data) {
        activeTextInstance.options.containerElement.css({zIndex: -1});
        return widgetController.openWidgetPopoverFromData(data);
    }

    function characterSelectClickHandler(e, data) {
        var uri = data.data.uri.toString();
        var characterName = ActiveText.Hotspots.Helper.returnCharacterFromUri(uri);
        var $charTarget = $(e.target);

        if($charTarget.hasClass('charSelect')) {
            $charTarget = $charTarget.children(':first');
        }

        if($charTarget.attr('class') !== 'character-selected' &&
            ActiveText.CharacterSelection.getCharacter() !== characterName) {
            ActiveText.CharacterSelection.setCharacter($charTarget, characterName);

        } else if($charTarget.attr('class') === 'character-selected' &&
            ActiveText.CharacterSelection.getCharacter() === characterName) {
            ActiveText.CharacterSelection.deselectCharacter($charTarget, characterName);
        }
    }

    function hotspotWithURISchemeClickHandler(e, data) {
        var rtn;
        var target = data.data.uri;
        var flatNavigation = activeTextInstance.data.getFlatListOfNavigation();
        var flatNavigationLength = flatNavigation.length;
        var src, pageIndex;

        for(var i = 0; flatNavigationLength > i; i++) {
            src = flatNavigation[i].src;
            if(src.indexOf(target) !== -1) {
                pageIndex = i;
            }
        }

        if(pageIndex) {
            var pageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, pageIndex);
            rtn = activeTextInstance.navigation.gotoPage(pageNumber);
        } else {
            rtn = callHotspotClickActionWithData(e, data);
        }

        return rtn;
    }

    /**
     * @param e {event}
     * @returns {boolean}
     */
    function hotspotClickHandler(e) {
        var rtn;
        /* jshint validthis:true */
        var data = $(this).data();
        var uriString;
        var clickToPrompt;

        if(data.widget === true) {
            $(activeTextInstance).trigger(ActiveText.Hotspots.Events.CLICKED, data);
            rtn = widgetClickHandler(e, data);
        } else if(data.data && data.data.uri) {
            uriString = data.data.uri.toLowerCase();

            if(uriString.indexOf('type=prompt') !== -1) {
                clickToPrompt = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'clicktoprompt');
                if(clickToPrompt) {
                    rtn = clickToPrompt.hotspotClickFunction(e, data);
                } else {
                    debug.log('Click To Prompt Hotspot was clicked, but no ClickToPrompt controller was found.');
                }
            } else if(uriString.indexOf('type=audio') !== -1) {
                //use click to promopt to serve hotspot audio
                clickToPrompt = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'clicktoprompt');
                var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);

                if(clickToPrompt && audioPlayback.playing() === false) {
                    rtn = clickToPrompt.hotspotClickFunction(e, data);
                } else {
                    debug.log('Click To Prompt Hotspot was clicked, but no ClickToPrompt controller was found.');
                }

            } else if(uriString.indexOf('character') !== -1) {
                rtn = characterSelectClickHandler(e, data);
            } else {
                $(activeTextInstance).trigger(ActiveText.Hotspots.Events.CLICKED, data);
                rtn = hotspotWithURISchemeClickHandler(e, data);
            }
        } else {
            $(activeTextInstance).trigger(ActiveText.Hotspots.Events.CLICKED, data);
            rtn = callHotspotClickActionWithData(e, data);
        }
        return rtn;
    }

    var api = {
        init: init,
        teardown: teardown,
        hotspotClickHandler: hotspotClickHandler
    };
    return  api;
};
