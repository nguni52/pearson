/* global ActiveText, requestAnimationFrame */
ActiveText.Interaction = ActiveText.Interaction || {};
/**
 * @class SwipeGesture
 * @memberOf ActiveText.Interaction
 * @param activeTextInstance {ActiveText}
 * @returns {{register: register, deregister: deregister}}
 * @constructor
 */
ActiveText.Interaction.SwipeGesture = function(activeTextInstance) {
    'use strict';

    /**
     * The container element which holds all of the DPS, loading overlays and animation containers.
     *
     * @type {jQuery|object|undefined}
     */
    var containerElement;

    /**
     * @type {number}
     */
    var cachedContainerWidth;

    /**
     * @type {boolean}
     */
    var shouldLoadNextPages;

    /** @const */
    var PAGE_ANIMATION_SPEED = 300;

    function onWindowResize() {
        if(containerElement) {
            cachedContainerWidth = containerElement.width();
            /**
             * @type {boolean}
             */
            var containerElementIsDefined = containerElement !== undefined;
            /**
             * @type {boolean}
             */
            var jQueryTouchSwipeIsAvailable = typeof($.fn.swipe) === 'function';

            if(containerElementIsDefined && jQueryTouchSwipeIsAvailable) {
                $(containerElement).swipe('option', 'threshold', cachedContainerWidth / 4);
            }
        }
    }

    function onPageChange() {
        shouldLoadNextPages = true;
    }

    function onSwipeLeft() {
        if(activeTextInstance.navigation.canGoToNextPage()) {
            activeTextInstance.navigation.gotoNextPage();
        }
        //        else
        //        {
        //            cancelTactileMovement();
        //        }
    }

    function onSwipeRight() {
        if(activeTextInstance.navigation.canGoToPreviousPage()) {
            activeTextInstance.navigation.gotoPrevPage();
        }
        //        else
        //        {
        //            cancelTactileMovement();
        //        }
    }

    //    function cancelTactileMovement()
    //    {
    //        var offsetX = 0;
    //        animateAllPages(offsetX, PAGE_ANIMATION_SPEED);
    //    }

    // fixme: When the tactile gestures are fixed, start here.
    //    function onSwipeStatus(event, phase, direction, distance, duration, fingers)
    //    {
    //        if(phase === 'move')
    //        {
    //            if(direction === 'left' || direction === 'right')
    //            {
    //                var offsetX = distance;
    //                if(direction === 'left')
    //                {
    //                    offsetX *= -1;
    //                }
    //                animateAllPages(offsetX, 0);
    //            }
    //        }
    //        else if(phase === 'cancel')
    //        {
    //            cancelTactileMovement();
    //        }
    //        else if(phase === 'end')
    //        {
    //            if(distance < (cachedContainerWidth / 4))
    //            {
    //                cancelTactileMovement();
    //            }
    //            // otherwise, the other handlers will pick this up!
    //        }
    //    }

    //    function animateAllPages(offsetX, speed)
    //    {
    //        var currentReader = ActiveText.ViewUtils.getCurrentReader(activeTextInstance);
    //        var nextReader = ActiveText.ViewUtils.getNextReader(activeTextInstance);
    //        var prevReader = ActiveText.ViewUtils.getPrevReader(activeTextInstance);
    //
    //        activeTextInstance.view.getContainer().parent().css({
    //            overflow: 'hidden'
    //        });
    //
    //        if(currentReader)
    //        {
    //            currentReader.parent().animate({
    //                left: offsetX
    //            }, {
    //                duration: speed,
    //                easing: 'linear'
    //            });
    //        }
    //
    //        if(nextReader)
    //        {
    //            nextReader.show();
    //            requestAnimationFrame(function()
    //            {
    //                if(shouldLoadNextPages)
    //                {
    //                    activeTextInstance.loader.loadNextDPS();
    //                }
    //            });
    //        }
    //        if(prevReader)
    //        {
    //            prevReader.show();
    //            requestAnimationFrame(function()
    //            {
    //                if(shouldLoadNextPages)
    //                {
    //                    activeTextInstance.loader.loadPrevDPS();
    //                }
    //            });
    //        }
    //
    //        if(shouldLoadNextPages)
    //        {
    //            shouldLoadNextPages = false;
    //        }
    //    }

    function setupSwipeDetection() {
        /**
         * @type {boolean}
         */
        var containerElementIsDefined = containerElement !== undefined;
        /**
         * @type {boolean}
         */
        var jQueryTouchSwipeIsAvailable = typeof($.fn.swipe) === 'function';
        if(containerElementIsDefined && jQueryTouchSwipeIsAvailable) {
            var options = {
                swipeLeft: onSwipeLeft,
                swipeRight: onSwipeRight,
                // fixme: Reintroduce this for tactile swipe gestures
                //                swipeStatus: onSwipeStatus,
                threshold: 200,
                maxTimeThreshold: 300,
                allowPageScroll: 'auto',
                triggerOnTouchLeave: true
            };
            containerElement.swipe(options);
            containerElement.swipe('enable');
        }

        $(activeTextInstance).on(ActiveText.Events.RESIZE, onWindowResize);
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, onPageChange);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(activeTextInstance).off(ActiveText.Events.RESIZE, onWindowResize);
            $(activeTextInstance).off(ActiveText.Commands.GO_TO_PAGE, onPageChange);
            $(activeTextInstance.options.containerElement).off('remove', teardown);
            deregister();
            containerElement = undefined;
        }
    }

    function removeSwipeDetection() {
        /**
         * @type {boolean}
         */
        var containerElementIsDefined = containerElement !== undefined;
        /**
         * @type {boolean}
         */
        var jQueryTouchSwipeIsAvailable = typeof($.fn.swipe) === 'function';

        if(containerElementIsDefined && jQueryTouchSwipeIsAvailable) {
            containerElement.swipe('disable');
        }
    }

    function preventMomentumScrollOnElements(containerElement) {
        if(activeTextInstance.utils.isFullWindowScalingMode()) {
            containerElement = $(document.body);
        }

        $(containerElement).on('touchmove', function(e) {
            if(!$(e.target).parents('.scrollable').length) {
                e.preventDefault();
            }
        });
    }

    function register(parent) {
        containerElement = parent;
        preventMomentumScrollOnElements(containerElement);
        _.once(setupSwipeDetection)();

    }

    function deregister() {
        removeSwipeDetection();
    }

    return {
        register: register,
        deregister: deregister
    };
};