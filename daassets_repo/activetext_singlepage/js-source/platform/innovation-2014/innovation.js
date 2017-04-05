/* global ActiveText */
var Innovation = Innovation || {};
/**
 * @class Player
 * @memberOf Innovation
 * @param options {{ hotspotClickFunction: function }}
 * @returns {{init: init, key: string}}
 * @constructor
 */
Innovation.Player = function(options) {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     * @param dependencyKey {String}
     * @param options {{ hotspotClickFunction: function }}
     */
    function checkDependency(activeTextInstance, dependencyKey, options) {
        var newClass;
        var hasExtensionForDependency = Boolean(ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, dependencyKey));
        if(!hasExtensionForDependency) {
            switch(dependencyKey) {
                case 'keyboardintegration':
                    newClass = new ActiveText.KeyboardIntegration();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                //                default:
                // do nothing.
                //                    break;
            }
        }
    }

    function setDefaultPropertiesFor(activeTextInstance) {
        activeTextInstance.options.allowAnimation = false;
        activeTextInstance.options.pageEdgeStyle = 'none';
    }

    /**
     * @param activeTextInstance {ActiveText}
     */
    function init(activeTextInstance) {
        if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.containerElement) {
            setDefaultPropertiesFor(activeTextInstance);
            Innovation.StylesHelper.injectCSS(activeTextInstance);

            /**
             * @type {Array}
             */
            var dependencies = [
                'keyboardintegration'
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
                if(activeTextInstance.utils.isFullWindowScalingMode()) {
                    var rotationControl = new ActiveText.ViewOrientationDetection();
                    rotationControl.init(activeTextInstance);
                    activeTextInstance.extensions.push(rotationControl);
                }

                var edges = new Innovation.PageEdgeFactory(activeTextInstance);
                edges.generateEdges(activeTextInstance.options.containerElement);
            });
        }
    }

    return {
        init: init,
        key: 'innovation'
    };
};