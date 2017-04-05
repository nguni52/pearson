/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'viewtoggle';

    var DEFAULT_OBJECT = {
        title_on: 'Double Page View',
        title_off: 'Single Page View',
        icon_on: 'icon-file',
        icon_off: 'icon-columns',
        className: KEY,
        accesskey: 'V'
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

        function updateButtonState() {
            var isCardMode = ActiveText.ViewUtils.isCardMode(activeTextInstance);
            if(isCardMode === false) {
                newElement.enable();
            } else {
                newElement.remove();
            }
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_OBJECT, options);
        newElement.toggle_button(true);
        newElement.on({
            click: buttonClickHandler
        });

        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, updateButtonState);

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
