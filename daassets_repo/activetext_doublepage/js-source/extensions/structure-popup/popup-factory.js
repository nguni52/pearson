/* global ActiveText */
ActiveText.namespace("ActiveText.UI.StructurePopupFactory");
ActiveText.UI.StructurePopupFactory = (function() {
    "use strict";

    /**
     * @param containerElement
     * @param content {string}
     * @returns {object}
     */
    function createPopupOnElementWithContent(containerElement, content) {
        return containerElement.atPopover({
            placement: 'in top',
            trigger: 'manual',
            html: true,
            content: content,
            template: getPopoverTemplate()
        });
    }

    /**
     * @returns {string}
     */
    function getPopoverTemplate() {
        return $('<div>' +
            '<div class="at-popover">' +
            '<div class="arrow"></div>' +
            '<div class="at-popover-inner">' +
            '<div class="at-popover-content">' +
            '<div></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>').html();
    }

    return {
        createPopup: createPopupOnElementWithContent
    };
})();
