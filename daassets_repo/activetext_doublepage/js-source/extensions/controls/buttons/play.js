/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'play';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Play',
        icon: 'icon-play',
        className: KEY,
        accesskey: 'L'
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
            recordAndPlayExtension.togglePlay();
        }

        function updateButtonState(event) {

            if(event.type === 'play' || event.type === 'resume') {
                newElement.toggle_button(true);
            } else {
                newElement.toggle_button(false);
            }
        }

        function enableButton(){
            newElement.enable();
        }

        function attachEventListeners(buttonElement) {
            buttonElement.on('click', buttonClickHandler);
            $(activeTextInstance).on('play pause resume finish', updateButtonState);
            $(activeTextInstance).on('stop', enableButton);
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_STYLES, options);

        if(recordAndPlayExtension) {
            attachEventListeners(newElement);
        }

        if(!recordAndPlayExtension || !recordAndPlayExtension.hasRecorded() || !recordAndPlayExtension.hasFlash()){
            newElement.disable();
        }

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
