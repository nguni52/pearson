/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'minimise';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_SETTINGS = {
        title: 'Hide Controls',
        icon: 'icon-angle-down',
        className: KEY,
        accesskey: 'M'
    };

    function create(activeTextInstance, options) {
        function buttonClickHandler(e) {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            var extension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'controls');
            extension.hideControls();
            return false;
        }

        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;
        var newElement = factory.createSimpleButton(DEFAULT_BUTTON_SETTINGS, options);

        newElement.on({
            click: buttonClickHandler
        });

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);