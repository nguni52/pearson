/* global WordSmith */
/**
 * @class FictionControl
 * @memberOf WordSmith
 * @param options
 * @returns {WordSmith.Controls}
 * @constructor
 */
WordSmith.FictionControl = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'drawing,viewtoggle,zoom';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'quicknav,previous,next';

    options.leftButtons = leftButtons;
    options.rightButtons = rightButtons;

    return new WordSmith.Controls(options);
};