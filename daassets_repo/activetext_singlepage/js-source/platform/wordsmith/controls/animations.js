/* global ActiveText */
ActiveText.namespace("ActiveText.UI.BasicControls.AvailableControls");
(function(ActiveText) {
    "use strict";

    /**
     * @const
     * @type {string}
     */
    var KEY = "animations";

    var DEFAULT_BUTTON_STYLES = {
        title_off: "Pause Animations",
        title_on: "Play Animations",
        icon_off: "icon-animations-pause",
        icon_on: "icon-animations-play",
        className: KEY
    };

    function create(activeTextInstance, options) {
        var disabled = false;
        var disabledFlag = '#disabled';
        var enabledFlag = '#enabled';
        var frameSrc;

        function getLocation(frame) {
            var location;

            //            if(ActiveText.LoaderUtils.isBuggyDevice())
            //            {
            //                location = window.location;
            //            }
            //            else
            //            {
            var iframe = frame.find('iframe')[0];

            if(!iframe || !iframe.contentWindow || !iframe.contentWindow.window ||
                !iframe.contentWindow.window.location) {
                return;
            }

            location = iframe.contentWindow.window.location;
            //            }

            if(location === "about:blank") {
                return;
            }

            return location;
        }

        function addFlag(frame) {
            var location = getLocation(frame);

            if(!location) {
                return;
            }

            location.replace(("" + location).split("#")[0] + disabledFlag);
        }

        function removeFlag(frame) {
            var location = getLocation(frame);

            if(!location) {
                return;
            }

            location.replace(("" + location).split("#")[0] + enabledFlag);
        }

        function buttonClickHandler(event) {
            var frames = activeTextInstance.view.getIFrames();
            var i, frame;

            for(i in frames) {
                frame = $(frames[i]);

                if(!frame.length) {
                    continue;
                }

                if(!disabled) {
                    addFlag(frame);
                }
                else {
                    removeFlag(frame);
                }
            }

            disabled = disabled ? false : true;
            newElement.toggle_button(disabled);

            return false;
        }

        function onFrameCreated(event, data) {
            var frame = $(ActiveText.ViewUtils.getFrameForPageByIndex(activeTextInstance, data.index));

            if(!frame.length) {
                return;
            }

            if(disabled) {
                addFlag(frame);
            }
            else {
                removeFlag(frame);
            }
        }

        $(activeTextInstance).on(ActiveText.Events.FRAME_CONTENT_LOADED, onFrameCreated);

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_STYLES, options);
        newElement.on({
            click: buttonClickHandler
        });

        newElement.toggle_button(false);

        return newElement;
    }

    /**
     * @type {{create: Function}}
     */
    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);

