/* global BugClub */
var JDPlays = JDPlays || {};
JDPlays.StudentControls = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'zoom';
    var primary = (options.primary) ? options.primary : 'previous,readtomeExtended,next';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'exit';

    options.leftButtons = leftButtons;
    options.primary = primary;
    options.rightButtons = rightButtons;

    return new BugClub.Controls(options);
};