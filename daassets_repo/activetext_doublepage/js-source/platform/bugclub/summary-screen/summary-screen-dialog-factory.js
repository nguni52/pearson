/* global ActiveText, BugClub, Modernizr */
ActiveText.namespace('BugClub.SummaryScreenDialogFactory');
BugClub.SummaryScreenDialogFactory = (function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var DIALOG_HEIGHT = 280;

    /**
     * @const
     * @type {number}
     */
    var DIALOG_WIDTH = 540;

    function openSummary(activeTextInstance, container, skinCode, closeFunction) {
        function centerOnScreen() {
            $(newDialog).parent().css({
                top: (container.height() - dialogHeight) / 2,
                left: (container.width() - dialogWidth) / 2
            });
        }

        function closeHandler() {
            /* jshint validthis:true */
            $(this).dialog('destroy');
        }

        function createHandler(event, ui) {
            setTimeout(centerOnScreen, 0);
            $(newDialog).focus();
            $(activeTextInstance).on(ActiveText.Events.RESIZE, centerOnScreen);
        }

        function closeDialog() {
            $(activeTextInstance).off(ActiveText.Events.RESIZE, centerOnScreen);
            $(newDialog).dialog('close');
            return false;
        }

        function closeBook() {
            $(newDialog).dialog('close');
            if(closeFunction && typeof closeFunction === 'function') {
                closeFunction();
            }
            return false;
        }

        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;
        var prefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        var keepReadingSettings = {
            title: 'Keep reading',
            tooltips: false
        };
        var closeBookSettings = {
            title: 'Close book',
            tooltips: false
        };

        var dialogWidth = DIALOG_WIDTH;
        var dialogHeight = DIALOG_HEIGHT;

        var pathPrefix = prefix + 'img/bugclub/';

        var extension = 'png';
        if(Modernizr.svg) {
            extension = 'svg';
        }

        keepReadingSettings.style = {
            width: 204,
            height: 50
        };
        keepReadingSettings.imageSrc = pathPrefix + 'keepreading.' + extension;
        keepReadingSettings.hoverImageSrc = pathPrefix + 'keepreading-over.' + extension;
        keepReadingSettings.downImageSrc = pathPrefix + 'keepreading-over.' + extension;

        closeBookSettings.style = {
            width: 204,
            height: 50
        };
        closeBookSettings.imageSrc = pathPrefix + 'closebook.' + extension;
        closeBookSettings.hoverImageSrc = pathPrefix + 'closebook-over.' + extension;
        closeBookSettings.downImageSrc = pathPrefix + 'closebook-over.' + extension;

        var keepReadingButton = factory.createSimpleButton(keepReadingSettings).click(closeDialog);
        keepReadingButton.attr('tabindex', 100);
        var closeBookButton = factory.createSimpleButton(closeBookSettings).click(closeBook);
        closeBookButton.attr('tabindex', 100);

        var template = $('<div class="content">' +
            '<div class="summary-icons"></div>' +
            '<div class="buttons"></div>' +
            '</div>');

        template.find('.buttons').append(keepReadingButton, closeBookButton);

        var newDialog = template.dialog({
            width: dialogWidth,
            height: dialogHeight,
            modal: true,
            appendTo: container,
            dialogClass: 'summary-screenSVG ' + skinCode,
            resizable: false,
            close: closeHandler,
            create: createHandler
        });

        centerOnScreen();

        return newDialog;
    }

    return {
        createDialog: openSummary
    };
})(ActiveText);
