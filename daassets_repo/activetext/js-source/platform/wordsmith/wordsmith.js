/* global ActiveText, WordSmith, ActiveText */
ActiveText.namespace('WordSmith.Player');
WordSmith.Player = (function() {
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
                case 'overlaydataloader':
                    newClass = new ActiveText.OverlayData();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'hotspots':
                    newClass = new ActiveText.Hotspots(WordSmith.Layers.Hotspots.Factory.createResourceIcon, options);
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'soundeffects':
                    newClass = new ActiveText.SoundEffects();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'wordsmithcontrols':
                    newClass = new WordSmith.Controls(options);
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

    function setDefaultPropertiesFor(activeTextInstance) {
        activeTextInstance.options.scheme = {
            color: '#000000',
            backgroundColor: '#d78c23',
            textColor: '#000000',
            controlColor: '#000000',
            controlHoverColor: '#d78c23',
            altControlHoverColor: '#d78c23',
            widgetBackgroundColour: '#000000',
            widgetBorderColour: '#d78c23',
            widgetCloseBackgroundColour: '#d78c23',
            widgetCloseBorderColour: '#000000',
            widgetTitleColour: '#d78c23'
        };

        activeTextInstance.options.containerElement.css('background', '#d38e00');
    }

    /** @constructor */
    return function(options) {
        /**
         * @param activeTextInstance {ActiveText}
         */
        function init(activeTextInstance) {
            setDefaultPropertiesFor(activeTextInstance);

            /**
             * @type {Array}
             */
            var dependencies = [
                'overlaydataloader',
                'hotspots',
                'soundeffects',
                'wordsmithcontrols',
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

                if(activeTextInstance.utils.isFullWindowScalingMode()) {
                    var rotationControl = new ActiveText.ViewOrientationDetection();
                    rotationControl.init(activeTextInstance);
                    activeTextInstance.extensions.push(rotationControl);
                }
            });
        }

        return {
            init: init,
            key: 'wordsmith'
        };
    };
})();
