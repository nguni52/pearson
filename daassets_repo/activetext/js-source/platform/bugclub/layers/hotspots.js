/* global ActiveText */
var BugClub = BugClub || {};
/**
 * @class BugClub.Hotspots
 * @memberOf BugClub
 * @param keyStage {string}
 * @param options {*}
 * @returns {{init: init, keyStage: *, key: string}}
 * @constructor
 */
BugClub.Hotspots = function(keyStage, options) {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     */
    function init(activeTextInstance) {
        activeTextInstance.options.keyStage = keyStage;

        var controller = new ActiveText.Hotspots.Controller(activeTextInstance, BugClub.Hotspots.Factory.createResourceIcon, activeTextInstance.options);
        controller.init();

        BugClub.Hotspots.SCORMController(options, keyStage, activeTextInstance);

        var cssString = '.bugclub_icon div' +
            '{' +
            'background:none !important;' +
            'cursor:pointer !important;' +
            '}';
        ActiveText.CSSUtils.embedCSS(BugClub.DialogStyleText.getStyle(activeTextInstance) +
            cssString, 'bugclub-hotspots');

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(activeTextInstance.options.containerElement).off('remove', teardown);
            controller.teardown();
        }
    }

    return {
        init: init,
        keyStage: keyStage,
        key: 'bugclubhotspots'
    };
};
