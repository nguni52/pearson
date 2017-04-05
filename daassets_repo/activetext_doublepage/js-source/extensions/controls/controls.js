/* global ActiveText, Modernizr */
ActiveText.UI = ActiveText.UI || {};
/**
 * @class BasicControls
 * @memberOf ActiveText.UI
 * @returns {{init: init, hideControls: hideControls, revealControls: revealControls, getBarHeight: getBarHeight, key: string, options: *}}
 * @constructor
 */
ActiveText.UI.BasicControls = function() {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_Z_INDEX = 1010;

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_BAR_HEIGHT = 50;

    var activeTextInstance, options;

    if(arguments.length === 2) {
        activeTextInstance = arguments[0];
        options = arguments[1];
    } else if(arguments.length === 1) {
        options = arguments[0];
    }

    var controlsBar, hitArea;

    var visibilityHelper;

    function init(instance) {
        activeTextInstance = instance;

        visibilityHelper = new ActiveText.UI.BasicControls.ControlsBarVisibilityHelper(options);

        $(activeTextInstance).one(ActiveText.Commands.INIT_WHITEBOARD, create);
        $(activeTextInstance).on(ActiveText.Events.RESIZE, setHitAreaHeight);
    }

    function getBarHeight() {
        if(options && typeof(options.barHeight) === 'number') {
            return options.barHeight;
        } else {
            return DEFAULT_BAR_HEIGHT;
        }
    }

    /**
     * @param key {string}
     * @returns {*}
     */
    function getObjectByKey(key) {
        if(options && typeof(options[key]) === 'object') {
            return options[key];
        }
    }

    function getContainerVerticalMargins() {
        return parseInt(activeTextInstance.view.getContainer().parent().css('marginBottom'), 10);
    }

    function setHitAreaHeight() {
        if(hitArea !== undefined) {
            var targetHeight = getContainerVerticalMargins();
            var barHeight = getBarHeight();
            if(targetHeight < barHeight) {
                targetHeight = barHeight;
            }
            hitArea.css({
                paddingTop: targetHeight - barHeight
            });
        }
    }

    function injectCSSTagToHTMLPage() {
        if(ActiveText.UI && ActiveText.UI.FontInjection && !ActiveText.UI.FontInjection.hasBeenAdded()) {
            ActiveText.UI.FontInjection.injectFontTag();
        }

        var scope = activeTextInstance.options.containerElement.selector + ' ';
        var cssStr = ActiveText.UI.BasicControls.Style.getStyle(scope, activeTextInstance.theme, getBarHeight());
        ActiveText.CSSUtils.embedCSS(cssStr, activeTextInstance.options.containerElement.selector +
            '-activetext-controls-bar');
    }

    function createHitArea() {
        var container = activeTextInstance.view.getContainer().parent().parent();

        if(!activeTextInstance.utils.isFullWindowScalingMode()) {
            // to use absolute positioning for our main element, we need the container to be relative.
            container.css({
                position: 'relative'
            });
        }

        hitArea = $('<div/>').css({
            position: activeTextInstance.utils.isFullWindowScalingMode() ? 'fixed' : 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: DEFAULT_Z_INDEX
        });

        hitArea.click(visibilityHelper.revealControls);

        container.append(hitArea);
    }

    function generateButtonByKeywordForElement(keyword, element) {
        var subClass = ActiveText.UI.BasicControls.AvailableControls[keyword];
        if(!subClass) {
            return;
        }

        if(subClass.supported && typeof(subClass.supported) === 'function') {
            if(!subClass.supported()) {
                return;
            }
        }

        if(subClass.create && typeof(subClass.create) === 'function') {
            var classOptions = {
                styles: getObjectByKey('buttonStyles'),
                hoverStyles: getObjectByKey('buttonHoverStyles'),
                toggleStyles: getObjectByKey('toggleButtonStyles'),
                toggleHoverStyles: getObjectByKey('toggleButtonHoverStyles')
            };
            if(options && options.options) {
                classOptions.options = options.options[keyword];
            }

            var newElement = subClass.create(activeTextInstance, classOptions);
            element.append(newElement);
            element.append(' ');
            return newElement;
        }
    }

    function fitControlsToViewportOnResize() {
        if(options.scaleMode === 'scale') {
            var container = activeTextInstance.options.containerElement;
            var containerWidth = container.outerWidth();
            var minWidth = options.minWidth;
            if(containerWidth < minWidth) {
                controlsBar.css({
                    transform: 'scale(' + (containerWidth / minWidth) + ')',
                    '-moz-transform-origin': '0% 100%',
                    '-ms-transform-origin': '0% 100%'
                });
            } else {
                controlsBar.css({
                    transform: ''
                });
            }
        }
    }

    function addEventListeners() {
        if(options.minWidth && options.scaleMode !== undefined) {
            $(activeTextInstance).on(ActiveText.Events.RESIZE, fitControlsToViewportOnResize);
            fitControlsToViewportOnResize();
        }
    }

    function createButtonGroup(group, container, tabindexOffset) {
        if(group) {
            var controlsElement;
            var buttons = group.split(',');
            var returnValue = 0;
            for(var i = 0, l = buttons.length; i < l; i++) {
                controlsElement = generateButtonByKeywordForElement(buttons[i], container);
                if(controlsElement) {
                    controlsElement.find('*').andSelf().filter('[role="button"],input').attr('tabindex', i +
                        tabindexOffset);
                    returnValue++;
                    if(i === 0) {
                        controlsElement.addClass('first');
                    }
                }
            }
            if(controlsElement){
                controlsElement.addClass('last');
            }
            return {
                count: returnValue,
                container: container
            };
        } else {
            return {
                count: tabindexOffset
            };
        }
    }

    function initDefaultSettings() {
        if(!options) {
            options = {};
        }
        if(!options.primary && !options.secondary && !options.leftButtons && !options.rightButtons) {
            options.primary = 'previous,next';
        }
    }

    function checkOverlayMode() {
        if(options && typeof(options.overlay) === 'boolean' && options.overlay === false) {
            if(typeof(activeTextInstance.options.containerCoordinates) !== 'object') {
                activeTextInstance.options.containerCoordinates = {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                };
            }
            activeTextInstance.options.containerCoordinates.bottom += getBarHeight();
        }
    }

    function createControlsBar() {
        var DEFAULT_BAR_STYLE = {
            textAlign: 'center',
            height: getBarHeight(),
            userSelect: 'none',
            font: '16px/' + (getBarHeight() - 2) + 'px Helvetica, Helvetica Neue, Arial',
            fontSize: 32,
            backgroundSize: '100% ' + getBarHeight() + 'px'
        };
        var version = parseInt($.browser.version, 10);
        if(!$.browser.msie || $.browser.msie && version > 8) {
            $.extend(DEFAULT_BAR_STYLE, {
                backgroundColor: activeTextInstance.theme.getControlsBackgroundColor(0.5)
            });
        }

        controlsBar = $("<div class='controls-bar'></div>").css(DEFAULT_BAR_STYLE);
        controlsBar.click(function() {
            return false;
        });

        var customStyles = getObjectByKey('barStyles');
        if(customStyles) {
            controlsBar.css(customStyles);
        }

        $(document).ready(function() {
            initDefaultSettings();

            var leftButtonsContainer = $('<div style="position:absolute;left:0"></div>');
            if(options.leftButtonOptions) {
                leftButtonsContainer.css(options.leftButtonOptions);
            }

            var primaryButtonsContainer = $('<div style="position:absolute;width:100%;"></div>');
            if(options.primaryButtonOptions) {
                primaryButtonsContainer.css(options.primaryButtonOptions);
            }

            var secondaryButtonsContainer = $('<div style="position:absolute;right:0;"></div>');
            if(options.secondaryButtonOptions) {
                secondaryButtonsContainer.css(options.secondaryButtonOptions);
            }

            var rightButtonsContainer = $('<div style="position:absolute;right:0"></div>');
            if(options.rightButtonOptions) {
                rightButtonsContainer.css(options.rightButtonOptions);
            }

            var tabIndexStart = 2;
            var leftButtonGroup = createButtonGroup(options.leftButtons, leftButtonsContainer, tabIndexStart);
            tabIndexStart += leftButtonGroup.count;
            var primaryButtonGroup = createButtonGroup(options.primary, primaryButtonsContainer, tabIndexStart);
            tabIndexStart += primaryButtonGroup.count;
            var secondaryButtonGroup = createButtonGroup(options.secondary, secondaryButtonsContainer, tabIndexStart);
            tabIndexStart += secondaryButtonGroup.count;
            var rightButtonGroup = createButtonGroup(options.rightButtons, rightButtonsContainer, tabIndexStart);

            controlsBar.append(primaryButtonGroup.container);
            controlsBar.append(secondaryButtonGroup.container);
            controlsBar.append(leftButtonGroup.container);
            controlsBar.append(rightButtonGroup.container);

            if(!options.barStyles) {
                if(!Modernizr.rgba) {
                    var backgroundBlock = $('<div style="top:0;left:0;bottom:0;right:0;position:absolute" role="presentation"></div>').css({
                        background: activeTextInstance.theme.getControlsBackgroundColor(0.5)
                    });
                    backgroundBlock.css({
                        filter: 'alpha(opacity=50)'
                    });
                    controlsBar.prepend(backgroundBlock);
                }
            }

            addEventListeners();
            checkOverlayMode();

            $(activeTextInstance).trigger({
                    type: ActiveText.Events.UI_ELEMENT_LOADED,
                    element: 'controls-bar'
            });

        });

        hitArea.append(controlsBar);

        visibilityHelper.register(activeTextInstance, controlsBar, getBarHeight());
    }

    function create() {
        injectCSSTagToHTMLPage();
        createHitArea();
        createControlsBar();
    }

    function revealControls() {
        visibilityHelper.revealControls();
    }

    function hideControls() {
        visibilityHelper.hideControls();
    }

    if(activeTextInstance) {
        init(activeTextInstance);
    }

    return {
        init: init,
        hideControls: hideControls,
        revealControls: revealControls,
        getBarHeight: getBarHeight,
        key: 'controls',
        options: options
    };
};