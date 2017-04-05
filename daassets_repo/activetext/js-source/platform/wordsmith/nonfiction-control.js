/* global WordSmith */
/**
 * @class NonFictionControl
 * @memberOf WordSmith
 * @param options
 * @returns {WordSmith.Controls}
 * @constructor
 */
WordSmith.NonFictionControl = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'drawing,viewtoggle,zoom';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'previous,next';

    options.leftButtons = leftButtons;
    options.rightButtons = rightButtons;

    return new WordSmith.Controls(options);
};