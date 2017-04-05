/* global ActiveText, BugClub */
ActiveText.namespace('BugClub.SummaryScreen');
BugClub.SummaryScreen = function(skinCode) {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {BugClub.ActivitySummaryIndividual}
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

        ActiveText.CSSUtils.embedCSS(BugClub.DialogStyleText.getStyle(activeTextInstance), 'bugclub-dialog-styles');
        ActiveText.CSSUtils.embedCSS(BugClub.SummaryScreen.DialogStyleText.getStyle(activeTextInstance), 'bugclub-summary-screen-styles');

        summaryHTMLCache = [];

        BugClub.SummaryScreenIconFactory.preloadIconImages(activeTextInstance, skinCode);

        summaryData = new BugClub.ActivitySummaryIndividual();
        summaryData.init(instance);
        $(summaryData).on('change', updateHotspotIcon);

        $(activeTextInstance).on(ActiveText.Events.RESOURCES_LOADED, preloadActivityData);
    }

    /**
     * @param event {Event}
     */
    function updateHotspotIcon(event, data) {
        if(data && data.activityId) {
            summaryHTMLCache[data.activityId] = BugClub.SummaryScreenIconFactory.getIconHTMLForStatus(activeTextInstance, data.status);
        }
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
        // todo: This would be better with some $(event.target) magic in future.
        $('.exit').blur();
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

            newDialog = BugClub.SummaryScreenDialogFactory.createDialog(activeTextInstance, container, skinCode, closeFunction);
            newDialog.on({
                dialogcreate: updateHotspotIconsOnDialog,
                dialogclose: removeRefsToDialog
            });
            preloadActivityData();
        }
        return false;
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
            var existingHTML = '';
            for(var icon in summaryHTMLCache) {
                existingHTML += summaryHTMLCache[icon];
            }
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
