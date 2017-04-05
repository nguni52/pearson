/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'structure';

    var DEFAULT_SETTINGS = {
        title: 'eBook Structure',
        icon: 'icon-reorder',
        className: KEY,
        accesskey: 'C'
    };

    function create(activeTextInstance, options) {
        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;
        var newElement = factory.createSimpleButton(DEFAULT_SETTINGS, options);

        var popupController = new ActiveText.UI.StructurePopup();
        var width;
        if(options && options.options && options.options.popupnavwidth) {
            width = options.options.popupnavwidth;
        }
        popupController.init(activeTextInstance, $(newElement), undefined, width);

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
