/* global ActiveText */
/**
 * @class TextHighlightPageInjection
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @param settings {ActiveText.TextHighlightSettings}
 * @constructor
 */
ActiveText.TextHighlightPageInjection = function(activeTextInstance, settings) {
    'use strict';

    function init() {
        $(activeTextInstance).on(ActiveText.Events.FRAME_CONTENT_LOADED, injectHighlightStylesToPage);
    }

    /**
     * @param index {number}
     * @param highlightColour {string}
     */
    function injectTextHighlightStyles(index, highlightColour) {
        var selectionClassName = ActiveText.TextHighlightHelper.getSelectionClassName();
        var htmlString = '<style type="text/css">.' + selectionClassName + ',.' + selectionClassName +
            ' *{background-color:' + highlightColour + ';display:inline-block;}</style>';

        function onLoaded() {
            $('#iframe' + index).contents().find('head').append(htmlString);
        }

        function waitForLoad() {
            if($('#iframe' + index).contents().find('body').children().length) {
                onLoaded();
            } else {
                setTimeout(function() {
                    waitForLoad();
                }, 100);
            }
        }

        waitForLoad();
    }

    /**
     * @param event {object}
     * @param data {{index:number}}
     */
    function injectHighlightStylesToPage(event, data) {
        var index = data.index;
        var defaultHighlightColor = settings.getDefaultHighlightColor();
        injectTextHighlightStyles(index, defaultHighlightColor);
    }

    init();
};