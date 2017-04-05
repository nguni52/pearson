/* global ActiveText */
var Rapid = Rapid || {};
Rapid.TeacherControls = function(options) {
    'use strict';

    function init(activeTextInstance) {
        if(!options) {
            options = {};
        }

        var primary = (options.primary) ? options.primary : 'previous,readtome,next';
        var leftButtons = (options.leftButtons) ? options.leftButtons : 'bugclubhotspots,zoom';
        var rightButtons = (options.rightButtons) ? options.rightButtons : 'record,play,exit';

        if(activeTextInstance.options.allowReadToMe === false) {
            primary = _.without(primary.split(','), 'readtome', 'readtomeExtended').toString();
        }

        options.primary = primary;
        options.leftButtons = leftButtons;
        options.rightButtons = rightButtons;

        var controls = new Rapid.Controls(options);
        controls.init(activeTextInstance);

        activeTextInstance.extensions.push(controls);
    }

    return  {
        init: init
    };
};