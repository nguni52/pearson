/* global ActiveText, Modernizr */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'drawing';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Drawing Tools',
        icon: 'icon-pencil',
        className: KEY,
        accesskey: 'D'
    };

    function supported() {
        return Modernizr.canvas;
    }

    function create(activeTextInstance, options) {
        function toggleControlsVisibility() {
            var isOpen = $(newElement).data('isopen');
            if(isOpen === true) {
                $(newElement).data('isopen', false);
                newElement.toggle_button(false);
                toolPanel.hideToolPanel();
            } else {
                $(newElement).data('isopen', true);
                newElement.toggle_button(true);
                toolPanel.showToolPanel();
            }
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_STYLES, options);
        newElement.click(function() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
        });

        var toolPanel = new ActiveText.UI.DrawingToolsPanel();
        toolPanel.init({
            activeTextInstance: activeTextInstance
        });

        newElement.on('click tap', toggleControlsVisibility);
        $(newElement).data('isopen', false);
        newElement.toggle_button(false);

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create,
        supported: supported
    };
})(ActiveText);
