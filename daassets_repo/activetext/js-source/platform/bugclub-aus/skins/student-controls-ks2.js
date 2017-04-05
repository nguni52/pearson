/* global BugClub */
BugClubAus.StudentControlsKS2 = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }
    var leftButtons = (options.leftButtons) ? options.leftButtons : 'zoom,viewtoggle';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'activitystructure,previous,quicknav,next,exit';
    var skinPathPrefix = '/ks2/';

    options.leftButtons = leftButtons;
    options.rightButtons = rightButtons;
    options.skinName = 'student-ks2';
    options.skinPathPrefix = skinPathPrefix;

    return new BugClubAus.Controls(options);
};