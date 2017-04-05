/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'bugclubhotspots';

    /**
     * @private
     * @type {{title_on: string, title_off: string, icon_off: string, icon_on: string, className: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title_on: 'Show Hotspots',
        title_off: 'Hide Hotspots',
        icon_off: 'icon-eye-close',
        icon_on: 'icon-eye-open',
        className: KEY,
        accesskey: 'H'
    };

    function create(activeTextInstance, options) {
        var isVisible = true;
        //        var layerUtils = activeTextInstance.view.getLayerUtils();
        var dataCache = [];

        function showLayers() {
            ActiveText.LayerUtils.setLayerVisibility(activeTextInstance, 'standalone_hotspots', true);
        }

        function hideLayers() {
            ActiveText.LayerUtils.setLayerVisibility(activeTextInstance, 'standalone_hotspots', false);
        }

        function buttonClickHandler(event) {
            if(isVisible) {
                isVisible = false;
                newElement.toggle_button(false);
                hideLayers();
            } else {
                isVisible = true;
                newElement.toggle_button(true);
                showLayers();
            }
        }

        function getNumberOfValidHotspotsFromData(data) {
            var objects = [];
            for(var i = 0, l = data.data.length; i < l; i++) {
                var item = data.data[i];
                if(item.type === 'hotspot') {
                    objects.push(item);
                    //                    dataCache[item.data.id] = item;
                }
            }
            return objects.length;
        }

        function checkDataIsForCurrentPage(event, data) {
            dataCache[data.index] = 0;
            updateButtonEnabled();
        }

        function updateButtonEnabled() {
            var visibleIndex = activeTextInstance.model.getCurrentIndex();
            var numberOfFrames = activeTextInstance.view.model.getDisplayedPages();

            var hasHotspots = false;
            for(var i = visibleIndex, l = visibleIndex + numberOfFrames; i < l; i++) {
                if(dataCache[i] && dataCache[i] > 0) {
                    hasHotspots = true;
                }
            }

            if(hasHotspots) {
                newElement.enable();
            } else {
                newElement.disable();
            }
        }

        function checkLoadedDataIsForCurrentPage(event, data) {
            dataCache[data.index] = getNumberOfValidHotspotsFromData(data);

            updateButtonEnabled();
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_STYLES, options);
        newElement.toggle_button(true);
        newElement.on({
            click: buttonClickHandler
        });

        $(activeTextInstance).on(ActiveText.Events.LOADED_OVERLAY_DATA, checkLoadedDataIsForCurrentPage);
        $(activeTextInstance).on(ActiveText.Events.OVERLAY_DATA_FAIL, checkDataIsForCurrentPage);

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);
