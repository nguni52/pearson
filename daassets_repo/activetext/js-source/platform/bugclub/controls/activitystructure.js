/* global ActiveText, BugClub */
ActiveText.namespace("ActiveText.UI.BasicControls.AvailableControls");
(function(ActiveText) {
    "use strict";

    /**
     * @const
     * @type {string}
     */
    var KEY = "activitystructure";

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_OPTIONS = {
        title: "Contents",
        icon: "icon-reorder",
        className: KEY,
        accesskey: 'C'
    };

    /**
     * @private
     * @param activeTextInstance {ActiveText}
     * @param options {object}
     * @returns {jQuery}
     */
    function create(activeTextInstance, options) {
        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var buttonElement = factory.createToggleButton(DEFAULT_BUTTON_OPTIONS, options);
        var container = $("<div class='structure-container' style='width:" + buttonElement.outerWidth() +
            "px'></div>").append(buttonElement);

        var popupController = new BugClub.StructurePopup();
        var width;
        if(options && options.options && options.options.popupnavwidth) {
            width = options.options.popupnavwidth;
        }
        popupController.init(activeTextInstance, buttonElement, undefined, width);

        return container;
    }

    /**
     * @type {{create: Function}}
     */
    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
