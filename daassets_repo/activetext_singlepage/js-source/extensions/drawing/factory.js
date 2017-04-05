/* global ActiveText, Modernizr */
/**
 * @class Factory
 * @memberOf ActiveText.DrawingTools
 * @type {{createCanvas:function}}
 */
ActiveText.DrawingTools.Factory = (function() {
    'use strict';

    function createCanvasElementForContainer() {
        var canvas = document.createElement('canvas');
        canvas.setAttribute('class', 'canvas');
        canvas.setAttribute('style', 'position:absolute;left:0;top:0');
        return canvas;
    }

    return {
        createCanvas: createCanvasElementForContainer
    };
})();