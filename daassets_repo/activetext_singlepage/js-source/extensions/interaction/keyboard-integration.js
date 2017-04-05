/* global ActiveText */
/**
 * @class KeyboardIntegration
 * @memberOf ActiveText
 * @param options {*} A Dictionary of Keycode values and functions to execute when they are pressed. Defaults to left
 * & right keypress triggering previous/next page turns.
 * @returns {{init: init, key: string}}
 * @constructor
 */
ActiveText.KeyboardIntegration = function(options) {
    'use strict';

    /**
     * @type {object}
     */
    var keyConfiguration;

    function init(activeTextInstance) {
        if(!activeTextInstance) {
            return;
        }

        keyConfiguration = options;

        if(!keyConfiguration) {
            keyConfiguration = {};
            keyConfiguration[ActiveText.Keymap.LEFT] = activeTextInstance.navigation.gotoPrevPage;
            keyConfiguration[ActiveText.Keymap.RIGHT] = activeTextInstance.navigation.gotoNextPage;
        }

        activeTextInstance.options.containerElement.on('remove', teardown);

        $(window).on({
            keydown: onKeyDown
        });

        function teardown() {
            activeTextInstance.options.containerElement.off('remove', teardown);
            $(window).off({
                keydown: onKeyDown
            });
        }
    }

    function onKeyDown(e) {
        var code = e.which;
        if(keyConfiguration[code] !== null && typeof(keyConfiguration[code]) === 'function') {
            keyConfiguration[code]();
        }
    }

    return {
        init: init,
        key: 'keyboardintegration'
    };
};