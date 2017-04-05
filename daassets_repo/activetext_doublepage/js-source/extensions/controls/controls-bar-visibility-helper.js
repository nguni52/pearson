/* global ActiveText, Modernizr */
ActiveText.UI = ActiveText.UI || {};
ActiveText.UI.BasicControls = ActiveText.UI.BasicControls || {};
ActiveText.UI.BasicControls.ControlsBarVisibilityHelper = function(options) {
    'use strict';

    /**
     * @const
     * @private
     * @type {number}
     */
    var DEFAULT_ANIMATION_SPEED = 300;

    var activeTextInstance;

    var barHeight, controlsBar;

    function register(instance, inputControlsBar, inputBarHeight) {
        activeTextInstance = instance;
        controlsBar = inputControlsBar;
        barHeight = inputBarHeight;

        create();
        addEventListeners();
    }

    function getContainerVerticalMargins(activeTextInstance) {
        return parseInt(activeTextInstance.view.getContainer().parent().css('marginBottom'), 10);
    }

    function addEventListeners() {
        var container = activeTextInstance.view.getContainer().parent();

        function attachSwipeInteractions() {
            if(container && container.swipe && typeof(container.swipe) === 'function') {
                container.swipe({
                    swipeUp: revealControls,
                    swipeDown: hideControls
                });

                container.parent().swipe({
                    click: toggleControls
                });
            }
        }

        if(options.overlay === true) {
            attachSwipeInteractions();
        }

        if(options.minWidth && options.scaleMode !== undefined) {
            controlsBar.css({
                transformOriginX: 'left',
                transformOriginY: 'bottom',
                minWidth: options.minWidth
            });
        }
    }

    function create() {
        if(options) {
            if(!options.openByDefault && options.overlay ||
                options.overlay === undefined && !options.openByDefault) {
                hideControls();
            }
        }
    }

    function toggleControls() {
        if(controlsBar.attr('data-toggle') === 'on') {
            hideControls();
        }
        else {
            revealControls();
        }
    }

    function revealControls() {
        var targetHeight = getContainerVerticalMargins(activeTextInstance);
        if(targetHeight < barHeight) {
            targetHeight = barHeight;
        }
        if(options.overlay === true) {
            controlsBar.attr('data-toggle', 'on').animate({
                marginTop: targetHeight - barHeight,
                marginBottom: -(targetHeight - barHeight)
            }, {
                duration: DEFAULT_ANIMATION_SPEED,
                easing: 'easeOutExpo'
            });
        }
        return false;
    }

    function hideControls() {
        var targetHeight = getContainerVerticalMargins(activeTextInstance);
        if(targetHeight < barHeight) {
            targetHeight = barHeight;
        }
        if(options.overlay === true) {
            controlsBar.attr('data-toggle', 'off').animate({
                marginTop: targetHeight,
                marginBottom: -(targetHeight)
            }, {
                duration: DEFAULT_ANIMATION_SPEED,
                easing: 'easeOutExpo',
                queue: false
            });
        }
        return false;
    }

    return {
        register: register,
        hideControls: hideControls,
        revealControls: revealControls
    };
};