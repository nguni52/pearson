/* global ActiveText, BugClub, requestAnimationFrame, ScrollFix */
ActiveText.namespace('BugClub.StructurePopup');
BugClub.StructurePopup = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    var popupContents;

    var containerElement;

    var buttonElement;

    /**
     * @type {ActiveText.UI.StructurePopupFactory}
     */
    var factory;

    /**
     * @type {ActiveText.UI.StructurePopupDisplayHelper}
     */
    var helper;

    /**
     * @const
     * @type {number}
     */
    var ROW_HEIGHT = 41;

    /**
     * @const
     * @type {string}
     */
    var CHANGE = 'change';

    /**
     * @param instance {ActiveText}
     * @param element
     * @param scopePrefix
     * @param width {Number}
     */
    function init(instance, element, scopePrefix, width) {
        activeTextInstance = instance;
        buttonElement = element;
        factory = ActiveText.UI.StructurePopupFactory;

        var summaryData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubactivitysummary');
        if(summaryData) {
            $(summaryData).on(CHANGE, updateActivityStatusFromEvent);
        }

        helper = new ActiveText.UI.StructurePopupDisplayHelper();
        helper.init(activeTextInstance, buttonElement, createPopupCallback);

        embedCSSStyleTag(scopePrefix, width);
        attachButtonEventHandlers();
    }

    /**
     * @param links {jQuery}
     * @param item {{activityIds:Array, pageIndex:Number, status:String}}
     */
    function updateIndividualActivity(item) {
        var links = popupContents.find('li');
        var activityStatus = item.status;
        var pageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, item.pageIndex);
        var linksForPage = links.find('> a[data-page=' + pageNumber + ']');

        if(linksForPage.length > 0) {
            var statusIcon = linksForPage.find('.status-icon').get(0);
            if(statusIcon) {
                statusIcon.className = 'status-icon';
                $(statusIcon).addClass(activityStatus);
            }
        }
    }

    /**
     * @param data
     */
    function updateActivityStatus(data) {
        if(!popupContents) {
            return;
        }

        if(data && $.isArray(data)) {
            for(var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                item.pageIndex = i;
                updateIndividualActivity(item);
            }
        } else {
            updateIndividualActivity(data);
        }
    }

    /**
     * @param event {object}
     * @param data {array}
     */
    function updateActivityStatusFromEvent(event, data) {
        updateActivityStatus(data);
    }

    /**
     * @returns {jQuery}
     */
    function getContainerElement() {
        if(!containerElement || containerElement.length === 0) {
            containerElement = buttonElement.parent();
        }
        return containerElement;
    }

    /**
     * @param scopePrefix
     * @param width
     */
    function embedCSSStyleTag(scopePrefix, width) {
        var scope;
        if(typeof(scopePrefix) === 'string') {
            scope = scopePrefix + ' ';
        } else {
            scope = activeTextInstance.options.containerElement.selector + ' ';
        }
        var cssString = BugClub.StructurePopup.Style.getStyle(activeTextInstance, scope, activeTextInstance.theme, width);
        ActiveText.CSSUtils.embedCSS(cssString, scope + 'structure-popup');
    }

    function hidePopup() {
        helper.hidePopup();
    }

    function showPopup() {
        helper.showPopup();
    }

    /**
     * @param obj {object|array}
     * @return {string}
     */
    function convertNavigationStructureToHTMLList(obj) {
        var output = '';
        if(obj && $.isArray(obj) && obj.length > 0) {
            output += '<ul>';
            for(var i = 0, len = obj.length; i < len; i++) {
                output += convertNavigationStructureToHTMLList(obj[i]);
            }
            output += '</ul>';
        } else {
            if(obj && obj.number !== undefined && obj.title !== undefined) {
                output += '<li><a href="#" data-page="' + obj.number + '">' +
                    '<div class="status-icon"></div>' +
                    '<span>' + obj.title + '</span>' +
                    '</a></li>';
            } else {
                output += '';
            }
        }
        return output;
    }

    /**
     * @param navigationStructure
     * @returns {string}
     */
    function generateInitialContentForPopover(navigationStructure) {
        var content = convertNavigationStructureToHTMLList(navigationStructure);
        return '<div class="structured-navigation-popup"><div class="list-container scrollable">' + content +
            '</div></div>';
    }

    function createPopupCallback() {
        buttonElement.addClass('open');
        if(buttonElement.toggle_button) {
            buttonElement.toggle_button(true);
        }

        var summaryData = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubactivitysummary');
        if(summaryData) {
            var statusObject = summaryData.getData();
        }
        var navigationStructure = activeTextInstance.data.getNavigationStructure();
        var popoverContainerElement = getContainerElement();
        var initialContentForPopover = generateInitialContentForPopover(navigationStructure);
        var currentPageNumber = activeTextInstance.model.getCurrentPageNumber();
        factory.createPopup(popoverContainerElement, initialContentForPopover);

        setTimeout(function() {
            popupContents = getContainerElement().find('.at-popover-content');
            popupContents.find('a').click(linkClickHandler);
            helper.highlightLinksForIndex(ROW_HEIGHT, currentPageNumber, 0);
            if(summaryData) {
                updateActivityStatus(statusObject);
            }

            var scrollfix = new ScrollFix(popupContents.find('.scrollable').get(0));
        }, 0);
    }

    /**
     * @param event {object}
     * @return {Boolean}
     */
    function linkClickHandler(event) {
        var targetPageNumber = $(event.currentTarget).attr('data-page');
        activeTextInstance.navigation.gotoPage(targetPageNumber);
        return false;
    }

    function attachButtonEventHandlers() {
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, updateCurrentPageHighlightOnEvent);
    }

    /**
     * @param event
     * @param data
     */
    function updateCurrentPageHighlightOnEvent(event, data) {
        helper.removeHighlightFromAllLinks();
        helper.highlightLinksForIndex(ROW_HEIGHT, data.toPage);
    }

    return {
        init: init,
        createPopup: createPopupCallback,
        showPopup: showPopup,
        hidePopup: hidePopup
    };
};
