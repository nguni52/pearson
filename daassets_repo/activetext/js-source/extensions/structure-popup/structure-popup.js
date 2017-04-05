/* global ActiveText, requestAnimationFrame, ScrollFix */
ActiveText.namespace('ActiveText.UI.StructurePopup');
ActiveText.UI.StructurePopup = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    var popupContents;

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
    var ROW_HEIGHT = 32;

    function init(instance, element, scopePrefix, width) {
        activeTextInstance = instance;
        buttonElement = element;
        factory = ActiveText.UI.StructurePopupFactory;
        helper = new ActiveText.UI.StructurePopupDisplayHelper();
        helper.init(activeTextInstance, buttonElement, createPopupCallback);

        embedCSSStyleTag(scopePrefix, width);
        attachEventHandlers();
    }

    /**
     * Embeds the CSS necessary to render the structure popup.
     *
     * @param scopePrefix {string}
     * @param popupWidth {number}
     */
    function embedCSSStyleTag(scopePrefix, popupWidth) {
        var scope;
        if(typeof(scopePrefix) === 'string') {
            scope = scopePrefix + ' ';
        } else {
            scope = activeTextInstance.options.containerElement.selector + ' ';
        }

        var cssString = ActiveText.UI.StructurePopup.Style.getStyle(scope, activeTextInstance.theme, popupWidth);
        ActiveText.CSSUtils.embedCSS(cssString, scope + 'structure-popup');
    }

    /**
     * @param obj {object|array}
     * @return {string}
     */
    function convertNavigationStructureToHTMLList(obj) {
        var output = '';
        if(obj && $.isArray(obj) && obj.length > 0) {
            output += '<ul role="navigationlist">';
            for(var i = 0, len = obj.length; i < len; i++) {
                output += convertNavigationStructureToHTMLList(obj[i]);
            }
            output += '</ul>';
        } else {
            if(obj && obj.number !== undefined && obj.title !== undefined) {
                output += '<li>' +
                    '<a href="#" data-page="' + ( obj.number - 0 ) + '" role="navigation">' +
                    obj.title +
                    '</a>' +
                    '</li>';
            } else {
                output += '';
            }
        }

        return output;
    }

    function generateInitialContentForPopover(data) {
        var content = convertNavigationStructureToHTMLList(data);
        var jQueryRtn = $('<div></div>').html(content);
        jQueryRtn.find('li:first').addClass('first');
        jQueryRtn.find('li:last').addClass('last');
        return '<div class="structured-navigation-popup">' +
            '<div id="activetext-contents" class="list-container scrollable">' +
            jQueryRtn.html() +
            '</div>' +
            '</div>';
    }

    function createPopupCallback() {
        buttonElement.addClass('open');
        if(buttonElement.toggle_button) {
            buttonElement.toggle_button(true);
        }

        var data = activeTextInstance.data.getNavigationStructure();
        var containerElement = buttonElement.parent();
        var popup = factory.createPopup(containerElement, generateInitialContentForPopover(data));
        popup.css({
            visibility: 'hidden'
        });

        setTimeout(function() {
            popup.css({
                visibility: 'visible'
            });

            // timeouts are nasty, but jQuery can't re-select things until one cycle post creation of the popup.
            popupContents = containerElement.find('.at-popover-content');
            popupContents.attr('tabindex', buttonElement.attr('tabindex'));
            popupContents.on({
                click: linkClickHandler
            });
            helper.highlightLinksForIndex(ROW_HEIGHT, activeTextInstance.model.getCurrentIndex(), 0);

            var scrollfix = new ScrollFix(popupContents.find('.scrollable').get(0));

            activeTextInstance.options.containerElement.on('remove', teardown);
            $(window).on({keydown: onKeyDown});

            function teardown() {
                activeTextInstance.options.containerElement.off('remove', teardown);
                $(window).off({keydown: onKeyDown});
            }
        }, 0);
    }

    function onKeyDown(e) {
        var code = e.which;
        if(code === ActiveText.Keymap.UP) {
            $('.at-popover-content a:focus').parent().prev().find('a').focus();
            scrollToPos();
            return false;
        } else if(code === ActiveText.Keymap.DOWN) {
            $('.at-popover-content a:focus').parent().next().find('a').focus();
            scrollToPos();
            return false;
        } else if(code === ActiveText.Keymap.ESCAPE) {
            helper.hidePopup();
        } else if(code === ActiveText.Keymap.TAB) {
            scrollToPos();
        }
    }

    function scrollToPos() {
        var index = popupContents.find('a').index($('a:focus'));
        var listContainer = popupContents.find('.list-container');
        var convertedPos = (index * ROW_HEIGHT) - (listContainer.height() / 2) + ROW_HEIGHT;

        requestAnimationFrame(function() {
            listContainer.animate({
                scrollTop: convertedPos
            }, {
                duration: 300,
                queue: false
            });
        });
    }

    /**
     * @param event {object}
     * @return {Boolean}
     */
    function linkClickHandler(event) {
        var targetPageNumber = $(event.target).attr('data-page');
        activeTextInstance.navigation.gotoPage(targetPageNumber);
        $(event.target).blur();
        return false;
    }

    function attachEventHandlers() {
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, updateCurrentPageMarkerOnPageChange);
    }

    function updateCurrentPageMarkerOnPageChange(event, data) {
        helper.removeHighlightFromAllLinks();
        helper.highlightLinksForIndex(ROW_HEIGHT, data.toPage);
    }

    return {
        init: init,
        createPopup: attachEventHandlers
    };
};