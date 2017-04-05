/* global BugClub */
BugClub.TeacherControlsKS1 = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'zoom,drawing,bugclubhotspots';
    var primaryButtons = (options.primaryButtons) ? options.primaryButtons : 'previous,readtome,next';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'quicknav,exit';

    options.leftButtons = leftButtons;
    options.primary = primaryButtons;
    options.rightButtons = rightButtons;

    return new BugClub.Controls(options);
};
