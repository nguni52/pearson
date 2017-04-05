/* global BugClub */
BugClub.TeacherControlsKS2 = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'zoom,viewtoggle,drawing,bugclubhotspots';
    var primary = (options.primary) ? options.primary : '';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'activitystructure,previous,quicknav,next,exit';

    options.leftButtons = leftButtons;
    options.primary = primary;
    options.rightButtons = rightButtons;

    return new BugClub.Controls(options);
};
