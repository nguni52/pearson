/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'contents';

    /**
     * @const
     * @type {{title: string}}
     */
    var DEFAULT_BUTTON_SETTINGS = {
        title: 'Contents',
        className: KEY,
        icon: 'icon-list-ul',
        accesskey: 'C'
    };

    function create(activeTextInstance, options) {
        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_SETTINGS, options);
        newElement.click(function() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
        });

        var popupController = new ActiveText.UI.StructurePopup();
        var width;
        if(options && options.options && options.options.popupnavwidth) {
            width = options.options.popupnavwidth;
        }
        popupController.init(activeTextInstance, $(newElement), undefined, width);

        var container = $('<div class="contents-container control"></div>').css({
            display: 'inline-block',
            position: 'relative',
            width: newElement.outerWidth()
        });
        container.append(newElement);

        return container;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);