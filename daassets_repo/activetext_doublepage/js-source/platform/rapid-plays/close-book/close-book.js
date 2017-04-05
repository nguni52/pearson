/* global ActiveText, Modernizr */
var RapidPlays = RapidPlays || {};
RapidPlays.CloseBook = function() {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var DIALOG_HEIGHT = 194;

    /**
     * @const
     * @type {number}
     */
    var DIALOG_WIDTH = 416;

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {jQuery}
     */
    var container;

    /**
     * @type {jQuery}
     */
    var newDialog;

    /**
     * @type {string}
     */
    var pathPrefix;

    /**
     * @type {function}
     */
    var closeFunction;

    function createDialog() {
        function closeHandler() {
            /* jshint validthis:true */
            $(this).dialog('destroy');
            newDialog = null;
        }

        function createHandler(event, ui) {
            setTimeout(centerOnScreen, 0);
            $(newDialog).focus();
            $(activeTextInstance).on(ActiveText.Events.RESIZE, centerOnScreen);
        }

        var extension = 'png';
        if(Modernizr.svg) {
            extension = 'svg';
        }

        var keepReadingSettings = {
            title: 'Keep reading',
            className: 'button-keep-reading',
            tooltips: false,
            style: {
                width: 198,
                height: 42
            },
            width: 198,
            height: 42,
            imageSrc: pathPrefix + 'keepReadingUp.' + extension,
            hoverImageSrc: pathPrefix + 'keepReadingOver.' + extension,
            downImageSrc: pathPrefix + 'keepReadingUp.' + extension
        };

        var closeBookSettings = {
            title: 'Close book',
            className: 'button-close',
            tooltips: false,
            style: {
                width: 198,
                height: 42
            },
            width: 198,
            height: 42,
            imageSrc: pathPrefix + 'closeBookUp.' + extension,
            hoverImageSrc: pathPrefix + 'closeBookOver.' + extension,
            downImageSrc: pathPrefix + 'closeBookUp.' + extension
        };

        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;
        var keepReadingButton = factory.createSimpleButton(keepReadingSettings).click(closeDialog);
        keepReadingButton.attr('tabindex', 100);
        var closeBookButton = factory.createSimpleButton(closeBookSettings).click(closeBook);
        closeBookButton.attr('tabindex', 100);

        var template = $('<div class="content"><div class="buttons"></div></div>');
        template.find('.buttons').append(keepReadingButton, closeBookButton);

        newDialog = template.dialog({
            width: DIALOG_WIDTH,
            height: DIALOG_HEIGHT,
            modal: true,
            appendTo: container,
            dialogClass: 'close-book',
            resizable: false,
            close: closeHandler,
            create: createHandler
        });

        centerOnScreen();
    }

    function toggleFlashZIndex(toggle){
        toggle = toggle ? -1 : 999;
        $('.recordingWidget').css('z-index', toggle);
    }

    function centerOnScreen() {
        $(newDialog).parent().css({
            top: (container.height() - DIALOG_HEIGHT) / 2,
            left: (container.width() - DIALOG_WIDTH) / 2
        });
    }

    function closeDialog() {
        $(activeTextInstance).off(ActiveText.Events.RESIZE, centerOnScreen);
        toggleFlashZIndex(false);
        $(newDialog).dialog('close');
    }

    function closeBook() {
        closeDialog();
        if(closeFunction && typeof closeFunction === 'function') {
            closeFunction();
        }
    }

    function insertCSS() {
        ActiveText.CSSUtils.embedCSS(RapidPlays.CloseBook.DialogStyleText.getStyle(activeTextInstance), 'rapid-close-screen');
    }

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        if(instance && instance.options && instance.options.containerElement) {
            activeTextInstance = instance;
            container = activeTextInstance.options.containerElement;
            pathPrefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance) + 'img/rapid/';

            insertCSS();
        }
    }

    function open() {
        if(newDialog) {
            $(newDialog).dialog('open');
        } else {
            var scormIntegrationFunction = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'pipwerks');
            if(scormIntegrationFunction) {
                closeFunction = scormIntegrationFunction.closeEBook;
            }

            createDialog();
        }
        toggleFlashZIndex(true);
    }

    return {
        init: init,
        open: open,
        key: 'closebook'
    };
};
