/* global ActiveText */
ActiveText.UI = ActiveText.UI || {};
ActiveText.UI.BasicControls = ActiveText.UI.BasicControls || {};
/**
 * @class SimpleButtonFactory
 * @memberOf ActiveText.UI.BasicControls
 * @type {{createSimpleButton:create}}
 */
ActiveText.UI.BasicControls.SimpleButtonFactory = (function() {
    'use strict';

    function getButtonInner(configuration) {
        var rtn;

        var isImageButton = Boolean(configuration.imageSrc !== undefined);
        if(isImageButton) {
            var imageSrc = configuration.imageSrc;
            if(configuration.width && configuration.height) {
                rtn = "<img src='" + imageSrc + "' width='" + configuration.width + "' height='" +
                    configuration.height + "' />";
            } else {
                rtn = "<img src='" + imageSrc + "' />";
            }
        } else {
            if(configuration.svgData) {
                rtn = configuration.svgData;
            } else {
                var icon = configuration.icon || configuration.icon_off;
                if(!icon) {
                    rtn = '<span>' + configuration.title + '</span>';
                } else {
                    rtn = "<i class='button " + icon + "'></i>";
                }
            }
        }
        return rtn;
    }

    function create(configKeys, options) {
        function teardown() {
            newElement.off({
                mouseover: ActiveText.Controls.ButtonHelper.mouseOver,
                focus: ActiveText.Controls.ButtonHelper.focusAction,
                blur: ActiveText.Controls.ButtonHelper.blurAction,
                mouseout: ActiveText.Controls.ButtonHelper.mouseOut,
                mousedown: ActiveText.Controls.ButtonHelper.mouseDown,
                touchstart: ActiveText.Controls.ButtonHelper.mouseDown,
                touchend: ActiveText.Controls.ButtonHelper.mouseOut,
                touchcancel: ActiveText.Controls.ButtonHelper.mouseOut,
                remove: teardown,
                keyup: ActiveText.Controls.ButtonHelper.accessibleClick
            });

            $(window).off({
                keydown: onKeyDown,
                keyup: onKeyUp
            });
        }

        function onKeyDown(e) {
            if(e.keyCode === buttonOptions.keyCode) {
                $(newElement).mousedown();
            }
        }

        function onKeyUp(e) {
            if(e.keyCode === buttonOptions.keyCode) {
                $(newElement).mouseout();
            }
        }

        function setupEnableDisableFunctions(buttonOptions, newElement) {
            switch(buttonOptions.enableBehaviour) {
                case 'show':
                    newElement.disable = ActiveText.Controls.ButtonHelper.basicDisable;
                    newElement.enable = ActiveText.Controls.ButtonHelper.basicEnable;
                    break;
                case 'hide':
                    newElement.disable = ActiveText.Controls.ButtonHelper.hideDisable;
                    newElement.enable = ActiveText.Controls.ButtonHelper.showEnable;
                    break;
                default:
                    newElement.disable = ActiveText.Controls.ButtonHelper.fadeDisable;
                    newElement.enable = ActiveText.Controls.ButtonHelper.fadeEnable;
                    break;
            }
        }

        function setupKeyboardIntegration(buttonOptions) {
            if(buttonOptions.keyCode !== undefined) {
                $(window).keydown(onKeyDown).keyup(onKeyUp);
            }
        }

        var buttonOptions = $.extend({}, options, configKeys);
        if(options) {
            buttonOptions = $.extend(buttonOptions, options.options);
        }
        var buttonStyles = $.extend({}, buttonOptions, buttonOptions.styles, buttonOptions.style);
        var buttonHoverStyles = $.extend({}, buttonOptions, buttonOptions.hoverStyles, buttonOptions.hoverStyle);
        var elementContentStr = getButtonInner(buttonStyles);
        var newElement;
        var imageSrc = buttonOptions.imageSrc;
        var downImageSrc = buttonOptions.downImageSrc;
        var hoverImageSrc = buttonOptions.hoverImageSrc;
        var disabledImageSrc = buttonOptions.disabledImageSrc;
        var toggleButtonImageSrc = buttonOptions.toggleButtonImageSrc;
        var toggleButtonDownImageSrc = buttonOptions.toggleButtonDownImageSrc;
        var toggleButtonHoverImageSrc = buttonOptions.toggleButtonHoverImageSrc;
        var barClass = 'activetext-default';

        if(buttonOptions && buttonOptions.styles && buttonOptions.styles.barClass) {
            barClass = buttonOptions.styles.barClass;
        }

        if(imageSrc) {
            newElement = $("<a class='button'></a>");
        } else {
            newElement = $("<a class='" + barClass + " button'></a>");
        }

        var buttonContents = $(elementContentStr).attr('role', 'presentation');
        newElement.html(buttonContents);

        newElement.attr('data-original-title', configKeys.title);

        if(configKeys.className) {
            newElement.addClass(configKeys.className);
        }

        newElement.css({
            borderRadius: (buttonStyles && buttonStyles.height) ? (buttonStyles.height / 2) : '22px',
            cursor: 'pointer',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'rgba(0,0,0,0)',
            outline: 'none',
            display: 'inline-block'
        });

        if(buttonOptions.styles) {
            newElement.css(buttonOptions.styles);
        }

        buttonStyles.closeFunction = undefined;
        newElement.data('styles', buttonStyles);
        buttonHoverStyles.closeFunction = undefined;
        newElement.data('hover-styles', buttonHoverStyles);

        var toggleStyles = $.extend({}, buttonOptions.toggleStyles, buttonOptions.toggleStyle);
        toggleStyles.closeFunction = undefined;
        newElement.data('toggle-styles', toggleStyles);

        var toggleHoverStyles = $.extend({}, buttonOptions.toggleHoverStyles, buttonOptions.toggleHoverStyle);
        toggleHoverStyles.closeFunction = undefined;
        newElement.data('toggle-hover-styles', toggleHoverStyles);

        newElement.data('imageSrc', imageSrc);
        newElement.data('downImageSrc', downImageSrc);
        newElement.data('hoverImageSrc', hoverImageSrc);
        newElement.data('toggleButtonImageSrc', toggleButtonImageSrc);
        newElement.data('toggleButtonDownImageSrc', toggleButtonDownImageSrc);
        newElement.data('toggleButtonHoverImageSrc', toggleButtonHoverImageSrc);
        newElement.data('disabledImageSrc', disabledImageSrc);

        newElement.on({
            mouseover: ActiveText.Controls.ButtonHelper.mouseOver,
            focus: ActiveText.Controls.ButtonHelper.focusAction,
            blur: ActiveText.Controls.ButtonHelper.blurAction,
            mouseout: ActiveText.Controls.ButtonHelper.mouseOut,
            mousedown: ActiveText.Controls.ButtonHelper.mouseDown,
            touchstart: ActiveText.Controls.ButtonHelper.mouseDown,
            touchend: ActiveText.Controls.ButtonHelper.mouseOut,
            touchcancel: ActiveText.Controls.ButtonHelper.mouseOut,
            remove: teardown,
            keyup: ActiveText.Controls.ButtonHelper.accessibleClick
        });

        newElement.attr({
            role: 'button',
            title: configKeys.title,
            'data-original-title': ActiveText.Controls.ButtonHelper.getAccessKeyHTMLFor(configKeys.title, configKeys.accesskey),
            'aria-label': configKeys.title,
            accesskey: configKeys.accesskey
        });

        if(buttonStyles.tooltips === undefined || buttonStyles.tooltips) {
            newElement.attr('has-tooltip', true);
            newElement.tooltip({
                html: true,
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
        }
        newElement.trigger('mouseout');

        setupEnableDisableFunctions(buttonOptions, newElement);
        setupKeyboardIntegration(buttonOptions);

        return newElement;
    }

    return {
        createSimpleButton: create
    };
})();
