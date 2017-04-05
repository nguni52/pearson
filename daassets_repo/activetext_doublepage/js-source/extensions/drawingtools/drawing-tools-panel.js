/* global ActiveText */
ActiveText.namespace('ActiveText.UI.DrawingToolsPanel');
ActiveText.UI.DrawingToolsPanel = function() {
    'use strict';

    var toolPanelRef;

    /**
     * @type {ActiveText.UI.DrawingToolsPanelFactory}
     */
    var factory;

    /**
     * @type {ActiveText.DrawingTools}
     */
    var drawingToolsInstance;

    var options;

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_COLOUR_CODE = '#0000CD';

    /**
     * @const
     * @type {Array}
     */
    var DEFAULT_COLOURS_PALETTE = ['000000',
                                   'FFFFFF',
                                   '0000CD',
                                   'FF0000',
                                   '008000',
                                   'FF4500',
                                   'FF69B4',
                                   'ADFF2F',
                                   'FFFF00',
                                   '00BFFF'];

    /**
     * @type {Array}
     */
    var activePages;

    function getDefaultColour() {
        var rtn = DEFAULT_COLOUR_CODE;

        if(toolPanelRef) {
            var existingValue = toolPanelRef.find('.colorPicker-picker').css('background-color');
            var existingColour = ActiveText.ColourUtils.convertRGBToHex(existingValue);
            if(existingValue && existingColour) {
                rtn = existingColour;
            }
        }
        return rtn;
    }

    function onPageChange(event, data) {
        if(drawingToolsInstance) {
            var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
            for(var i = 0, l = activePages.length; i < l; i++) {
                drawingToolsInstance.disable(activePages[i]);
                drawingToolsInstance.enable(pages[i]);
            }
            activePages = pages;
        }
    }

    function createToolPanel() {
        var containerElement = activeTextInstance.options.containerElement;
        var existingWidth = containerElement.width() - 268;
        var existingHeight = containerElement.height();

        if(containerElement.find('.controls-bar')) {
            existingHeight -= containerElement.find('.controls-bar').height();
        }

        var panelTemplate = factory.panelTemplate;

        var newPanel = $(panelTemplate).css({
            position: 'absolute',
            top: (existingHeight - 54),
            left: (existingWidth / 2),
            zIndex: 2000,
            opacity: 0
        }).appendTo(containerElement);

        newPanel.find('.gripper').css({
            position: 'absolute',
            left: 4,
            top: 4,
            bottom: 4,
            width: 20,
            cursor: 'move'
        });

        newPanel.draggable({
            containment: containerElement,
            drag: function() {
                $(this).find('#colourpicker-tool').colorPicker.hidePalette();
            }
        });

        newPanel.find('#colourpicker-tool').colorPicker({
            pickerDefault: getDefaultColour(),
            colors: DEFAULT_COLOURS_PALETTE,
            onColorChange: function(id, newValue) {
                drawingToolsInstance.setActiveColour(newValue);
            }
        });

        newPanel.animate({
            top: (existingHeight - 64),
            opacity: 1
        }, 300);

        $(activeTextInstance).off(ActiveText.Events.RESIZE, onResize).on(ActiveText.Events.RESIZE, onResize);
    }

    function showToolPanel() {
        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, onPageChange);

        if(activeTextInstance.view.disableInteraction !== undefined) {
            activeTextInstance.view.disableInteraction();
        }

        if(hasToolPanel()) {
            getToolPanel().fadeIn();
        }
        else {
            createToolPanel();
        }

        drawingToolsInstance = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'drawingtools');
        if(drawingToolsInstance) {
            var defaultColour = getDefaultColour();
            drawingToolsInstance.setActiveColour(defaultColour);

            var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
            for(var i = 0, l = pages.length; i < l; i++) {
                drawingToolsInstance.enable(pages[i]);
            }
            activePages = pages;

            attachEvents();
            activeTextInstance.options.containerElement.find('button.pen-tool').click();
        }
    }

    function hideToolPanel() {
        $(activeTextInstance).off(ActiveText.Commands.GO_TO_PAGE, onPageChange);

        if(activeTextInstance.view.enableInteraction !== undefined) {
            activeTextInstance.view.enableInteraction();
        }

        getToolPanel().fadeOut();

        if(drawingToolsInstance) {
            var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);

            var i, l;
            for(i = 0, l = pages.length; i < l; i++) {
                drawingToolsInstance.disable(pages[i]);
            }

            for(i = 0, l = activePages.length; i < l; i++) {
                drawingToolsInstance.disable(activePages[i]);
            }
        }
    }

    function getToolPanel() {
        if(!toolPanelRef || toolPanelRef.length === 0) {
            toolPanelRef = activeTextInstance.options.containerElement.find('.iwbToolsPanel');
        }
        return toolPanelRef;
    }

    function hasToolPanel() {
        return activeTextInstance.options.containerElement.find('.iwbToolsPanel').length > 0;
    }

    function penToolClickHandler() {
        var toolPanel = getToolPanel();
        toolPanel.find('button.pen-tool').addClass('active');
        toolPanel.find('button.highlighter-tool').removeClass('active');
        toolPanel.find('button.eraser-tool').removeClass('active');
        toolPanel.find('button.clear-tool').removeClass('active');
        drawingToolsInstance.setCurrentTool('pen');
    }

    function highlighterToolClickHandler() {
        var toolPanel = getToolPanel();
        toolPanel.find('button.pen-tool').removeClass('active');
        toolPanel.find('button.highlighter-tool').addClass('active');
        toolPanel.find('button.eraser-tool').removeClass('active');
        toolPanel.find('button.clear-tool').removeClass('active');
        drawingToolsInstance.setCurrentTool('highlighter');
    }

    function eraserToolClickHandler() {
        var toolPanel = getToolPanel();
        toolPanel.find('button.pen-tool').removeClass('active');
        toolPanel.find('button.highlighter-tool').removeClass('active');
        toolPanel.find('button.eraser-tool').addClass('active');
        toolPanel.find('button.clear-tool').removeClass('active');
        drawingToolsInstance.setCurrentTool('eraser');
    }

    function clearScreenToolClickHandler() {
        var toolPanel = getToolPanel();
        toolPanel.find('button.pen-tool').removeClass('active');
        toolPanel.find('button.highlighter-tool').removeClass('active');
        toolPanel.find('button.eraser-tool').removeClass('active');
        toolPanel.find('button.clear-tool').addClass('active');

        var pages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
        for(var i = 0, l = pages.length; i < l; i++) {
            drawingToolsInstance.clearDrawings(pages[i]);
        }
    }

    function attachEvents() {
        var toolPanel = getToolPanel();
        toolPanel.find('button.pen-tool').on('click', penToolClickHandler);
        toolPanel.find('button.highlighter-tool').on('click', highlighterToolClickHandler);
        toolPanel.find('button.eraser-tool').on('click', eraserToolClickHandler);
        toolPanel.find('button.clear-tool').on('click', clearScreenToolClickHandler);
    }

    function keepWithinVisibleBounds(toolPanel) {
        var dimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
        var toolPanelLeft = parseInt(toolPanel.css('left'), 10);
        var toolPanelTop = parseInt(toolPanel.css('top'), 10);
        var toolPanelWidth = toolPanel.outerWidth();
        var toolPanelHeight = toolPanel.outerHeight();
        var containerHeight = dimensions.availHeight;
        var containerWidth = dimensions.availWidth;

        if(toolPanelLeft < 0) {
            toolPanel.css('left', 0);
        }

        if((toolPanelLeft + toolPanelWidth) > containerWidth) {
            toolPanel.css('left', (containerWidth - toolPanelWidth));
        }

        if(toolPanelTop < 0) {
            toolPanel.css('top', 0);
        }

        if((toolPanelTop + toolPanelHeight) > containerHeight) {
            toolPanel.css('top', (containerHeight - toolPanelHeight));
        }
    }

    function onResize() {
        var toolPanel = getToolPanel();
        keepWithinVisibleBounds(toolPanel);
    }

    function init(initOptions) {
        options = initOptions;
        factory = new ActiveText.UI.DrawingToolsPanelFactory();

        if(options) {
            if(options.activeTextInstance) {
                activeTextInstance = options.activeTextInstance;
            }

            ActiveText.CSSUtils.embedCSS(ActiveText.UI.DrawingToolsPanel.Style);
        }
    }

    return {
        init: init,
        showToolPanel: showToolPanel,
        hideToolPanel: hideToolPanel
    };
};