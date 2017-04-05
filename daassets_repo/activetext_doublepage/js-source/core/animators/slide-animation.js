/* global ActiveText, requestAnimationFrame */
ActiveText.Animators = ActiveText.Animators || {};
/**
 * @class Animators
 * @memberOf ActiveText.Animators
 * @param activeTextInstance {ActiveText}
 * @returns {{register: register, fixPagePositions: fixPagePositions}}
 * @constructor
 */
ActiveText.Animators.SlideAnimation = function(activeTextInstance) {
    'use strict';

    /**
     * @type {ActiveText.Animators.SlideAnimation.Utils}
     */
    var utils;

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_ANIMATION_SPEED = 1000;

    var whiteboard;

    var animateContainer;

    /**
     * @type {boolean}
     */
    var isAnimating = false;

    function register() {
        utils = new ActiveText.Animators.SlideAnimation.Utils(activeTextInstance);

        var signalBus = $(activeTextInstance);
        signalBus.on(ActiveText.Commands.GO_TO_PAGE, animatePageSlide);
        signalBus.one(ActiveText.Commands.INIT_WHITEBOARD, safeStartup);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }
    }

    function teardown() {
        $(activeTextInstance.options.containerElement).off('remove', teardown);
        $(activeTextInstance).off(ActiveText.Commands.GO_TO_PAGE, animatePageSlide);
    }

    function safeStartup() {
        animateContainer = $("<div class='animate-container' style='position:relative'></div>");
        whiteboard = activeTextInstance.view.getContainer();
        animateContainer.appendTo(whiteboard);
    }

    /**
     * @param options
     */
    function stopCurrentAnimations(options) {
        var oldPage = ActiveText.ViewUtils.getDPSByFrameIndex(activeTextInstance, options.fromPage);
        var newPage = ActiveText.ViewUtils.getDPSByFrameIndex(activeTextInstance, options.toPage);
        if(oldPage) {
            oldPage.stop(true, false);
        }
        if(newPage) {
            newPage.stop(true, false);
        }
    }

    function hideLoaderWhenContentLoaded(event, data) {
        $(activeTextInstance).trigger(ActiveText.Commands.HIDE_LOADER);
    }

    /**
     * Sends out an event which notifies other classes that they need to load the resources
     * for the current index (the value of which will already have been changed)
     *
     * @private
     */
    function beginLoadingNewContent(options) {
        $(activeTextInstance).trigger(ActiveText.Commands.LOAD_PAGES_AT_INDEX, [options.toPage]);

        $(activeTextInstance).off(ActiveText.Events.FRAME_CONTENT_LOADED, hideLoaderWhenContentLoaded).on(ActiveText.Events.FRAME_CONTENT_LOADED, hideLoaderWhenContentLoaded);
    }

    /**
     * @param options
     */
    function destroyUnusedFrames(options) {
        var currentReader = ActiveText.ViewUtils.getCurrentReader(activeTextInstance);
        var nextReader = ActiveText.ViewUtils.getNextReader(activeTextInstance);
        var prevReader = ActiveText.ViewUtils.getPrevReader(activeTextInstance);
        var visiblePages = $(nextReader).add(currentReader).add(prevReader);
        visiblePages.css({
            display: 'block'
        });

        function removeContentsOfNonVisiblePages() {
            activeTextInstance.view.getAllReaders().not(visiblePages).hide().find('.leftPage, .rightPage').empty();
        }

        requestAnimationFrame(removeContentsOfNonVisiblePages);
    }

    /**
     * @param options
     */
    function moveFramesToInitialPositions(options) {
        var readerDPSWidth = activeTextInstance.utils.getReaderDPSWidth();
        var initialPositions = utils.calculateInitialAnimationPositions(readerDPSWidth, options.fromPage, options.toPage);
        var finalPositions = utils.calculateFinalAnimationPositions(readerDPSWidth, options.fromPage, options.toPage);
        var fromReader = ActiveText.ViewUtils.getReaderForPage(activeTextInstance, options.fromPage);
        var currentReader = ActiveText.ViewUtils.getCurrentReader(activeTextInstance);
        var nextReader = ActiveText.ViewUtils.getNextReader(activeTextInstance);
        var prevReader = ActiveText.ViewUtils.getPrevReader(activeTextInstance);
        var currentIndex = activeTextInstance.model.getCurrentIndex();

        if(options.fromPage < (currentIndex - 2)) {
            prevReader = fromReader;
        }
        if(options.fromPage > (currentIndex + 2)) {
            nextReader = fromReader;
        }
        var leftPos;
        var isSinglePageView = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
        var isTheRightHandPage = !ActiveText.NavigationUtils.isLeftPage(activeTextInstance, options.toPage);
        if(currentReader) {
            leftPos = finalPositions.current.left;
            if(isSinglePageView && isTheRightHandPage) {
                //                leftPos += readerDPSWidth;
                leftPos = 0;
            }
            currentReader.css('left', leftPos).show();
            //            currentReader.css('left', 0).show();
        }

        if(nextReader) {
            leftPos = finalPositions.next.left;
            if(isSinglePageView && isTheRightHandPage) {
                //                leftPos += readerDPSWidth;
                leftPos = 0;
            }
            nextReader.css('left', leftPos).show();
            //            nextReader.css('left', 0).show();
        }

        if(prevReader) {
            leftPos = finalPositions.previous.left;
            if(isSinglePageView && isTheRightHandPage) {
                //                leftPos += readerDPSWidth;
                leftPos = 0;
            }
            prevReader.css('left', leftPos).show();
            //            prevReader.css('left', 0).show();
        }

        var allElements = $(currentReader).add(nextReader).add(prevReader);
        allElements.css({display: 'block'});

        var currentChildren = animateContainer.children();
        currentChildren.not(allElements).appendTo(whiteboard);
        allElements.not(currentChildren).appendTo(animateContainer);

        animateContainer.stop(true, false);
        if(options.duration === 0) {
            animateContainer.animate(finalPositions.current, {
                duration: 0
            });
        } else {
            var existingValue = animateContainer.css('left');
            initialPositions.current.left += parseInt(existingValue, 10);
            animateContainer.animate(initialPositions.current, {
                duration: 0
            });
        }
        isAnimating = false;
    }

    /**
     * @param options
     */
    function moveFramesToFinalPositions(options, immediate) {
        var nextReader = ActiveText.ViewUtils.getNextReader(activeTextInstance);
        var prevReader = ActiveText.ViewUtils.getPrevReader(activeTextInstance);
        var containerParent = activeTextInstance.view.getContainer().parent();
        var readerDPSWidth = activeTextInstance.utils.getReaderDPSWidth();
        var finalPositions = utils.calculateFinalAnimationPositions(readerDPSWidth, options.fromPage, options.toPage);

        if(nextReader) {
            nextReader.hide();
        }
        if(prevReader) {
            prevReader.hide();
        }

        function moveElements() {
            if(animateContainer) {
                animateContainer.stop(true, false);
                animateContainer.animate(finalPositions.current, {
                    duration: 0
                });
                isAnimating = false;

                //                if(activeTextInstance.behaviours.shouldAllowOverlappingContent())
                //                {
                //                    containerParent.css({
                //                        overflow: 'visible'
                //                    });
                //                }
                //                else
                //                {
                if(!ActiveText.ViewUtils.isFitToWidthView(activeTextInstance)) {
                    containerParent.css({
                        overflow: 'hidden'
                    });
                }
                //                }

                //                    $(activeTextInstance).trigger(ActiveText.Commands.HIDE_LOADER);
            }
        }

        if(immediate) {
            moveElements();
        } else {
            requestAnimationFrame(moveElements);
        }
    }

    /**
     * @param options
     */
    function runAnimations(options) {
        var finalPositions = utils.calculateFinalAnimationPositions(activeTextInstance.utils.getReaderDPSWidth(), options.fromPage, options.toPage);
        var animationSpeed = (typeof(options.duration) === 'number') ? options.duration : DEFAULT_ANIMATION_SPEED;

        function onAnimationComplete() {
            isAnimating = false;
            $(activeTextInstance).trigger(ActiveText.Events.ANIMATE_PAGE_END);
            moveFramesToFinalPositions(options);
            $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
        }

        animateContainer.stop(true, true).animate(finalPositions.current, {
            duration: animationSpeed,
            easing: 'easeOutExpo',
            complete: onAnimationComplete,
            queue: false
        });
        isAnimating = true;
    }

    function animatePageSlide(e, options) {
        function stopAnimations() {
            stopCurrentAnimations(options);
            beginLoadingNewContent(options);
            destroyUnusedFrames(options);
            moveFramesToInitialPositions(options);

            if(utils.shouldAnimateBetweenPages(options)) {
                requestAnimationFrame(startAnimating);
            } else {
                moveFramesToFinalPositions(options);
            }
        }

        function startAnimating() {
            $(activeTextInstance).trigger(ActiveText.Events.ANIMATE_PAGE_START);
            runAnimations(options);
        }

        activeTextInstance.view.getContainer().parent().css({
            overflow: 'hidden'
        });
        requestAnimationFrame(stopAnimations);
        $(activeTextInstance).trigger(ActiveText.Commands.SHOW_LOADER);
    }

    function fixPagePositions() {
        if(!isAnimating) {
            var currentIndex = activeTextInstance.model.getCurrentIndex();
            moveFramesToFinalPositions({
                toPage: currentIndex,
                fromPage: currentIndex,
                duration: 0
            }, true);
        }
    }

    return {
        register: register,
        fixPagePositions: fixPagePositions
    };
};
