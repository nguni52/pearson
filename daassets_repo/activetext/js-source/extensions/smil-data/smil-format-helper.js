/* global ActiveText */
/**
 * @class SMILFormatHelper
 * @memberOf ActiveText
 * @type {{SMIL_AUDIO_TAG_TEMPLATE:{audioSource:string, clipBegin:string, clipEnd:string, highLightClass:string}, parseTimeCode:parseSMILClockValue, parseSMIL:parseSMIL}}
 */
ActiveText.SMILFormatHelper = (function(ActiveText) {
    'use strict';

    function parseSMILClockValue(value) {
        var hours = 0;
        var mins = 0;
        var secs = 0;

        if(!value) {
            return;
        }

        if(value.indexOf('min') !== -1) {
            mins = parseFloat(value.substr(0, value.indexOf('min')));
        } else if(value.indexOf('ms') !== -1) {
            var ms = parseFloat(value.substr(0, value.indexOf('ms')));
            secs = ms / 1000;
        } else if(value.indexOf('s') !== -1) {
            secs = parseFloat(value.substr(0, value.indexOf('s')));
        } else if(value.indexOf('h') !== -1) {
            hours = parseFloat(value.substr(0, value.indexOf('h')));
        }
        else {
            // parse as hh:mm:ss.fraction
            // this also works for seconds-only, e.g. 12.345
            var arr = value.split(':');
            secs = parseFloat(arr.pop());
            if(arr.length > 0) {
                mins = parseFloat(arr.pop());
                if(arr.length > 0) {
                    hours = parseFloat(arr.pop());
                }
            }
        }
        return (hours * 3600) + (mins * 60) + secs;
    }

    function parseHighlightColourFromNode(node) {
        var rtn;
        var type = node.get(0).getAttribute('epub:type');
        if(type && type.indexOf('highlight-color_' !== -1)) {
            var propertiesAsArray = type.split(' ');
            for(var i = 0, l = propertiesAsArray.length; i < l; i++) {
                var typeName = propertiesAsArray[i];
                var pattern = /^highlight-color_/;
                if(pattern.test(typeName)) {
                    var keyPairs = typeName.split('_');
                    keyPairs.shift();
                    rtn = keyPairs.join('_');
                }
            }
        }
        return rtn;
    }

    function parseCharacterIdFromNode(node) {
        var rtn;
        var type = node.get(0).getAttribute('epub:type');
        if(type && type.indexOf('character_' !== -1)) {
            var propertiesAsArray = type.split(' ');
            for(var i = 0, l = propertiesAsArray.length; i < l; i++) {
                var typeName = propertiesAsArray[i];
                var pattern = /^character_/;
                if(pattern.test(typeName)) {
                    var keyPairs = typeName.split('_');
                    keyPairs.shift();
                    rtn = keyPairs.join('_');
                }
            }
        }
        return rtn;
    }

    function parseSMIL(smilFile) {
        var smil, audioNode, rawSource, selectionClassArray;
        var rtn = [];
        $(smilFile).find('body > seq > par > audio, body > par > audio').each(function() {
            audioNode = $(this);
            rawSource = audioNode.prev().attr('src');
            selectionClassArray = rawSource.split('#');
            smil = {};
            smil.audioSource = audioNode.attr('src');
            smil.clipBegin = ActiveText.SMILFormatHelper.parseTimeCode(audioNode.attr('clipBegin'));
            smil.clipEnd = ActiveText.SMILFormatHelper.parseTimeCode(audioNode.attr('clipEnd'));
            smil.highlightId = '#' + selectionClassArray.pop();
            smil.character = parseCharacterIdFromNode(audioNode.parent());
            smil.highlightColour = parseHighlightColourFromNode(audioNode.parent());
            rtn.push(smil);
        });
        return rtn;
    }

    return {
        SMIL_AUDIO_TAG_TEMPLATE: {
            audioSource: 'none',
            clipBegin: '00:00',
            clipEnd: '00:00',
            highLightClass: 'highlight000'
        },
        parseTimeCode: parseSMILClockValue,
        parseSMIL: parseSMIL
    };
})(ActiveText);