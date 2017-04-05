/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'previous';

    /**
     * @const
     * @type {{title: string, icon: string, className: string, keyCode: number, accesskey: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Previous Page',
        icon: 'icon-caret-left',
        className: KEY,
        keyCode: 37,
        accesskey: 'P'
    };

    function create(activeTextInstance, options) {
        function buttonClickHandler() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            var enabled = activeTextInstance.navigation.canGoToPreviousPage();
            if(enabled) {
                activeTextInstance.navigation.gotoPrevPage();
            }
            return false;
        }

        function updateButtonState() {
            var enabled = activeTextInstance.navigation.canGoToPreviousPage();
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
