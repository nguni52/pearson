/* global ActiveText */
ActiveText.namespace('ActiveText.ColourUtils');
ActiveText.ColourUtils = (function() {
    'use strict';

    function convertHexToRGB(hex, opacity) {
        var rgbColours,
            rgbValue;

        if(typeof(hex) !== 'string' || !/#?[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3}/.test(hex)) {
            return false;
        }

        hex = hex.replace('#', '');

        if(hex.length === 6) {
            rgbColours = hex.match(/(.{2})/g);
        } else if(hex.length === 3) {
            rgbColours = hex.match(/(.{1})/g);
        } else {
            return false;
        }

        var i = 3;
        while(i--) {
            rgbValue = rgbColours[i];
            if(rgbValue.length === 1) {
                rgbValue += rgbValue;
            }
            rgbColours[i] = parseInt(rgbValue, 16);
        }

        if(typeof(opacity) === 'undefined') {
            return 'rgb(' + rgbColours.join(', ') + ')';
        }
        return 'rgba(' + rgbColours.join(', ') + ', ' + opacity + ')';
    }

    function convertRGBToHex(rgb) {
        var rgbArray = rgb.toString().match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return ('0' + parseInt(x, 10).toString(16)).slice(-2).toUpperCase();
        }

        if(rgbArray && $.isArray(rgbArray) && rgbArray.length > 3) {
            return '#' + hex(rgbArray[1]) + hex(rgbArray[2]) + hex(rgbArray[3]);
        } else {
            return false;
        }
    }

    return {
        convertHexToRGB: convertHexToRGB,
        convertRGBToHex: convertRGBToHex
    };
})();

var convertHexToRGB = (function() {
    'use strict';

    return function(hex, opacity) {
        var rgb = hex.replace('#', '').match(/(.{2})/g);

        var i = 3;
        while(i--) {
            rgb[i] = parseInt(rgb[i], 16);
        }

        if(typeof(opacity) === 'undefined') {
            return 'rgb(' + rgb.join(', ') + ')';
        }
        return 'rgba(' + rgb.join(', ') + ', ' + opacity + ')';
    };
})();