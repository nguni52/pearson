/* global ActiveText */
ActiveText.UI = ActiveText.UI || {};
ActiveText.UI.BasicControls = ActiveText.UI.BasicControls || {};
/**
 * @class ToggleButtonFactory
 * @memberOf ActiveText.UI.BasicControls
 * @type {{createToggleButton:createToggleButton}}
 */
ActiveText.UI.BasicControls.ToggleButtonFactory = (function() {
    'use strict';

    function getButtonInner(configuration, toggle) {
        var rtn;

        var isImageButton = Boolean(configuration.imageSrc !== undefined);
        if(isImageButton) {
            var imageSrc = configuration.imageSrc;
            if(toggle) {
                imageSrc = configuration.toggleButtonImageSrc;
            }
            if(configuration.width && configuration.height) {
                rtn = '<img src="' + imageSrc + '" width="' + configuration.width + '" height="' +
                    configuration.height + '" />';
            } else {
                rtn = '<img src="' + imageSrc + '" />';
            }
        } else {
            if(configuration.svgData) {
                rtn = configuration.svgData;
            } else {
                var icon = configuration.icon || configuration.icon_off;
                if(toggle) {
                    icon = configuration.icon_on || configuration.icon_off || configuration.icon;
                }
                if(!icon) {
                    icon = 'icon-undefined';
                }
                rtn = '<i class="button ' + icon + '"></i>';
            }
        }
        return rtn;
    }

    /**
     * @param configKeys {{title:string, title_off:string, title_on:string, icon_on:string, icon_off:string, svgData:string, className:string}}
     * @param options
     * @returns {*}
     */
    function createToggleButton(configKeys, options) {
        var simpleButton = ActiveText.UI.BasicControls.SimpleButtonFactory.createSimpleButton(configKeys, options);
        simpleButton.toggle_button = function toggle_button(value) {
            var buttonOptions = $.extend({}, configKeys, options);
            if(options && options.options) {
                buttonOptions = $.extend(buttonOptions, options.options);
            }
            var mergedStyles = $.extend({}, buttonOptions, buttonOptions.styles, buttonOptions.style);
            var elementContentStr = getButtonInner(mergedStyles, value);

            var buttonContents = $(elementContentStr).attr('role', 'presentation');

            simpleButton.html(buttonContents).data('selected', value);

            var titleCodeRaw, titleCode;
            if(value) {
                titleCodeRaw = configKeys.title_off || configKeys.title;
                simpleButton.attr({
                    'aria-label': titleCodeRaw
                });
                titleCode = ActiveText.Controls.ButtonHelper.getAccessKeyHTMLFor(titleCodeRaw, configKeys.accesskey);
                simpleButton.attr('data-original-title', titleCode).attr('title', titleCodeRaw);
                simpleButton.addClass('active');
            } else {
                titleCodeRaw = configKeys.title_on || configKeys.title;
                simpleButton.attr({
                    'aria-label': titleCodeRaw
                });
                titleCode = ActiveText.Controls.ButtonHelper.getAccessKeyHTMLFor(titleCodeRaw, configKeys.accesskey);
                simpleButton.attr('data-original-title', titleCode).attr('title', titleCodeRaw);
                simpleButton.removeClass('active');
            }
            simpleButton.attr('aria-pressed', value);
            if(simpleButton.attr('has-tooltip')) {
                simpleButton.tooltip('hide');
            }
        };

        simpleButton.toggle_state = function toggle_state() {
            return simpleButton.data('selected');
        };

        simpleButton.toggle_button(false);

        simpleButton.trigger('mouseout');

        return simpleButton;
    }

    return {
        createToggleButton: createToggleButton
    };
})();
