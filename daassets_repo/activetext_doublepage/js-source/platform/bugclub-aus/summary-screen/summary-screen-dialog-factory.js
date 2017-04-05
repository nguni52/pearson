/* global ActiveText, BugClubAus */
ActiveText.namespace("BugClubAus.SummaryScreenDialogFactory");
BugClubAus.SummaryScreenDialogFactory = (function(ActiveText) {
    "use strict";

    /**
     * @const
     * @type {number}
     */
    var DIALOG_HEIGHT = 430;

    /**
     * @const
     * @type {number}
     */
    var DIALOG_WIDTH = 730;

    function openSummary(activeTextInstance, container, skinCode, closeFunction) {
        function centerOnScreen() {
            $(newDialog).parent().css({
                top: (container.height() - dialogHeight) / 2,
                left: (container.width() - dialogWidth) / 2
            });
        }

        function closeHandler() {
            /* jshint validthis:true */
            $(this).dialog("destroy");
        }

        function createHandler(event, ui) {
            setTimeout(centerOnScreen, 0);
            $(activeTextInstance).on(ActiveText.Events.RESIZE, centerOnScreen);
        }

        function closeDialog() {
            $(activeTextInstance).off(ActiveText.Events.RESIZE, centerOnScreen);
            $(newDialog).dialog("close");
            $('body').find('.button.exit').blur();
        }

        function closeBook() {
            $(newDialog).dialog("close");
            if(closeFunction && typeof closeFunction === "function") {
                closeFunction();
            }
        }

        function beforeCloseHandler() {
            $(activeTextInstance).tooltip('hide');
            $('.tooltip[role=tooltip]').remove();
        }

        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;
        var prefix = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        var pathPrefix = "";

        var keepReadingSettings = {
            title: "Keep reading"
        };
        var closeBookSettings = {
            title: "Close book"
        };

        var characterIcon;

        var dialogWidth = DIALOG_WIDTH;
        var dialogHeight = DIALOG_HEIGHT;

        if(skinCode === "ks1") {
            pathPrefix = prefix + "img/bugclub/legacy/ks1/pupil/";

            characterIcon = "<img src='" + prefix +
                "img/bugclub/legacy/ks1/pupil/CloseBookDialog_image.png' width='106' height='118' />";

            keepReadingSettings.style = {
                width: 260,
                height: 81
            };
            keepReadingSettings.imageSrc = pathPrefix + "Button_keepReading_upSkin.png";
            keepReadingSettings.hoverImageSrc = pathPrefix + "Button_keepReading_overSkin.png";
            keepReadingSettings.downImageSrc = pathPrefix + "Button_keepReading_downSkin.png";

            closeBookSettings.style = {
                width: 260,
                height: 82
            };
            closeBookSettings.imageSrc = pathPrefix + "Button_closeBook_upSkin.png";
            closeBookSettings.hoverImageSrc = pathPrefix + "Button_closeBook_overSkin.png";
            closeBookSettings.downImageSrc = pathPrefix + "Button_closeBook_downSkin.png";
        } else {
            pathPrefix = prefix + "img/bugclub/legacy/ks2/";

            characterIcon = "<img src='" + prefix +
                "img/bugclub/legacy/ks2/bee.png' width='133' height='175' />";

            closeBookSettings.style = {
                width: 198,
                height: 49
            };
            closeBookSettings.imageSrc = pathPrefix + "KS2_Close_book_3.png";
            closeBookSettings.hoverImageSrc = pathPrefix + "KS2_Close_book_1.png";
            closeBookSettings.downImageSrc = pathPrefix + "KS2_Close_Book_2.png";

            keepReadingSettings.style = {
                width: 198,
                height: 49
            };
            keepReadingSettings.imageSrc = pathPrefix + "KS2_Keep_Reading_3.png";
            keepReadingSettings.hoverImageSrc = pathPrefix + "KS2_Keep_Reading_1.png";
            keepReadingSettings.downImageSrc = pathPrefix + "KS2_Keep_Reading_2.png";
        }

        var keepReadingButton = factory.createSimpleButton(keepReadingSettings).click(closeDialog);
        var closeBookButton = factory.createSimpleButton(closeBookSettings).click(closeBook);

        var template = $("<div class='content'>" +
            "<div class='summary-icons'></div>" +
            "<div class='bug'>" +
            characterIcon +
            "</div>" +
            "<div class='buttons'></div>" +
            "</div>");

        template.find(".buttons").append(keepReadingButton, closeBookButton);

        var newDialog = template.dialog({
            width: dialogWidth,
            height: dialogHeight,
            modal: true,
            appendTo: container,
            dialogClass: "summary-screen " + skinCode,
            resizable: false,
            close: closeHandler,
            create: createHandler,
            beforeClose: beforeCloseHandler
        });

        centerOnScreen();

        return newDialog;
    }

    return {
        createDialog: openSummary
    };
})(ActiveText);
