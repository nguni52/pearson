/* global ActiveText, ActiveText, Modernizr, BugClub */
var BugClubAus = BugClubAus || {};
/**
 * @class Player
 * @memberOf BugClub
 * @param {string} skinCode
 * @returns {{init: init, key: string}}
 * @constructor
 */
BugClubAus.Player = function(skinCode) {
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
				case 'readtome':
					if(activeTextInstance.options.allowReadToMe !== false) {
						newClass = new ActiveText.ReadToMe();
						newClass.init(activeTextInstance);
						activeTextInstance.extensions.push(newClass);
					}
					break;
				case 'summaryscreen':
					newClass = new BugClubAus.SummaryScreen(skinCode);
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
        if(ActiveText.BrowserUtils.isMobileDevice) {
            activeTextInstance.options.allowAnimation = false;
        }

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

        /**
         * @type {Boolean}
         */
        var isUsingAutoPlay;

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

        function audioPlaybackController(value, eventType) {
            var rtn;
            var readToMe = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'readtome');
            if(readToMe) {
                var state = readToMe.getState();

                isUsingAutoPlay = state.shouldAutoPlay;
                if(value === undefined) {
                    rtn = state.shouldAutoPlay;
                } else {
                    state.shouldAutoPlay = Boolean(readToMe.options && readToMe.options.autoplay);
                }
            }
            return rtn;
        }

        if(activeTextInstance.options.allowOverlap === undefined) {
            activeTextInstance.options.allowOverlap = false;
        }

        if(activeTextInstance.options.hotspotClickFunction === undefined) {
            activeTextInstance.options.hotspotClickFunction = hotspotClickHandler;
        }

        if(activeTextInstance.options.audioPlaybackController === undefined) {
            activeTextInstance.options.audioPlaybackController = audioPlaybackController;
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
			'readtome',
			'summaryscreen',
			'soundeffects',
			'keyboardintegration',
			'drawingtools',
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
        key: 'bugclubaus'
    };
};