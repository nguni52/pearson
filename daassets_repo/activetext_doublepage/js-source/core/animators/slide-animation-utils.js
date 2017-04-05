/* global ActiveText, namespace */
ActiveText.namespace('ActiveText.Animators.SlideAnimation.Utils');
/**
 * @class Utils
 * @memberOf ActiveText.Animators.SlideAnimation
 * @param activeTextInstance {ActiveText}
 * @type {{calculateInitialAnimationPositions: calculateInitialAnimationPositions, calculateFinalAnimationPositions: calculateFinalAnimationPositions, shouldAnimateBetweenPages: shouldAnimateBetweenPages}}
 * @constructor
 */
ActiveText.Animators.SlideAnimation.Utils = function(activeTextInstance) {
    'use strict';

    function calculateSinglePageInitialPosition(direction, dpsWidth, sameDPS, toPage) {
        var rtn = getDefaultReturnObject();
        if(direction === 'left') {
            if(sameDPS) {
                rtn.current.left = 0;
            } else {
                rtn.current.left = dpsWidth / 2;
            }
        } else if(direction === 'right') {
            if(sameDPS) {
                rtn.current.left = -dpsWidth / 2;
            } else {
                rtn.current.left = -dpsWidth;
            }
        }
        //        else
        //        {
        //            if(ActiveText.NavigationUtils.isLeftPage(activeTextInstance, toPage))
        //            {
        //                rtn.current.left -= dpsWidth;
        //            }
        //            else
        //            {
        //                rtn.current.left -= 0;
        //            }
        //        }

        rtn.previous.left = rtn.current.left - (dpsWidth);
        rtn.next.left = rtn.current.left + (dpsWidth);
        //
        return rtn;
    }

    function calculateDoublePageInitialPosition(direction, dpsWidth) {
        var rtn = {
            current: {
                left: 0
            },
            next: {
                left: 0
            },
            previous: {
                left: 0
            }
        };

        if(direction === 'left') {
            rtn.current.left = dpsWidth;
            rtn.next.left = (dpsWidth * 2);
            rtn.previous.left = 0;
        } else if(direction === 'right') {
            rtn.current.left = (-dpsWidth);
            rtn.next.left = 0;
            rtn.previous.left = (-dpsWidth * 2);
        }
        return rtn;
    }

    /**
     * @param dpsWidth {number}
     * @param fromPage {number}
     * @param toPage {number}
     * @return {object}
     */
    function calculateInitialAnimationPositions(dpsWidth, fromPage, toPage) {
        var rtn;
        var direction = calculateAnimationDirection(activeTextInstance, fromPage, toPage);
        var isSinglePageView = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
        if(isSinglePageView) {
            var sameDPS = ActiveText.ViewUtils.pagesArePartOfTheSameDPS(activeTextInstance, fromPage, toPage);
            rtn = calculateSinglePageInitialPosition(direction, dpsWidth, sameDPS, toPage);
        } else {
            rtn = calculateDoublePageInitialPosition(direction, dpsWidth);
        }
        return rtn;
    }

    function calculateAnimationDirection(activeTextInstance, from, to) {
        if(from === to) {
            return 'none';
        } else if(from < to) {
            return 'left';
        } else {
            return 'right';
        }
    }

    function getDefaultReturnObject() {
        return {
            current: {
                left: 0
            },
            next: {
                left: 0
            },
            previous: {
                left: 0
            }
        };
    }

    function calculateSinglePageFinalPosition(dpsWidth, fromPage, toPage) {
        var isLeftPage = ActiveText.NavigationUtils.isLeftPage(activeTextInstance, toPage);
        var rtn = getDefaultReturnObject();

        function setLeftPosition() {
            rtn.current.left = 0;
        }

        function setRightPosition() {
            //            var startsLeft = activeTextInstance.settings.getFirstPageIsLeft();
            //            if(startsLeft)
            //            {
            //                rtn.current.left = -dpsWidth;
            //            }
            //            else
            //            {
            rtn.current.left = -dpsWidth / 2;
            //            }
        }

        if(isLeftPage) {
            setLeftPosition();
        } else {
            setRightPosition();
        }

        rtn.previous.left = rtn.current.left - (dpsWidth * 2);
        rtn.next.left = rtn.current.left + (dpsWidth * 2);

        return rtn;
    }

    /**
     * @param dpsWidth {number}
     * @param fromPage {number}
     * @param toPage {number}
     * @return {object}
     */
    function calculateFinalAnimationPositions(dpsWidth, fromPage, toPage) {
        var rtn = {
            current: {
                left: 0
            },
            next: {
                left: dpsWidth
            },
            previous: {
                left: -dpsWidth
            }
        };

        var isSinglePageView = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
        if(isSinglePageView) {
            rtn = calculateSinglePageFinalPosition(dpsWidth, fromPage, toPage);
        }
        return rtn;
    }

    function shouldAnimateBetweenPages(options) {
        var allowAnimation = true;
        if(activeTextInstance && activeTextInstance.options &&
            activeTextInstance.options.allowAnimation !== undefined) {
            allowAnimation = activeTextInstance.options.allowAnimation;
        }
        var isOldVersionOfIE = ($.browser.msie && $.browser.version < 10);
        var isOnTheSameDPS = Math.abs(options.fromPage - options.toPage) < 3;
        var isInSinglePageView = false;
        try {
            isInSinglePageView = ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
        }
        catch(e) {
            // for unit test weirdness.
        }
        return !isInSinglePageView && isOnTheSameDPS && !isOldVersionOfIE && allowAnimation;
    }

    return {
        calculateInitialAnimationPositions: calculateInitialAnimationPositions,
        calculateFinalAnimationPositions: calculateFinalAnimationPositions,
        shouldAnimateBetweenPages: shouldAnimateBetweenPages
    };
};