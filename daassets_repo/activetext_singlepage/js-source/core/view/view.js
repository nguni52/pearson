/* global ActiveText, requestAnimationFrame */
/**
 * @class View
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{getAllReaders: getReaderElements, init: init, getIFrames: getIFrames, getAnimator: getAnimator, getContainer: getContainer, disableInteraction: disableInteraction, enableInteraction: enableInteraction, getOverlayElements: getOverlayElements, getEdgeFactory: getEdgeFactory}}
 * @constructor
 */
ActiveText.View = function(activeTextInstance) {
    'use strict';

    /**
     * @type {jQuery|object}
     */
    var whiteboardContainer;

    /**
     * @type {jQuery|object}
     */
    var whiteboardCache;

    var loadingVisController;

    var zoomController;

    var edgeFactory;

    var iframes, animator;

    var resizeController;

    /**
     * @type {ActiveText.Interaction.SwipeGesture}
     */
    var swipeInteractionController;

    function setupPageAnimator() {
        animator = new ActiveText.Animators.SlideAnimation(activeTextInstance);
        //            var slideAnimation = new FlipAnimationDecorator();
        animator.register();
    }

    function init() {
        iframes = [];

        var jQActiveTextInstance = $(activeTextInstance);
        jQActiveTextInstance.one(ActiveText.Commands.INIT_WHITEBOARD, initWhiteboard);
        jQActiveTextInstance.on(ActiveText.Commands.FRAME_CONTENT_ERROR, addErrorMessageToFrame);

        var viewController = new ActiveText.View.Controller(activeTextInstance);
        viewController.init();

        setupPageAnimator();

        loadingVisController = new ActiveText.View.Loader(activeTextInstance);

        zoomController = new ActiveText.ZoomController(activeTextInstance);

        swipeInteractionController = new ActiveText.Interaction.SwipeGesture(activeTextInstance);

        var messages = new ActiveText.ErrorMessages(activeTextInstance);
        messages.init();

        var debouncedResize = _.debounce(onWindowResize, 100);

        api.model = new ActiveText.View.Model(activeTextInstance);

        function onWindowResize(e) {
            $(activeTextInstance).trigger(ActiveText.Events.RESIZE);
        }

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(window, window.top).on('resize', debouncedResize);
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(activeTextInstance.options.containerElement).off('remove', teardown);
            $(window, window.top).off('resize', debouncedResize);
            //        removeWindowResizeListeners();
            whiteboardContainer = undefined;
            whiteboardCache = undefined;
        }
    }

    function initWhiteboard() {
        var container = getContainerElement();
        if(container) {
            if(activeTextInstance.behaviours.shouldGeneratePageEdges()) {
                edgeFactory = new ActiveText.MinimalPageEdgeFactory(activeTextInstance);
            }

            whiteboardContainer = ActiveText.ViewFactory.initialiseWhiteboard(activeTextInstance, container);

            if(activeTextInstance.behaviours.shouldGeneratePageEdges()) {
                enableInteraction();
            }

            resizeController = new ActiveText.View.Resize(activeTextInstance);
            resizeController.init(whiteboardContainer);
            resizeController.register();

            var whiteboard = getContainer();
            if(edgeFactory) {
                edgeFactory.generateEdges(whiteboard);
            }

            loadingVisController.register(whiteboard);
            zoomController.register();

            activeTextInstance.options.containerElement.css({
                overflow: 'hidden',
                transform: 'translateZ(0)' // this fixes background redraw issues on the iPad.
            }).addClass('activetext');

            if(activeTextInstance.utils.isFullWindowScalingMode()) {
                activeTextInstance.options.containerElement.css({
                    position: 'fixed',
                    width: '100%',
                    height: '100%'
                });
                //                $('body').attr("role", "document").css('overflow', 'hidden');
                $('body').css('overflow', 'hidden');
                // overflow hidden stops things like tooltips from creating scrollbars
            } else {
                activeTextInstance.options.containerElement.attr("role", "document");
            }

            whiteboardContainer.on('remove', zoomController.deregister);
            whiteboardContainer.on('remove', loadingVisController.deregister);
            whiteboardContainer.on('remove', resizeController.deregister);
            whiteboardContainer.on('remove', animator.deregister);

            enableInteraction();
        }
        $(activeTextInstance).trigger(ActiveText.Commands.LOAD_RESOURCES);
    }

    function getIFrames() {
        return iframes;
    }

    function addErrorMessageToFrame(event, data) {
        var index = data.index;
        var frame = ActiveText.ViewUtils.getFrameForPageByIndex(activeTextInstance, index);
        if(frame) {
            frame.addClass('errorPage').css({
                background: activeTextInstance.theme.getBackgroundColor()
            });
        }
    }

    function enableInteraction() {
        var container = getContainer();
        swipeInteractionController.register(container);
        whiteboardContainer.find('.leftEdge, .rightEdge').show();
    }

    function disableInteraction() {
        var container = getContainer();
        swipeInteractionController.deregister(container);
        whiteboardContainer.find('.leftEdge, .rightEdge').hide();
    }

    function getContainerElement() {
        return (activeTextInstance.options) ? activeTextInstance.options.containerElement : undefined;
    }

    function getContainer() {
        if(!whiteboardCache && getContainerElement()) {
            whiteboardCache = getContainerElement().find('.whiteboard');
        }
        return whiteboardCache;
    }

    function getReaderElements() {
        var whiteboard = getContainer();
        return whiteboard.find('div.dps-container');
    }

    function getOverlayElements() {
        var whiteboard = getContainer();
        return whiteboard.find('div.dps-container > div > div').not('.iframe');
    }

    function getAnimator() {
        return animator;
    }

    function getEdgeFactory() {
        return edgeFactory;
    }

    var api = {
        getAllReaders: getReaderElements,
        init: init,
        getIFrames: getIFrames,
        getAnimator: getAnimator,
        getContainer: getContainer,
        disableInteraction: disableInteraction,
        enableInteraction: enableInteraction,
        getOverlayElements: getOverlayElements,
        getEdgeFactory: getEdgeFactory
    };
    return  api;
};
