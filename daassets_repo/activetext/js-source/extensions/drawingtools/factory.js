/* globals ActiveText */
/**
 * @class DrawingToolsPanelFactory
 * @memberOf ActiveText.UI
 * @constructor
 */
ActiveText.UI.DrawingToolsPanelFactory = function() {
    "use strict";

    var panelTemplate = '<div class="iwbToolsPanel">';
    panelTemplate += '<div class="gripper"></div>';
    panelTemplate += '<button class="btn pen-tool"><i class="pen-tool"></i>Pen Tool</button>';
    panelTemplate += '<button class="btn highlighter-tool"><i class="highlighter-tool"></i>Highlighter</button>';
    panelTemplate += '<button class="btn eraser-tool"><i class="eraser-tool"></i>Eraser</button>';
    panelTemplate += '<button class="btn clear-tool"><i class="clear-tool"></i>Clear all</button>';
    panelTemplate += '<div id="colourpicker-tool"></div>';
    panelTemplate += '</div>';

    return  {
        panelTemplate: panelTemplate
    };
};