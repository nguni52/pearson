/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'settings';

    var DEFAULT_OBJECT = {
        title_on: 'Double Page View',
        title_off: 'Single Page View',
        icon_on: 'icon-columns',
        icon_off: 'icon-file',
        className: KEY,
        accesskey: 'S'
    };

    function create(activeTextInstance, options) {
        function switchToDPSView() {
            $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_DPS_VIEW);
        }

        function switchToSinglePageView() {
            $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_SPS_VIEW);
        }

        function buttonClickHandler() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            if(ActiveText.ViewUtils.isSinglePageView(activeTextInstance)) {
                newElement.toggle_button(true);
                switchToDPSView();
            } else {
                newElement.toggle_button(false);
                switchToSinglePageView();
            }
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_OBJECT, options);
        newElement.toggle_button(true);
        newElement.on({
            click: buttonClickHandler
        });

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
