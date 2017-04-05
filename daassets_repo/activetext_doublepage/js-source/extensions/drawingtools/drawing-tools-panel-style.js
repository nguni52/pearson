/* global ActiveText */
/**
 * @class Style
 * @memberOf ActiveText.UI.DrawingToolsPanel
 * @type string
 */
ActiveText.UI.DrawingToolsPanel.Style = (function(ActiveText) {
    "use strict";

    var pathToResources = ActiveText.SkinUtils.getPathToGlobalResource();
    var buttonBackgroundHoverColour = "#434343";
    var buttonBackgroundColour = "#707070";
    var buttonWidth = 44;
    return "div.iwbToolsPanel{" +
        "position:absolute;" +
        "padding:4px 4px 4px 36px;" +
        "background:white url('" + pathToResources + "img/gripper.png') 5px 5px no-repeat;" +
        "border:1px solid #a0a0a0;" +
        "width:226px;" +
        "-webkit-border-radius:3px;" +
        "-moz-border-radius:3px;" +
        "border-radius:3px;" +
        "cursor:pointer;" +
        "-webkit-user-select:none;" +
        "-moz-user-select:none;" +
        "-ms-user-select:none;" +
        "-o-user-select:none;" +
        "user-select:none;" +
        "-webkit-box-shadow:0 1px 5px rgba(0, 0, 0, 0.5);" +
        "-moz-box-shadow:0 1px 5px rgba(0, 0, 0, 0.5);" +
        "box-shadow:0 1px 5px rgba(0, 0, 0, 0.5);" +
        "-webkit-box-sizing:content-box;" +
        "-moz-box-sizing:content-box;" +
        "box-sizing:content-box;" +
        "}" +
        "div.iwbToolsPanel button.btn{" +
        "display:inline-block;" +
        "text-align:center;" +
        "vertical-align:middle;" +
        "border:1px solid #ccc;" +
        "cursor:pointer;" +
        "width:" + buttonWidth + "px;" +
        "height:" + buttonWidth + "px;" +
        "padding:0;" +
        "margin:0 0 0 1px;" +
        "background-color:" + buttonBackgroundColour + ";" +
        "background-image:-moz-linear-gradient(top, " + buttonBackgroundColour + ", " + buttonBackgroundColour + ");" +
        "background-image:-ms-linear-gradient(top, " + buttonBackgroundColour + ", " + buttonBackgroundColour + ");" +
        "background-image:-webkit-gradient(linear, 0 0, 0 100%, from(" + buttonBackgroundColour + "), to(" +
        buttonBackgroundColour + "));" +
        "background-image:-webkit-linear-gradient(top, " + buttonBackgroundColour + ", " + buttonBackgroundColour +
        ");" +
        "background-image:-o-linear-gradient(top, " + buttonBackgroundColour + ", " + buttonBackgroundColour + ");" +
        "background-image:linear-gradient(top, " + buttonBackgroundColour + ", " + buttonBackgroundColour + ");" +
        "background-repeat:repeat-x;" +
        "border-color:" + buttonBackgroundColour + " " + buttonBackgroundColour + " #4a4a4a;" +
        "border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);" +
        "filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);" +
        "-webkit-border-radius:0;" +
        "-moz-border-radius:0;" +
        "border-radius:0;" +
        "overflow:hidden;" +
        "color:white;" +
        "text-shadow:0px 1px 0px rgba(0, 0, 0, 0.4);" +
        "font-size:13px;" +
        "line-height:18px;" +
        "}" +
        "div.iwbToolsPanel button.btn:hover, div.iwbToolsPanel button.btn:active, div.iwbToolsPanel button.btn.active, div.iwbToolsPanel button.btn.disabled, div.iwbToolsPanel button.btn[disabled]{" +
        "background-color:" + buttonBackgroundColour + ";" +
        "}" +
        "div.iwbToolsPanel button.btn:active, div.iwbToolsPanel button.btn.active{" +
        "background-color:#575757 \\9;" +
        "}" +
        "div.iwbToolsPanel button.btn:hover, div.iwbToolsPanel button.btn.hover{" +
        "background-color:" + buttonBackgroundHoverColour + ";" +
        "background-image:-moz-linear-gradient(top, " + buttonBackgroundHoverColour + ", " +
        buttonBackgroundHoverColour + ");" +
        "background-image:-ms-linear-gradient(top, " + buttonBackgroundHoverColour + ", " +
        buttonBackgroundHoverColour + ");" +
        "background-image:-webkit-gradient(linear, 0 0, 0 100%, from(" + buttonBackgroundHoverColour + "), to(" +
        buttonBackgroundHoverColour + "));" +
        "background-image:-webkit-linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour +
        ");" +
        "background-image:-o-linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-image:linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-repeat:repeat-x;" +
        "border-color:" + buttonBackgroundHoverColour + " " + buttonBackgroundHoverColour + " #1d1d1d;" +
        "border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);" +
        "filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);" +
        "background-position:0 0;" +
        "}" +
        "div.iwbToolsPanel button.btn:hover:hover, div.iwbToolsPanel button.btn:hover:active, div.iwbToolsPanel button.btn:hover.active, div.iwbToolsPanel button.btn:hover.disabled, div.iwbToolsPanel button.btn:hover[disabled], div.iwbToolsPanel button.btn.hover:hover, div.iwbToolsPanel button.btn.hover:active, div.iwbToolsPanel button.btn.hover.active, div.iwbToolsPanel button.btn.hover.disabled, div.iwbToolsPanel button.btn.hover[disabled]{" +
        "background-color:" + buttonBackgroundHoverColour + ";" +
        "}" +
        "div.iwbToolsPanel button.btn:hover:active, div.iwbToolsPanel button.btn:hover.active, div.iwbToolsPanel button.btn.hover:active, div.iwbToolsPanel button.btn.hover.active{" +
        "background-color:#2a2a2a \\9;" +
        "}" +
        "div.iwbToolsPanel button.btn:active, div.iwbToolsPanel button.btn.active{" +
        "background-color:" + buttonBackgroundHoverColour + ";" +
        "background-image:-moz-linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-image:-ms-linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-image:-webkit-gradient(linear, 0 0, 0 100%, from(" + buttonBackgroundHoverColour + "), to(" + buttonBackgroundHoverColour + "));" +
        "background-image:-webkit-linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-image:-o-linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-image:linear-gradient(top, " + buttonBackgroundHoverColour + ", " + buttonBackgroundHoverColour + ");" +
        "background-repeat:repeat-x;" +
        "border-color:" + buttonBackgroundHoverColour + " " + buttonBackgroundHoverColour + " #1d1d1d;" +
        "border-color:rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);" +
        "filter:progid:DXImageTransform.Microsoft.gradient(enabled = false); }" +
        "div.iwbToolsPanel button.btn:active:hover, div.iwbToolsPanel button.btn:active:active, div.iwbToolsPanel button.btn:active.active, div.iwbToolsPanel button.btn:active.disabled, div.iwbToolsPanel button.btn:active[disabled], div.iwbToolsPanel button.btn.active:hover, div.iwbToolsPanel button.btn.active:active, div.iwbToolsPanel button.btn.active.active, div.iwbToolsPanel button.btn.active.disabled, div.iwbToolsPanel button.btn.active[disabled]{" +
        "background-color:" + buttonBackgroundHoverColour + ";" +
        "}" +
        "div.iwbToolsPanel button.btn:active:active, div.iwbToolsPanel button.btn:active.active, div.iwbToolsPanel button.btn.active:active, div.iwbToolsPanel button.btn.active.active{" +
        "background-color:#2a2a2a \\9;" +
        "}" +
        "div.iwbToolsPanel button.btn i{" +
        "display:block; }" +
        "div.iwbToolsPanel button.btn i.pen-tool{" +
        "width:" + buttonWidth + "px;" +
        "height:" + buttonWidth + "px;" +
        "background:transparent url('" + pathToResources + "img/pen-tool.png') center center no-repeat; }" +
        "div.iwbToolsPanel button.btn i.highlighter-tool{" +
        "width:" + buttonWidth + "px;" +
        "height:" + buttonWidth + "px;" +
        "background:transparent url('" + pathToResources +
        "img/highlighter-tool.png') center center no-repeat;" +
        "}" +
        "div.iwbToolsPanel button.btn i.eraser-tool{" +
        "width:" + buttonWidth + "px;" +
        "height:" + buttonWidth + "px;" +
        "background:transparent url('" + pathToResources + "img/eraser-tool.png') center center no-repeat;" +
        "}" +
        "div.colorPicker-picker{" +
        "height:" + buttonWidth + "px;" +
        "width:" + buttonWidth + "px;" +
        "padding:0;" +
        "margin:0 0 0 2px;" +
        "background:url(" + pathToResources + "img/colour-picker/arrow.gif) no-repeat bottom right;" +
        "cursor:pointer;" +
        "display:inline-block;" +
        "-webkit-box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.3);" +
        "-moz-box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.3);" +
        "box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.3);" +
        "vertical-align:top;" +
        "}" +
        "div.colorPicker-picker.active{" +
        "background-image:url(" + pathToResources + "img/colour-picker/arrow-active.gif);" +
        "}" +
        "div.colorPicker-palette{" +
        "width:240px;" +
        "position:absolute;" +
        "background:white;" +
        "border:1px solid #a0a0a0;" +
        "-webkit-border-radius:3px;" +
        "-moz-border-radius:3px;" +
        "border-radius:3px;" +
        "-webkit-box-shadow:0 1px 5px rgba(0, 0, 0, 0.5);" +
        "-moz-box-shadow:0 1px 5px rgba(0, 0, 0, 0.5);" +
        "box-shadow:0 1px 5px rgba(0, 0, 0, 0.5);" +
        "padding:2px;" +
        "z-index:9999;" +
        "}" +
        "div.colorPicker_hexWrap{" +
        "width:100%;" +
        "float:left;" +
        "display:none;" +
        "}" +
        "div.colorPicker-swatch{" +
        "height:" + buttonWidth + "px;" +
        "width:" + buttonWidth + "px;" +
        "margin:2px;" +
        "float:left;" +
        "cursor:pointer;" +
        "-webkit-box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.3);" +
        "-moz-box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.3);" +
        "box-shadow:inset 0 1px 5px rgba(0, 0, 0, 0.3);" +
        "-webkit-transition:all .2s ease-in-out;" +
        "}" +
        "div.colorPicker-swatch:hover{" +
        "-webkit-transform:scale(1.1);" +
        "-webkit-box-shadow:0 1px 3px rgba(0, 0, 0, 0.3);" +
        "-moz-box-shadow:0 1px 3px rgba(0, 0, 0, 0.3);" +
        "box-shadow:0 1px 3px rgba(0, 0, 0, 0.3);" +
        "}" +
        ".canvas-container{" +
        "position:absolute;" +
        "z-index:1010;" +
        "top:0;" +
        "left:0;" +
        "bottom:0;" +
        "right:0;" +
        "background:transparent;" +
        "filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#01000000,endColorstr=#01000000);" +
        "background:rgba(0,0,0,0);" +
        "zoom:1" +
        "}";
})(ActiveText);
