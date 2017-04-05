/* global ActiveText, BugClubAus, BugClub */
ActiveText.namespace('BugClubAus.SummaryScreen');
BugClubAus.SummaryScreen = function(skinCode) {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {BugClubAus.ActivitySummaryIndividual}
     */
    var summaryData;

    /**
     * @type {Array}
     */
    var summaryHTMLCache;

    /**
     * @type {jQuery}
     */
    var newDialog;

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;

        ActiveText.CSSUtils.embedCSS(BugClub.DialogStyleText.getStyle(activeTextInstance), 'bugclubaus-dialog-styles');
        ActiveText.CSSUtils.embedCSS(BugClubAus.SummaryScreen.DialogStyleText.getStyle(activeTextInstance), 'bugclubaus-summary-screen-styles');

        summaryHTMLCache = [];
        summaryHTMLCache[0] = '';

        BugClubAus.SummaryScreenIconFactory.preloadIconImages(activeTextInstance, skinCode);

        summaryData = new BugClub.ActivitySummaryIndividual();
        summaryData.init(instance);
        $(summaryData).on('change', updateHotspotIcon);

        $(activeTextInstance).on(ActiveText.Events.RESOURCES_LOADED, preloadActivityData);
    }

    /**
     * @param event {Event}
     */
    function updateHotspotIcon(event, data) {
        summaryHTMLCache[data.activityId] = BugClubAus.SummaryScreenIconFactory.getIconHTMLForStatus(activeTextInstance, data.status, skinCode);
        updateHotspotIconsOnDialog();
    }

    function preloadActivityData() {
        var overlayDataLoader = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'overlaydataloader');
        if(overlayDataLoader) {
            for(var i = 0, l = activeTextInstance.data.getFlatListOfNavigation().length; i < l; i++) {
                //overlayDataLoader.loadDataForIndex(i);
                overlayDataLoader.loadDataForPageIndex(i);
            }
        }
    }

    function openSummary() {
        if(newDialog) {
            newDialog.open();
        } else {
            closeSummary();
            var container = activeTextInstance.options.containerElement;
            var scormIntegrationFunction = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'pipwerks');
            var closeFunction;
            if(scormIntegrationFunction) {
                closeFunction = scormIntegrationFunction.closeEBook;
            }

            newDialog = BugClubAus.SummaryScreenDialogFactory.createDialog(activeTextInstance, container, skinCode, closeFunction);
            newDialog.on({
                dialogcreate: updateHotspotIconsOnDialog,
                dialogclose: removeRefsToDialog
            });
            preloadActivityData();
        }
    }

    function removeRefsToDialog() {
        newDialog = null;
    }

    /**
     * @returns {boolean}
     */
    function updateHotspotIconsOnDialog() {
        var rtn = false;
        if(newDialog) {
            var existingHTML = $(summaryHTMLCache.join(''));
            var iconsContainer = newDialog.find('.summary-icons');
            iconsContainer.html(existingHTML);

            var allIcons = iconsContainer.find('.icon');
            var containerWidth = iconsContainer.width();
            var width = allIcons.width();
            var numIcons = allIcons.length;

            allIcons.css({
                margin: '15px ' + (Math.floor((containerWidth - (numIcons * width)) / numIcons) / 2) + 'px'
            });
            rtn = true;
        }
        return rtn;
    }

    /**
     * @returns {boolean}
     */
    function closeSummary() {
        var rtn = false;
        if(newDialog) {
            newDialog.dialog('close');
            rtn = true;
        }
        return rtn;
    }

    return {
        init: init,
        openSummary: openSummary,
        closeSummary: closeSummary,
        key: 'summaryscreen'
    };
};
