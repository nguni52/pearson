/* global BugClub */
BugClubAus.TeacherControlsKS2 = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var leftButtons = (options.leftButtons) ? options.leftButtons : 'bugclubhotspots,zoom,viewtoggle,drawing';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'activitystructure,previous,quicknav,next,exit';

    options.leftButtons = leftButtons;
    options.rightButtons = rightButtons;
    options.skinName = 'teacher-ks2';
    options.skinPathPrefix = '/ks2/';

    return new BugClubAus.Controls(options);
};
