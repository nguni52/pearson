/* global ActiveText, requestAnimationFrame */
ActiveText.UI = ActiveText.UI || {};
/**
 * @class StructurePopupDisplayHelper
 * @memberOf ActiveText.UI
 * @returns {{init: init, highlightLinksForIndex: highlightLinksForIndex, removeHighlightFromAllLinks: removeHighlightFromAllLinks, showPopup: showPopup, hidePopup: hidePopup}}
 * @constructor
 */
ActiveText.UI.StructurePopupDisplayHelper = function() {
    'use strict';

    /**
     * @type {string}
     */
    var ACTIVE_CLASS = 'active';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {Boolean}
     */
    var popoverCreated = false;

    /**
     * @type {function}
     */
    var createPopupCallback;

    var buttonElement;

    function init(instance, element, callback) {
        activeTextInstance = instance;
        buttonElement = element;
        createPopupCallback = callback;

        attachButtonEventHandlers();
    }

    function buttonClickHandler() {
        createOrShowPopup();
        return false;
    }

    function attachButtonEventHandlers() {
        buttonElement.click(buttonClickHandler);
    }

    function createOrShowPopup() {
        var containerElement = buttonElement.parent();
        if(containerElement) {
            if($.fn.atPopover) {
                if(popoverCreated) {
                    togglePopupVisibility();
                } else {
                    createPopup();
                }
            }
        }
    }

    function togglePopupVisibility() {
        var containerElement = buttonElement.parent();
        var isOpen = containerElement.find('.at-popover').length > 0;
        if(isOpen) {
            hidePopup();
        } else {
            showPopup();
        }
    }

    function hidePopup() {
        var containerElement = buttonElement.parent();
        setTimeout(detachOutsideClickListener, 0);
        containerElement.atPopover('hide');
        buttonElement.removeClass('open');
        if(buttonElement.toggle_button) {
            buttonElement.toggle_button(false);
        }
        popoverCreated = false;
    }

    function showPopup() {
        var containerElement = buttonElement.parent();
        setTimeout(attachOutsideClickListener, 0);
        containerElement.atPopover('show');

        if(buttonElement.toggle_button) {
            buttonElement.toggle_button(true);
        }

        buttonElement.attr('aria-activedescendant', 'activetext-contents');
    }

    function attachOutsideClickListener() {
        $(document).on('click', outsideClickListener);
    }

    function detachOutsideClickListener() {
        $(document).off('click', outsideClickListener);
    }

    function outsideClickListener(event) {
        var containerElement = buttonElement.parent();

        if(didNotClickInsideAnActivePopover(event)) {
            containerElement.atPopover('hide');
            buttonElement.removeClass('open');
            if(buttonElement.toggle_button) {
                buttonElement.toggle_button(false);
            }
            popoverCreated = false;
            detachOutsideClickListener();
        }
    }

    /**
     * @param event {object}
     * @return {Boolean}
     */
    function didNotClickInsideAnActivePopover(event) {
        var containerElement = buttonElement.parent();
        var eventTarget = $(event.target);
        return !(eventTarget.parents(containerElement).length === 0 &&
            eventTarget.parents('.at-popover').length === 0);
    }

    function createPopup() {
        createPopupCallback();
        popoverCreated = true;
        togglePopupVisibility();
    }

    function highlightChapterFor(pageNumber) {
        for(var i = pageNumber; i >= 0; i--) {
            if(getContentsElementByPageNumber(i).length > 0) {
                getContentsElementByPageNumber(i).addClass(ACTIVE_CLASS);
                break;
            }
        }
    }

    function getContentsElementByPageNumber(pageNumber) {
        var popupContents = buttonElement.parent().find('.at-popover-content');
        return popupContents.find('a[data-page="' + pageNumber + '"]');
    }

    /**
     * @param rowHeight {number}
     * @param pageIndex {number}
     * @param scrollSpeed {number}
     */
    function highlightLinksForIndex(rowHeight, pageIndex, scrollSpeed) {
        var popupContents = buttonElement.parent().find('.at-popover-content');

        /* istanbul ignore else */
        if(popupContents) {
            var pageNumber = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, pageIndex);
            var hasLinkForLeftPage = getContentsElementByPageNumber(pageNumber).length > 0;

            if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
                /* istanbul ignore else */
                if(getContentsElementByPageNumber(pageNumber).length === 0) {
                    highlightChapterFor(pageNumber);
                }
            } else {
                if(!hasLinkForLeftPage) {
                    var siblingPageNumber = ActiveText.NavigationUtils.getSiblingPageNumberForPage(activeTextInstance, pageNumber);
                    var hasLinkForRightPage = getContentsElementByPageNumber(siblingPageNumber).length > 0;
                    if(hasLinkForRightPage) {
                        getContentsElementByPageNumber(siblingPageNumber).addClass(ACTIVE_CLASS).focus();
                    } else {
                        highlightChapterFor(pageNumber);
                    }
                }
            }

            if(hasLinkForLeftPage) {
                getContentsElementByPageNumber(pageNumber).addClass(ACTIVE_CLASS).focus();
            }

            var index = popupContents.find('a').index($('.' + ACTIVE_CLASS));
            var listContainer = popupContents.find('.list-container');
            var convertedPos = (index * rowHeight) - (listContainer.height() / 2) + rowHeight;

            if(scrollSpeed === undefined) {
                scrollSpeed = 300;
            }

            requestAnimationFrame(function() {
                listContainer.animate({
                    scrollTop: convertedPos
                }, {
                    duration: scrollSpeed,
                    queue: false
                });
            });
        }
    }

    function removeHighlightFromAllLinks() {
        var popupContents = buttonElement.parent().find('.at-popover-content');

        /* istanbul ignore else */
        if(popupContents) {
            popupContents.find('a.' + ACTIVE_CLASS).removeClass(ACTIVE_CLASS);
        }
    }

    return {
        init: init,
        highlightLinksForIndex: highlightLinksForIndex,
        removeHighlightFromAllLinks: removeHighlightFromAllLinks,
        showPopup: showPopup,
        hidePopup: hidePopup
    };
};