/* global ActiveText, ActiveText, Modernizr */
var RapidPlays = RapidPlays || {};
/**
 * @class Player
 * @memberOf RapidPlays
 * @returns {{init: init, isInPerformanceMode: isInPerformanceMode, key: string}}
 * @constructor
 */
RapidPlays.Player = (function() {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     * @param dependencyKey {String}
     * @param skinCode {String}
     */
    function checkDependency(activeTextInstance, dependencyKey) {

        function audioPlaybackController(value, eventType) {
            if(value === undefined) {
                if(isInPerformanceMode(activeTextInstance)) {
                    var extension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'readtome');
                    var currentCharacter = ActiveText.CharacterSelection.getCharacter();
                    var activeCharacter = extension.getState().getActiveCharacter();

                    return !(currentCharacter === activeCharacter);
                } else {
                    if(eventType === ActiveText.Commands.GO_TO_PAGE) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }

        activeTextInstance.options.audioPlaybackController = audioPlaybackController;
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
                    newClass = new ActiveText.Hotspots();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'smildatamodel':
                    newClass = new ActiveText.SMILDataModel();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'smildataloader':
                    newClass = new ActiveText.SMILDataLoader();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'recordandplay':
                    newClass = new ActiveText.RecordAndPlay();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'texthighlightaudiosync':
                    if(activeTextInstance.options.allowReadToMe !== false) {
                        newClass = new ActiveText.TextHighlightAudioSync({
                            selectionModeHighlightByDefault: true
                        });
                        newClass.init(activeTextInstance);
                        activeTextInstance.extensions.push(newClass);
                    }
                    break;
                case 'closebook':
                    newClass = new RapidPlays.CloseBook();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'soundeffects':
                    newClass = new ActiveText.SoundEffects();
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
                case 'clicktoprompt':
                    newClass = new ActiveText.ClickToPrompt();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'readingcomplete':
                    newClass = new ActiveText.ReadingComplete();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                //                default:
                // do nothing.
                //                    break;
            }
        }
    }

    function audioPlaybackController(value, eventType) {
        if(value === undefined) {
            if(eventType === ActiveText.Commands.GO_TO_PAGE) {
                return false;
            } else {
                return true;
            }
        }
    }

    function setDefaultPropertiesFor(activeTextInstance) {
        var pathToAssets = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        if(activeTextInstance.options.audioPlaybackController === undefined) {
            activeTextInstance.options.audioPlaybackController = audioPlaybackController;
        }

        if(activeTextInstance.options.allowOverlap === undefined) {
            activeTextInstance.options.allowOverlap = false;
        }

        if(activeTextInstance.options.allowAnimation === undefined) {
            activeTextInstance.options.allowAnimation = false;
        }
        if(activeTextInstance.options.autoPop === undefined) {
            activeTextInstance.options.autoPop = function() {
                var autoPopData = {
                    index: 0,
                    data: [
                        {
                            'type': 'target-area',
                            'data': {
                                'id': 'ATX-autoPop',
                                'shape': 'rectangle',
                                'uri': pathToAssets+'wdgt/RapidPlays.wdgt/index.html?transparent=true',
                                'x': -1,
                                'y': -1,
                                'width': 1,
                                'height': 1
                            }
                        }
                    ]
                };
                return autoPopData;
            };
        }
    }

    /**
     * @param activeTextInstance {ActiveText}
     * @returns {boolean}
     */
    function isInPerformanceMode(activeTextInstance) {
        var currentCharacter = ActiveText.CharacterSelection.getCharacter();
        if(currentCharacter !== '') {
            return (activeTextInstance.model.getCurrentPageNumber() >= 3);
        } else {
            return false;
        }
    }

    function setRandomBackground(activeTextInstance) {
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
        var bg = ['green', 'orange', 'purple', 'blue'][Math.floor(Math.random() * 4)];

        /**
         * Browser detection is bad, but IE is worse.
         *
         * Some versions of IE support SVG, and they support it for background images, but they don't scale it correctly
         * because they're dumb. So we're forced to do shit like this - using non SVG versions of images for the background.
         */
        if(!Modernizr.svg || navigator.userAgent.match(/(msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i)) {
            activeTextInstance.options.containerElement.css({
                background: 'url(' + pathToResources + '/img/rapid/background-' + bg + '.png) no-repeat center center',
                filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + pathToResources +
                    '/img/rapid/background-' + bg + '.png", sizingMethod="scale")',
                MsFilter: '\'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + pathToResources +
                    '/img/rapid/background-' + bg + '.png", sizingMethod="scale")\'',
                backgroundSize: 'cover'
            });
        } else {
            activeTextInstance.options.containerElement.css({
                background: 'url(' + pathToResources + 'img/rapid/background-' + bg +
                    '.svg) no-repeat center center',
                backgroundSize: 'cover'
            });
        }
    }

    /** @constructor */
    return function() {
        /**
         * @param activeTextInstance {ActiveText}
         */
        function init(activeTextInstance) {
            setRandomBackground(activeTextInstance);
            setDefaultPropertiesFor(activeTextInstance);

            /**
             * @type {Array}
             */
            var dependencies = [
                'overlaydataloader',
                'hotspots',
                'smildatamodel',
                'smildataloader',
                'texthighlightaudiosync',
                'closebook',
                'soundeffects',
                'keyboardintegration',
                'drawingtools',
                'clicktoprompt',
                'recordandplay',
                'readingcomplete'
            ];

            /**
             * @type {String}
             */
            var dependencyKey;

            for(var i = 0, l = dependencies.length; i < l; i++) {
                dependencyKey = dependencies[i];
                checkDependency(activeTextInstance, dependencyKey);
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
            isInPerformanceMode: isInPerformanceMode,
            key: 'rapidplays'
        };
    };
})();
