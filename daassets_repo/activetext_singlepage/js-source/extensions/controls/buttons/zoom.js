/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'zoom';

    var DEFAULT_BUTTON_STYLES = {
        title_off: 'Zoom In',
        title_on: 'Zoom Out',
        icon_off: 'icon-zoom-out',
        icon_on: 'icon-zoom-in',
        className: KEY,
        accesskey: 'Z'
    };

    function create(activeTextInstance, options) {
        function zoomOut() {
            activeTextInstance.view.getContainer().css({
                top: 0,
                left: 0
            });
            try {
                activeTextInstance.view.getContainer().parent().draggable('destroy');
                activeTextInstance.view.getContainer().draggable('destroy');
            }
            catch(e) {
                // do nothing
            }
            activeTextInstance.view.model.setMagnificationValue(1);
            activeTextInstance.view.model.setScaleMode('fth');
            newElement.toggle_button(true);
        }

        function zoomIn() {
            activeTextInstance.view.model.setMagnificationValue(2);
            $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_ZOOM_MODE);
            newElement.toggle_button(false);
        }

        function onSwitchToDps() {
            $(activeTextInstance).off(ActiveText.Commands.SWITCH_TO_DPS_VIEW, onSwitchToDps).on(ActiveText.Commands.SWITCH_TO_SPS_VIEW, onSwitchToSps);

            if(!newElement.toggle_state()) {
                zoomIn();
            }
        }

        function onSwitchToSps() {
            $(activeTextInstance).off(ActiveText.Commands.SWITCH_TO_SPS_VIEW, onSwitchToSps).on(ActiveText.Commands.SWITCH_TO_DPS_VIEW, onSwitchToDps);
            activeTextInstance.view.model.setMagnificationValue(1);

            if(!newElement.toggle_state() && activeTextInstance.view.model.getScaleMode() !== 'ftw') {
                $(activeTextInstance).trigger(ActiveText.Commands.SWITCH_TO_SPS_FTW_VIEW);
            }
        }

        function buttonClickHandler(event) {
            $(activeTextInstance).off(ActiveText.Commands.SWITCH_TO_DPS_VIEW, onSwitchToDps);
            $(activeTextInstance).off(ActiveText.Commands.SWITCH_TO_SPS_VIEW, onSwitchToSps);

            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });

            if(activeTextInstance.view.model.getScaleMode() === 'zoom') {
                zoomOut();
            } else {
                zoomIn();
            }
        }

        var newElement = ActiveText.UI.BasicControls.ToggleButtonFactory.createToggleButton(DEFAULT_BUTTON_STYLES, options);
        newElement.on({
            click: buttonClickHandler
        });

        zoomOut();

        return newElement;
    }

    function supported() {
        //        var userAgent = navigator.userAgent;
        //        var isMobileDevice = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(userAgent);
        return true;//!isMobileDevice;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create,
        supported: supported
    };
})(ActiveText);
