/* global ActiveText, ActiveText */
ActiveText.namespace('ActiveText.Hotspots');
ActiveText.Hotspots = function(hotspotFactory, options) {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     */
    function init(activeTextInstance) {
        var controller = ActiveText.Hotspots.Controller(activeTextInstance, hotspotFactory, options);
        controller.init();

        var clickToPromptController = new ActiveText.ClickToPrompt();
        clickToPromptController.init(activeTextInstance);
        activeTextInstance.extensions.push(clickToPromptController);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(activeTextInstance.options.containerElement).off('remove', teardown);
            controller.teardown();
        }
    }

    return {
        init: init,
        key: 'hotspots'
    };
};