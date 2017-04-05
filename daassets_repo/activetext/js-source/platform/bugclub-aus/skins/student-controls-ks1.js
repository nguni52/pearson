/* global BugClub */
BugClubAus.StudentControlsKS1 = function(options) {
    'use strict';

    if(!options) {
        options = {};
    }

    var primary = (options.rightButtons) ? options.rightButtons : 'previous,readtome,next';
    var skinPathPrefix = '/ks1/pupil/';

    options.primary = primary;
    options.skinName = 'student-ks1';
    options.skinPathPrefix = skinPathPrefix;

    return new BugClubAus.Controls(options);
};