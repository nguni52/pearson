/* global ActiveText, ActiveText, Modernizr */
var Rapid = Rapid || {};
Rapid.Player = (function() {
    'use strict';

    /**
     * @param activeTextInstance {ActiveText}
     * @param dependencyKey {String}
     * @param skinCode {String}
     */
    function checkDependency(activeTextInstance, dependencyKey, skinCode) {
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
				case 'summaryscreen':
					newClass = new BugClub.SummaryScreen(skinCode);
					newClass.init(activeTextInstance);
					activeTextInstance.extensions.push(newClass);
					break;
                case 'closebook':
                    newClass = new Rapid.CloseBook();
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

		function hotspotClickHandler(e) {
			/* jshint validthis:true */
			var activityIsComplete = $(e.currentTarget).hasClass('complete');
			if(!activityIsComplete) {
				var data = $(e.currentTarget).data();
				var hotspotUri = data.data.uri;
				var scormIntegrationExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'pipwerks');
				if(scormIntegrationExtension) {
					debug.log('scormIntegrationExtension.launchActivity();', data);
					scormIntegrationExtension.launchActivity(hotspotUri);
				} else {
					debug.log('Launching Hotspot Activity : ' + hotspotUri);
					setTimeout(function() {
						alert('Launching Hotspot Activity : ' + hotspotUri);
					}, 0);
				}
			} else {
				debug.log('Not launching activity because activity is completed.');
			}
		}

        if(activeTextInstance.options.audioPlaybackController === undefined) {
            activeTextInstance.options.audioPlaybackController = audioPlaybackController;
        }

		if(activeTextInstance.options.hotspotClickFunction === undefined) {
			activeTextInstance.options.hotspotClickFunction = hotspotClickHandler;
		}

        if(activeTextInstance.options.allowOverlap === undefined) {
            activeTextInstance.options.allowOverlap = false;
        }

        if(activeTextInstance.options.allowAnimation === undefined) {
            activeTextInstance.options.allowAnimation = false;
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
				'bugclubactivitysummary',
				'bugclubscorm',
				'bugclubhotspots',
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
            key: 'rapid'
        };
    };
})();
