/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'quicknav-popup';

    function create(activeTextInstance, options) {
        var parentClass = ActiveText.UI.BasicControls.AvailableControls['quicknav'];
        var baseObject = parentClass.create(activeTextInstance, options);
        var newElement = baseObject.get().firstChild;

        var popupController = new ActiveText.UI.StructurePopup();
        var width;
        if(options && options.options && options.options.popupnavwidth) {
            width = options.options.popupnavwidth;
        }
        popupController.init(activeTextInstance, $(newElement), undefined, width);

        return baseObject;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
