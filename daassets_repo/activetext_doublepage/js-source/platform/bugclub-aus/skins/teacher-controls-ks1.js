/* global BugClubAus */
BugClubAus.TeacherControlsKS1 = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }
    var leftButtons = (options.leftButtons) ? options.leftButtons : 'readtome,drawing,zoom,bugclubhotspots';
    var rightButtons = (options.rightButtons) ? options.rightButtons : 'previous,quicknav,next,exit';
    var skinPathPrefix = '/ks1/teacher/';
    /*
     if(activeTextInstance.options.allowReadToMe === false)
     {
     leftButtons = _.without(leftButtons.split(','), 'readtome', 'readtomeExtended').toString();
     rightButtons = _.without(rightButtons.split(','), 'readtome', 'readtomeExtended').toString();
     }
     */
    options.leftButtons = leftButtons;
    options.rightButtons = rightButtons;
    options.skinName = 'teacher-ks1';
    options.skinPathPrefix = skinPathPrefix;

    return new BugClubAus.Controls(options);
};
