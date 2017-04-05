/* global ActiveText, ActiveText, Modernizr */
var ActiveLearn = ActiveLearn || {};
/**
 * @class ActiveLearn.Player
 * @memberOf ActiveLearn
 * @param {*} options
 * @returns {{init: init, key: string}}
 * @constructor
 */
ActiveLearn.Player = function(options) {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     * @param dependencyKey {String}
     */
    function checkDependency(activeTextInstance, dependencyKey, options) {
        var newClass;
        var hasExtensionForDependency = Boolean(ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, dependencyKey));
        if(!hasExtensionForDependency) {
            switch(dependencyKey) {
                case 'overlaydataloader':
                    newClass = new ActiveText.OverlayData();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'hotspots':
                    newClass = new ActiveText.Hotspots(ActiveLearn.HotspotsFactory.createResourceIcon, options);
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'notes':
                    newClass = new ActiveText.Notes();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'activelearncontrols':
                    newClass = new ActiveLearn.Controls();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'keyboardintegration':
                    newClass = new ActiveText.KeyboardIntegration();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'drawingtools':
                    newClass = new ActiveText.DrawingTools();
                    if(newClass.supported()) {
                        newClass.init(activeTextInstance);
                        activeTextInstance.extensions.push(newClass);
                    }
                    break;
                //                default:
                // do nothing.
                //                    break;
            }
        }
    }

    /**
     * @param activeTextInstance {ActiveText}
     */
    function init(activeTextInstance) {
        if(ActiveText.BrowserUtils.isMobileDevice) {
            activeTextInstance.options.allowAnimation = false;
        }

        /**
         * @type {Array}
         */
        var dependencies = [
            'overlaydataloader',
            'hotspots',
            'notes',
            'activelearncontrols',
            'keyboardintegration',
            'drawingtools'
        ];

        /**
         * @type {String}
         */
        var dependencyKey;

        for(var i = 0, l = dependencies.length; i < l; i++) {
            dependencyKey = dependencies[i];
            checkDependency(activeTextInstance, dependencyKey, options);
        }

        $(activeTextInstance).one(ActiveText.Commands.INIT_WHITEBOARD, function() {
            var rotationControl = new ActiveText.ViewOrientationDetection();
            rotationControl.init(activeTextInstance);
            activeTextInstance.extensions.push(rotationControl);
        });
    }

    return {
        init: init,
        key: 'activelearn'
    };
};