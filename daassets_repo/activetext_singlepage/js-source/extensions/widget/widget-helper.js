/* global ActiveText, ActiveText */
ActiveText.Widget = ActiveText.Widget || {};
ActiveText.Widget.Helper = (function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_DIALOG_WIDTH = 480;

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_DIALOG_HEIGHT = 320;

    /**
     * @const
     * @type {number}
     */
    var HEIGHT_OF_TITLEBAR = 31;

    /**
     * If supplied a number-as-a-string, we need to add 'px' to the value,
     * unless of course, the value is already a px value or a percentage.
     *
     * @param value {string|number}
     * @returns {string|number}
     */
    function fixCoordinateValue(value) {
        if(typeof value === 'string') {
            if(!(value.indexOf('px') !== -1 || value.indexOf('%') !== -1)) {
                value += 'px';
            }
        }
        return value;
    }

    function attachBehavioursToAllowSmoothResizeWithIFrameToDialog(dialog) {
        dialog.bind('dialogdragstart dialogresizestart', function() {
            var overlay,
                modal;

            if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer === true) {
                modal = $('<div class="dialog-resize-modal"></div>');
                modal.fadeTo(0, 0);
                $(this).parent().before(modal);
            }

            overlay = $(this).find('.hidden-dialog-overlay');

            if(overlay.length === 0) {
                overlay = $('<div class="hidden-dialog-overlay"></div>');
                overlay.appendTo(this);
            }
            else {
                overlay.show();
            }
        }).bind('dialogdragstop dialogresizestop', function() {
            var data = dialog.data();

            data.position = 'absolute';
            data.x = dialog.css('left');
            data.y = dialog.css('top');
            data.w = data.width = dialog.css('width');
            data.h = data.height = dialog.css('height');

            dialog.data(data);

            if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer === true) {
                $(this).parent().parent().find('.dialog-resize-modal').remove();
            }

            $(this).find('.hidden-dialog-overlay').hide();
        });
    }

    function parseResizeValue(parsedUri) {
        var canResize = true;

        if(parsedUri.resizable !== undefined && parsedUri.resizable === false) {
            canResize = false;
        }
        if(parsedUri.size !== undefined) {
            canResize = false;
        }
        return canResize;
    }

    function parseModalValue(parsedUri) {
        var isModal = false;

        if(parsedUri.modal !== undefined && Boolean(parsedUri.modal) === true) {
            isModal = true;
        }
        return isModal;
    }

    function parseChromelessValue(parsedUri) {
        var isChromeLess = parsedUri.chromeless && parsedUri.chromeless.toString() === 'true' ||
            parsedUri.transparent && parsedUri.transparent.toString() === 'true';
        return isChromeLess;
    }

    function parseCustomCloseValue(parsedUri) {
        var hasCustomClose = parsedUri.customClose && parsedUri.customClose.toString() === 'true';
        return hasCustomClose;
    }

    function parsePositionValue(parsedUri) {
        var dialogPosition = 'center';

        if(parsedUri.x || parsedUri.y) {
            dialogPosition = [parsedUri.x, parsedUri.y];
        }
        return dialogPosition;
    }

    /**
     * @param data {object}
     * @returns {{width: number, height: number}}
     */
    function calculateWidgetSize(container, data) {
        var width = DEFAULT_DIALOG_WIDTH;
        var height = DEFAULT_DIALOG_HEIGHT;

        var plist = data.plist;
        var parsedUri = data.parsedUri || {};

        if(plist) {
            if(plist.Height) {
                height = parseInt(plist.Height, 10);
            }

            if(plist.Width) {
                width = parseInt(plist.Width, 10);
            }
        }

        if(parsedUri.height) {
            height = parseInt(parsedUri.height, 10);
        } else if(parsedUri.h) {
            height = parseInt(parsedUri.h, 10);
        }

        if(parsedUri.width) {
            width = parseInt(parsedUri.width, 10);
        } else if(parsedUri.w) {
            width = parseInt(parsedUri.w, 10);
        }

        //        if(width === DEFAULT_DIALOG_WIDTH && height === DEFAULT_DIALOG_HEIGHT)
        //        {
        //            parsedUri.size = '100%';
        //        }

        if(parsedUri.size) {
            var ratio = width / height;
            var size = parseInt(parsedUri.size, 10) / 100;

            var heightOfToolbar = HEIGHT_OF_TITLEBAR;
            if(parsedUri.chromeless === 'true' || parsedUri.transparent === 'true') {
                heightOfToolbar = 0;
            }
            height = ($(container).height() - heightOfToolbar) * size;
            width = height * ratio;

            if(width > $(container).width()) {
                width = $(container).width() * size;
                height = width / ratio;
            }
        }

        return {
            width: width,
            height: height
        };
    }

    return {
        fixCoordinateValue: fixCoordinateValue,
        attachBehavioursToAllowSmoothResizeWithIFrameToDialog: attachBehavioursToAllowSmoothResizeWithIFrameToDialog,
        parseResizeValue: parseResizeValue,
        parseModalValue: parseModalValue,
        parseChromelessValue: parseChromelessValue,
        parsePositionValue: parsePositionValue,
        calculateWidgetSize: calculateWidgetSize,
        parseCustomCloseValue: parseCustomCloseValue
    };
})(ActiveText);