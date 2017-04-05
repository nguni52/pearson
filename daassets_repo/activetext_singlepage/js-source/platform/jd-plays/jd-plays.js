/* global ActiveText, BugClub, ActiveText, Modernizr */
var JDPlays = JDPlays || {};
/**
 * @class Player
 * @memberOf JDPlays
 * @param {string} skinCode
 * @returns {{init: init, isInPerformanceMode: isInPerformanceMode, key: string}}
 * @constructor
 */
JDPlays.Player = function(skinCode) {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     * @param dependencyKey {String}
     * @param skinCode {String}
     */
    function checkDependency(activeTextInstance, dependencyKey, skinCode) {
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
                case 'bugclubhotspots':
                    newClass = new BugClub.Hotspots(skinCode);
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
                case 'texthighlightaudiosync':
                    if(activeTextInstance.options.allowReadToMe !== false) {
                        newClass = new ActiveText.TextHighlightAudioSync();
                        newClass.init(activeTextInstance);
                        activeTextInstance.extensions.push(newClass);
                    }
                    break;
                case 'summaryscreen':
                    newClass = new BugClub.SummaryScreen(skinCode);
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
                case 'bugclubactivitysummary':
                    newClass = new BugClub.ActivitySummaryCollective();
                    newClass.init(activeTextInstance);
                    activeTextInstance.extensions.push(newClass);
                    break;
                case 'bugclubscorm':
                    newClass = new BugClub.SCORM.ActivityData();
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
        var pathToAssets = ActiveText.SkinUtils.getPathToResources(activeTextInstance);
        /**
         * Browser detection is bad, but IE is worse.
         *
         * Some versions of IE support SVG, and they support it for background images, but they don't scale it correctly
         * because they're dumb. So we're forced to do shit like this - using non SVG versions of images for the background.
         */
        if(!Modernizr.svg || navigator.userAgent.match(/(msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i)) {
            activeTextInstance.options.containerElement.css({
                background: 'url(' + pathToAssets + 'img/bugclub/backdrop.png) no-repeat center center',
                filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + pathToAssets +
                    'img/bugclub/backdrop.png", sizingMethod="scale")',
                MsFilter: '\'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + pathToAssets +
                    'img/bugclub/backdrop.png", sizingMethod="scale")\'',
                backgroundSize: 'cover'
            });
        } else {
            activeTextInstance.options.containerElement.css({
                background: 'url(' + pathToAssets + 'img/bugclub/background.svg) no-repeat center center',
                backgroundSize: 'cover'
            });
        }

        function hotspotClickHandler(e) {
            /* jshint validthis:true */
            var activityIsComplete = $(e.currentTarget).hasClass('complete');
            if(!activityIsComplete) {
                var data = $(e.currentTarget).data();
                var scormIntegrationExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'pipwerks');
                if(scormIntegrationExtension) {
                    debug.log('scormIntegrationExtension.launchActivity();', data);
                    scormIntegrationExtension.launchActivity(data.data.uri);
                } else {
                    debug.log('Launching Hotspot Activity : ' + data.data.uri);
                    alert('Launching Hotspot Activity : ' + data.data.uri);
                }
            } else {
                debug.log('Not launching activity because activity is completed.');
            }
        }

        if(activeTextInstance.options.allowOverlap === undefined) {
            activeTextInstance.options.allowOverlap = false;
        }

        if(activeTextInstance.options.hotspotClickFunction === undefined) {
            activeTextInstance.options.hotspotClickFunction = hotspotClickHandler;
        }

        if(ActiveText.BrowserUtils.isMobileDevice) {
            activeTextInstance.options.allowAnimation = false;
        }

        if(activeTextInstance.options.autoPop === undefined) {
            activeTextInstance.options.autoPop = function() {
                var autoPopData = {
                    index: 2,
                    data: [
                        {
                            'type': 'target-area',
                            'data': {
                                'id': 'ATX-autoPop',
                                'shape': 'rectangle',
                                'uri': pathToAssets+'wdgt/JDPlays.wdgt/index.html?transparent=true',
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
            return (activeTextInstance.model.getCurrentPageNumber() >= 4);
        } else {
            return false;
        }
    }

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
            'bugclubactivitysummary',
            'bugclubscorm',
            'bugclubhotspots',
            'smildatamodel',
            'smildataloader',
            'texthighlightaudiosync',
            'summaryscreen',
            'soundeffects',
            'keyboardintegration',
            'drawingtools',
            'clicktoprompt',
            'readingcomplete'
        ];

        /**
         * @type {String}
         */
        var dependencyKey;

        for(var i = 0, l = dependencies.length; i < l; i++) {
            dependencyKey = dependencies[i];
            checkDependency(activeTextInstance, dependencyKey, skinCode);
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
        key: 'jdplays'
    };
};
