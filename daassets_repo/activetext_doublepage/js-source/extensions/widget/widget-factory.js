/* global ActiveText, ActiveText */

/**
 * @class PListObject
 * @type {{Width:number, Height:number, CloseBoxInsetX:number, CloseBoxInsetY:number, CFBundleDisplayName:string}}
 */
ActiveText.Widget = ActiveText.Widget || {};

/**
 * @class Factory
 * @memberOf ActiveText.Widget
 * @type {{insertCSS:function, createWidgetFromData:function}}
 */
ActiveText.Widget.Factory = (function() {
    'use strict';

    /**
     * @type {ActiveText.Widget.Helper}
     */
    var helper = ActiveText.Widget.Helper;

    function insertCSS(activeTextInstance) {
        ActiveText.CSSUtils.embedCSS(ActiveText.DialogStyleText.getStyle(activeTextInstance), 'standalone-widget');
    }

    function onPListLoadError() {
        //        debug.log('Unable to load PList data:', arguments);
    }

    function createWidgetFromData(activeTextInstance, hotspotData, cssClass) {
        /**
         * @param event {event}
         * @param ui {object}
         */
        function createHandler(event, ui) {
            try {
                /* jshint validthis:true */
                var dialog = $(this).dialog('widget');
                var data = $(this).data();

                setDialogPosition(dialog, data);
                sendMessageToParent();

                dialog.find('.ui-dialog-titlebar').removeClass('ui-corner-all').addClass('ui-corner-top');
                dialog.removeClass('ui-corner-all').addClass('ui-corner-top');
                dialog.find('.ui-widget-content').css('overflow', 'hidden');
            }
            catch(err) {
                // catch errors
            }
        }

        function resizeDialog(dialog, containerElement, data) {
            var css = {};
            var dialogContainer = $(dialog);
            var dialogElement = $('.ui-dialog');
            dialogContainer.availHeight = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance).availHeight;

            // always resize if it's core widget - ratio is set above
            if(dialogElement.height() > dialogContainer.availHeight || data.coreWidget) {
                ActiveText.ViewUtils.scaleHTMLElement(activeTextInstance, dialog, dialog.ratio.height);
                dialog.css('transformOrigin', '50% 50%');
            }
            if(dialogElement.width() > containerElement.width() || data.coreWidget) {
                ActiveText.ViewUtils.scaleHTMLElement(activeTextInstance, dialog, dialog.ratio.width);
                dialog.css('transformOrigin', '50% 50%');
            }

            if(data.position === 'center' || data.position === undefined) {
                dialog.position.top = (dialog.offset.top + (containerElement.height() - dialog.height()) / 2) - 1;
                dialog.position.left = dialog.offset.left + (containerElement.width() - dialog.width()) / 2;
            }

            if(dialog.position.left) {
                css.left = helper.fixCoordinateValue(dialog.position.left) + 'px';
            }

            if(dialog.position.top) {
                if(dialog.position.top < 0 && dialogContainer.hasClass('chromeless')) {
                    dialog.position.top += 20;
                }
                css.top = helper.fixCoordinateValue(dialog.position.top) + 'px';
            }
            dialogContainer.css(css);
        }

        function sendMessageToParent(){
            window.parent.postMessage('widget-opened', '*');
        }

        function setDialogPosition(dialog, hotspotData) {
            var containerElement = $(window);
            if(activeTextInstance) {
                containerElement = activeTextInstance.options.containerElement.find('.whiteboard-container');
            }
            dialog.offset = containerElement.offset();

            if(closeButton) {
                positionTheCloseButtonBasedOnThePList(hotspotData);
            }

            var data = hotspotData || {};

            dialog.position = {};
            if(data.hasOwnProperty('parsedUri')){
                dialog.position.left = data.parsedUri.x;
                dialog.position.top = data.parsedUri.y;
            }
            var dimensions = helper.calculateWidgetSize(containerElement, data);
            var elementToScaleHeight = data.coreWidget ? dialog : dialog.find('.ui-widget-content');

            dialog.width(dimensions.width);
            elementToScaleHeight.height(dimensions.height);

            data.coreWidget = (data.coreWidget !== undefined) ? data.coreWidget : true;
            // set default resizing ratios
            dialog.ratio = {
                width: containerElement.width() / dialog.width(),
                height: containerElement.height() / dialog.height()
            };
            // tweak in case it's a core widget
            if(data.coreWidget){
                dialog.ratio.width = Math.min(dialog.ratio.width, 1);
                dialog.ratio.height = Math.min(dialog.ratio.height, 1);
            }

            if(data.position === 'center' || data.position === undefined) {
                dialog.position.top = (dialog.offset.top + (containerElement.height() - dialog.height()) / 2) - 1;
                dialog.position.left = dialog.offset.left + (containerElement.width() - dialog.width()) / 2;
            }

            var css = {};
            var dialogContainer = $(dialog);
            if(dialog.position.left) {
                css.left = helper.fixCoordinateValue(dialog.position.left) + 'px';
            }

            if(dialog.position.top) {
                if(dialog.position.top < 0 && dialogContainer.hasClass('chromeless')) {
                    dialog.position.top += 20;
                }
                css.top = helper.fixCoordinateValue(dialog.position.top) + 'px';
            }
            dialogContainer.css(css);
            setTimeout(function(){
                resizeDialog(dialog, containerElement, data);
            }, 500);
            

        }

        function loadPListFile(basePath) {
            var path = basePath.split('/');
            path.pop();

            var baseURL = path.join('/');

            $.ajax({
                url: baseURL + '/Info.plist',
                dataType: 'text xml',
                success: onPListLoadSuccess,
                error: onPListLoadError
            });
        }

        /**
         * @param hotspotData {{plist:PListObject}}
         */
        function positionTheCloseButtonBasedOnThePList(hotspotData) {
            if(hotspotData && hotspotData.plist) {
                /**
                 * The offset needed to find the centre of the image (width/2)
                 *
                 * @type {number}
                 * @const
                 */
                var CLOSE_BUTTON_CENTREPOINT_OFFSET = 15;

                var closePosX, closePosY, scale;

                if(hotspotData.plist.CloseBoxInsetX !== undefined) {
                    closePosX = parseInt(hotspotData.plist.CloseBoxInsetX, 10) + CLOSE_BUTTON_CENTREPOINT_OFFSET;
                    closeButton.css('left', (closePosX - (CLOSE_BUTTON_CENTREPOINT_OFFSET * 2)) + 'px');
                }

                if(hotspotData.plist.CloseBoxInsetY !== undefined) {
                    closePosY = parseInt(hotspotData.plist.CloseBoxInsetY, 10) + CLOSE_BUTTON_CENTREPOINT_OFFSET;
                    closeButton.css('top', (closePosY - (CLOSE_BUTTON_CENTREPOINT_OFFSET * 2)) + 'px');
                }

                var actualDimensions = helper.calculateWidgetSize(activeTextInstance.options.containerElement.find('.whiteboard-container'), hotspotData);
                var plistWidth = parseInt(hotspotData.plist.Width, 10);
                var plistHeight = parseInt(hotspotData.plist.Height, 10);

                if(plistWidth !== undefined && closePosX !== undefined) {
                    if(actualDimensions.width !== plistWidth) {
                        scale = ((actualDimensions.width) / plistWidth);
                        closeButton.css('left', (((closePosX - CLOSE_BUTTON_CENTREPOINT_OFFSET) * scale)) + 'px');
                    }
                }

                if(plistHeight !== undefined && closePosY !== undefined) {
                    if(actualDimensions.height !== plistHeight) {
                        scale = ((actualDimensions.height) / plistHeight);// - (30 / scale)
                        closeButton.css('top', (((closePosY - CLOSE_BUTTON_CENTREPOINT_OFFSET) * scale)) + 'px');
                    }
                }
            }
        }

        function onPListLoadSuccess(xmlData) {
            /* jshint sub:true */
            var dict = $(xmlData).find('dict').children();
            var keyPairs = {};

            for(var i = 0, l = dict.length; i < l; i++) {
                keyPairs[$(dict[i]).text()] = $(dict[i + 1]).text();
                i++;
            }

            hotspotData.plist = keyPairs;

            if(dialog) {
                hotspotData.coreWidget = keyPairs['CFBundleIdentifier'].indexOf('com.Pearson') !== -1;
                dialog.data(hotspotData);

                var isAChromelessDialog = hotspotData.parsedUri.transparent !== 'true' &&
                    hotspotData.parsedUri.chromeless !== 'true';
                var aTitleIsDefinedInThePList = keyPairs['CFBundleDisplayName'] !== undefined;
                if(isAChromelessDialog && aTitleIsDefinedInThePList) {
                    dialog.dialog('option', 'title', keyPairs['CFBundleDisplayName']);
                }
                try {
                    //setDialogPosition(dialog.dialog('widget'), hotspotData);
                }
                catch(err) {
                    // catch errors
                }
            }
        }

        function onWindowResize(event) {
            var dialog = event.data.dialog,
                dialogData = dialog.data();

            if(dialogData.position !== 'absolute') {
                try {
                    var widget = dialog.dialog('widget');
                    setTimeout(function(){
                        setDialogPosition(widget, dialogData);
                    }, 500);
                }
                catch(err) {
                    // catch errors
                }
            }
        }

        function closeHandler() {
            /* jshint validthis:true */
            //                        try
            //                        {
            activeTextInstance.options.containerElement.css({zIndex: 1});
            $(this).empty().dialog().dialog('destroy').remove();
            //            }
            //            catch(e)
            //            {
            //                setTimeout(closeHandler, 100);
            //            }
        }

        var pathToSourcePages = activeTextInstance.loader.getDataProvider().getPathToPages();
        var pathToWidgetContents = hotspotData.widgetpath;
        var widgetPath = pathToSourcePages + pathToWidgetContents;

        if(!pathToWidgetContents && hotspotData.uri !== undefined) {
            pathToWidgetContents = hotspotData.uri;
            widgetPath = hotspotData.id === 'ATX-autoPop' ? pathToWidgetContents : pathToSourcePages +
                pathToWidgetContents;
        }

        function makeTheContentVisible() {
            /* jshint validthis:true */
            $(this).css('visibility', '');
        }

        var iframeString = '<iframe id="widget-iframe" frameborder="0" allowtransparency="true" scrolling="no" width="100%" height="100%" seamless></iframe>';
        var iframeElement = $(iframeString).load(makeTheContentVisible).attr('src', widgetPath);

        if(!ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
            iframeElement.css('visibility', 'hidden');
        }

        var template = $('<div class="activetext-widget" />');

        iframeElement.appendTo(template);

        var parsedUri = hotspotData.parsedUri;
        var closeButton;

        var isResizable = helper.parseResizeValue(parsedUri);
        var isModal = helper.parseModalValue(parsedUri);
        var isChromeLess = helper.parseChromelessValue(parsedUri);
        var hasCustomClose = helper.parseCustomCloseValue(parsedUri);
        var dialogPosition = helper.parsePositionValue(parsedUri);

        var dialogClass = cssClass || 'widget-dialog';

        if(isChromeLess) {
            dialogClass += ' chromeless';
            isResizable = false;
        }

        var dimensions = helper.calculateWidgetSize(activeTextInstance.options.containerElement.find('.whiteboard-container'), hotspotData);

        var dialog = template.dialog({
            width: dimensions.width,
            height: dimensions.height,
            title: parsedUri.title || undefined,
            modal: isModal,
            dialogClass: dialogClass,
            position: dialogPosition,
            resizable: isResizable,
            close: closeHandler,
            open: createHandler,
            autoOpen: false,
            closeOnEscape: isChromeLess,
        }).data(hotspotData);

        if(isChromeLess && !hasCustomClose) {
            var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
            closeButton = ActiveText.Widget.CloseButtonFactory.createCloseButton(pathToResources);
            closeButton.click(function chromelessCloseButtonClickHandler() {
                dialog.dialog('close');
            });
            dialog.parent().append(closeButton);
        }

        dialog.css({
            boxShadow: 'none'
        });

        helper.attachBehavioursToAllowSmoothResizeWithIFrameToDialog(dialog);
        dialog.dialog('open');

        loadPListFile(widgetPath);

        $(activeTextInstance).on(ActiveText.Events.RESIZE, {dialog: dialog}, onWindowResize);

        return dialog;
    }

    return {
        insertCSS: insertCSS,
        createWidgetFromData: createWidgetFromData
    };
})();