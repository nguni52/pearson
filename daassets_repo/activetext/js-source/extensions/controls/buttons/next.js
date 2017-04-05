/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'next';

    /**
     * @const
     * @type {{title: string, icon: string, className: string, keyCode: number, accesskey: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Next Page',
        icon: 'icon-caret-right',
        className: KEY,
        keyCode: 39,
        accesskey: 'N'
    };

    function create(activeTextInstance, options) {
        function buttonClickHandler() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            var enabled = activeTextInstance.navigation.canGoToNextPage();
            if(enabled) {
                activeTextInstance.navigation.gotoNextPage();
            }
            return false;
        }

        function updateButtonState() {
            var enabled = activeTextInstance.navigation.canGoToNextPage();
            if(enabled) {
                newElement.enable();
            } else {
                newElement.disable();
            }
        }

        var newElement = ActiveText.UI.BasicControls.SimpleButtonFactory.createSimpleButton(DEFAULT_BUTTON_STYLES, options);
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
