/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'record';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Record',
        icon: 'icon-record',
        className: KEY,
        accesskey: 'O'
    };


    /**
     * @param activeTextInstance {ActiveText}
     * @param options {object}
     * @returns {jQuery}
     */
    function create(activeTextInstance, options) {
        /**
         * @type {ActiveText.RecordAndPlay}
         */
        var recordAndPlayExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'recordandplay');

        function buttonClickHandler(event) {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            recordAndPlayExtension.toggleRecord();
        }

        function updateButtonState(event) {
            if(event.type === 'stop') {
                newElement.toggle_button(false);
            } else {
                newElement.toggle_button(true);
            }

        }

        function attachEventListeners(buttonElement) {
            buttonElement.on('click', buttonClickHandler);
            $(activeTextInstance).on('record stop', updateButtonState);
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_STYLES, options);

        if(recordAndPlayExtension && recordAndPlayExtension.hasFlash()) {
            attachEventListeners(newElement);
        } else {
            newElement.disable();
        }

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
