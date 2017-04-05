/* global ActiveText, namespace */
/**
 * @class Settings
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{init: init, getFirstPageIsLeft: getFirstPageIsLeft, setFirstPageIsLeft: setFirstPageIsLeft, getNumberingOffset: getNumberingOffset, setNumberingOffset: setNumberingOffset}}
 * @constructor
 */
ActiveText.Settings = function(activeTextInstance) {
    'use strict';

    /**
     * @type {boolean}
     */
    var firstPageIsLeft = false;

    /**
     * @type {number}
     */
    var numberingOffset = 1;

    function init() {
        if(activeTextInstance && activeTextInstance.options) {
            if(activeTextInstance.options.firstPageIsLeft === undefined) {
                setFirstPageIsLeft((activeTextInstance.options.numberingOffset % 2) === 0);
            } else {
                setFirstPageIsLeft(activeTextInstance.options.firstPageIsLeft === true);
            }
        } else {
            setFirstPageIsLeft(false);
        }

        var parsedNumber;
        if(activeTextInstance && activeTextInstance.options) {
            parsedNumber = parseInt(activeTextInstance.options.numberingOffset, 10);
        }
        setNumberingOffset(parsedNumber);
    }

    function setFirstPageIsLeft(value) {
        firstPageIsLeft = Boolean(value);
        $(activeTextInstance).trigger(ActiveText.Settings.Events.UPDATED, {
            key: 'firstPageIsLeft',
            value: firstPageIsLeft
        });
    }

    function setNumberingOffset(value) {
        numberingOffset = parseInt(value, 10);
        numberingOffset = isNaN(numberingOffset) ? 1 : numberingOffset;
        $(activeTextInstance).trigger(ActiveText.Settings.Events.UPDATED, {
            key: 'numberingOffset',
            value: numberingOffset
        });
    }

    return {
        init: init,
        getFirstPageIsLeft: function getFirstPageIsLeft() {
            return firstPageIsLeft;
        },
        setFirstPageIsLeft: setFirstPageIsLeft,
        getNumberingOffset: function getNumberingOffset() {
            return numberingOffset;
        },
        setNumberingOffset: setNumberingOffset
    };
};