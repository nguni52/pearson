/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';
    /**
     * @const
     * @type {string}
     */
    var KEY = 'exit';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_SETTINGS = {
        title: 'Close eBook',
        icon: 'icon-remove',
        className: KEY,
        accesskey: 'B'
    };

    function create(activeTextInstance, options) {
        function buttonClickHandler() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            //                if(confirm('Are you sure you want to close this window?'))
            //                {
            //                debug.log('Attempting to close the current window. If you can read this message, it failed.');
            window.open('', '_self', '');
            window.close();
            //                }
        }

        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;

        var newElement = factory.createSimpleButton(DEFAULT_BUTTON_SETTINGS, options);
        var hasCloseFunction = options && options.options && options.options.closeFunction &&
            typeof(options.options.closeFunction) === 'function';
        if(hasCloseFunction) {
            newElement.on({
                click: options.options.closeFunction
            });
        } else {
            newElement.on({
                click: buttonClickHandler
            });
        }

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
