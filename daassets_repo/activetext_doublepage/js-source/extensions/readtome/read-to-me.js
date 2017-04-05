/* global ActiveText */
/**
 * @class ReadToMe
 * @memberOf ActiveText
 * @param {*=} options
 * @returns {{init: init, options: *, play: function, pause: function, getState: getState, skip: function, stop: function, key: string}}
 * @constructor
 */
ActiveText.ReadToMe = function(options) {
	'use strict';

	/**
	 * @type {ActiveText}
	 */
	var activeTextInstance;

	/**
	 * @type {ActiveText.ReadToMe.State}
	 */
	var state;

	/**
	 * @type {Boolean}
	 */
	var audioFileIsFlaggedForAChange = true;

	/**
	 * @param instance {ActiveText}
	 */
	function init(instance) {
		activeTextInstance = instance;

		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		state = new ActiveText.ReadToMe.State(activeTextInstance);

		var defaultAutoPlayValue = Boolean(options && options.autoplay);
		state.setAutoPlay(defaultAutoPlayValue);

		getDependencies();

		$(audioPlayback).on('onplay onresume onpause onfinish', forwardEvents);
		$(audioPlayback).on('onerror', onError);
		$(audioPlayback).on('ontimeupdate', whilePlaying);
		$(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, changePage);
		$(activeTextInstance).on(ActiveText.Hotspots.Events.CLICKED, stopAudio);

	}

	function getDependencies() {
		ActiveText.ReadToMe.Utils.autoInjectSMILLoader(activeTextInstance);

		var smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');
		if(!smilDataModel) {
			smilDataModel = new ActiveText.SMILDataModel();
			smilDataModel.init(activeTextInstance);
			activeTextInstance.extensions.push(smilDataModel);
		}
	}

	function forwardEvents(e) {
		$(api).trigger(e.type);
	}

	// the previous approach based on the onfinish event triggered by SM2 was not 
	// working on iPads, where the event would fire only sporadically. (as 20140902)
	// this should be refactored somewhere in the future...
	function whilePlaying(){
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		var position = Math.ceil(audioPlayback.getPosition());
		var duration = Math.ceil(audioPlayback.getDuration());
		var diffInterval = duration - 50;
		var delay = duration - position;

		if((position && duration && duration !== 0 && position >= diffInterval)){
			audioPlayback.setPosition(0);
			audioPlayback.duration = 0;
			audioPlayback.stop();
			$(audioPlayback).trigger('onfinish');
			setTimeout(onEnded, delay);
		}
	}

	function resetAudioProgressionState(activePage) {
		state.activePage = activePage;
		state.queuePos = 0;
		state.activeCharacter = '';
		state.activeFile = '';

		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		audioPlayback.stop();

		audioFileIsFlaggedForAChange = true;
	}

	function changePage(event, data) {
		function checkAndBeginAudio() {
			if(state.getAutoPlay(event.type + '.' + event.namespace) && !mustWaitForSoundEffectsToPlay) {
				setTimeout(function() {
					setTheCorrectNextAudioFile();
				}, 0);
			}
		}

		var visiblePageHasChanged = data.toPage !== data.fromPage;

		if(visiblePageHasChanged) {
			resetAudioProgressionState(data.toPage);
		}

		// re-enable "Done" button on rotation/resize if the first character is the selected one.
		var shouldAutoplay = state.getAutoPlay();
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		if(!shouldAutoplay){
			setTimeout(function(){
				$(audioPlayback).trigger('onpause');
			}, 200);
		}

		/**
		 * @type {ActiveText.SoundEffects}
		 */
		var soundEffectsExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'soundeffects');
		var mustWaitForSoundEffectsToPlay = false;
		if(soundEffectsExtension) {
			var visiblePages = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
			$.when(soundEffectsExtension.hasLoadedOverlayDataForPages(visiblePages)).then(function() {
				if(soundEffectsExtension.hasSoundEffectsForPage(visiblePages)) {
					mustWaitForSoundEffectsToPlay = true;
				}
				checkAndBeginAudio();
			});
		} else {
			var pagesToCheck = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
			$.when(ActiveText.ReadToMe.Utils.hasLoadedSMILFilesForVisiblePages(activeTextInstance, pagesToCheck)).then(checkAndBeginAudio);
		}
	}

	function autoAdvanceAudioToNextPage() {
		function switchToTheNextPage() {
			var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
			var isLeftMostPage = ActiveText.NavigationUtils.isLeftPage(activeTextInstance, state.activePage);
			state.activePage++;
			state.queuePos = 0;

            var JDPlayer = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'jdplays');
            var RapidPlayer = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'rapidplays');
            var plays = JDPlayer || RapidPlayer;

            state.inPerformanceMode = plays ? plays.isInPerformanceMode(activeTextInstance) : false;
            state.setAutoPlay(true);

			if(isLeftMostPage) {
				setTheCorrectNextAudioFile();
			} else {
				if(state.inPerformanceMode){
					audioPlayback.setSrc('');
					state.activeFile = '';
				}
				$(api).trigger(ActiveText.ReadToMe.Events.UPDATE);
				audioPlayback.stop();
			}
		}

		var pagesToCheck = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
		$.when(ActiveText.ReadToMe.Utils.hasLoadedSMILFilesForVisiblePages(activeTextInstance, pagesToCheck)).then(switchToTheNextPage);
	}


	function startLoadingTheNextAudioFile(pagesDataLoaded) {
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		var smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');
		var dataHasBeenLoadedForTheActivePage = _.contains(pagesDataLoaded, state.activePage);
		if(dataHasBeenLoadedForTheActivePage) {
			var audioCollectionForThisPage = smilDataModel.getSmilDataForPage(state.activePage);
			var hasAnAudioFileForTheCurrentPage = Boolean(audioCollectionForThisPage &&
				audioCollectionForThisPage[state.queuePos]);

			if(hasAnAudioFileForTheCurrentPage) {

				$.when(audioPlayback.getMediaPlayer()).then(function() {
					var src = ActiveText.DataUtils.correctURLPath(activeTextInstance, audioCollectionForThisPage[state.queuePos].audioSource);

					audioPlayback.setSrc(src);
					state.activeCharacter = audioCollectionForThisPage[state.queuePos].character;
					state.activeFile = audioCollectionForThisPage[state.queuePos].audioSource;
					$(api).trigger(ActiveText.ReadToMe.Events.UPDATE);
					audioFileIsFlaggedForAChange = false;

					playAudio();
				});
			} else {
				if(pagesDataLoaded.length !== 1 || audioCollectionForThisPage === undefined){
					audioPlayback.setSrc('');
				}
				state.activeFile = '';
				$(api).trigger(ActiveText.ReadToMe.Events.UPDATE);
				$(activeTextInstance).trigger(ActiveText.Commands.HIDE_LOADER);
				state.activeCharacter = '';
				audioPlayback.stop();
				autoAdvanceAudioToNextPage();
				//var isDPSView = activeTextInstance.view.model.getDisplayedPages() === 2;
				//if(isDPSView) {

				/*} else {

				}*/
			}
		}
	}

	function setTheCorrectNextAudioFile() {
		var pagesToCheck = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
		$.when(ActiveText.ReadToMe.Utils.hasLoadedSMILFilesForVisiblePages(activeTextInstance, pagesToCheck)).then(startLoadingTheNextAudioFile);
	}

	function onError(event, data) {
		$(activeTextInstance).trigger(ActiveText.Commands.DISPLAY_ERROR, 'An Error occurred loading audio file ' +
			data.url);
		api.skip();
	}

	function advanceToNextFile(audioElement) {
		var smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');
		state.queuePos++;

		var pageAudioCollection = smilDataModel.getSmilDataForPage(state.activePage);
		if(pageAudioCollection && pageAudioCollection[state.queuePos]) {
			state.activeCharacter = pageAudioCollection[state.queuePos].character;
			state.activeFile = pageAudioCollection[state.queuePos].audioSource;
		} else {
			state.activeCharacter = '';
			state.activeFile = '';
		}

		var existingSrc = '';
		if(audioElement) {
			existingSrc = audioElement.url;
		}
		// I think this makes the sound effects work!
		var audioFileIsFromActivePage = false;
		if(existingSrc && pageAudioCollection) {
			for(var i = 0, l = pageAudioCollection.length; i < l; i++) {
				if(existingSrc.indexOf(pageAudioCollection[i].audioSource) !== -1) {
					audioFileIsFromActivePage = true;
				}
			}
		}

		if(!audioFileIsFromActivePage) {
			state.queuePos = 0;
		}

		setTheCorrectNextAudioFile();
	}

	function onEnded(event) {
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		var pagesToCheck = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
		$.when(audioPlayback.getMediaPlayer(), ActiveText.ReadToMe.Utils.hasLoadedSMILFilesForVisiblePages(activeTextInstance, pagesToCheck)).then(advanceToNextFile);
	}

	function playAudio() {
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		var JDPlayer = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'jdplays');
		var RapidPlayer = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'rapidplays');
		var plays = JDPlayer || RapidPlayer;
		var pagesToCheck = ActiveText.ViewUtils.getVisiblePages(activeTextInstance);
		var delay = ActiveText.BrowserUtils.iOSversion[0] >= 6 ? 200 : 1;

		state.inPerformanceMode = plays ? plays.isInPerformanceMode(activeTextInstance) : false;
		state.setAutoPlay(true);

		$.when(audioPlayback.getMediaPlayer()).then(function(mp) {
            var visiblePageHasChanged = !_.contains(pagesToCheck, state.activePage) || (pagesToCheck.length === 1 && state.activePage !== pagesToCheck[0]);
            var pageHasTurned = state.activePage > pagesToCheck[pagesToCheck.length - 1];

            var smilDataModel = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildatamodel');
            var pageAudioCollection = smilDataModel.getSmilDataForPage(state.activePage);
            var samePageOrReadToMe = !pageHasTurned || !state.inPerformanceMode;
            var nextPageAndPerformanceMode = pageHasTurned && state.inPerformanceMode && pageAudioCollection !== undefined;
            var hasOverlay = $(window.frameElement).is(':hidden');

			if(!mp) {
				audioFileIsFlaggedForAChange = true;
			}
			if(audioFileIsFlaggedForAChange) {
				setTheCorrectNextAudioFile();
			} else {
				if(visiblePageHasChanged && (samePageOrReadToMe || nextPageAndPerformanceMode)){
					resetAudioProgressionState(pagesToCheck[0]);
					setTheCorrectNextAudioFile();
				} else if(state.activeFile === '' && !state.inPerformanceMode) {
					setTheCorrectNextAudioFile();
				}
			}
			if(!hasOverlay){
				setTimeout(function(){
					audioPlayback.play();
				}, delay);
			}
		});
	}

	/**
	 * @returns {boolean}
	 */
	function pauseAudio() {
		state.setAutoPlay(false);
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		return audioPlayback.pause();
	}

	function stopAudio() {
		var audioPlayback = ActiveText.ExtensionUtils.getAudioPlayback(activeTextInstance);
		audioPlayback.stop();

		resetAudioProgressionState(state.activePage);
	}

	/**
	 * @returns {ActiveText.ReadToMe.State}
	 */
	function getState() {
		return state;
	}

	/**
	 * @type {{init: init, options: *, play: playAudio, pause: pauseAudio, getState: getState, skip: onEnded, stop: stopAudio, key: string}}
	 */
	var api = {
		init: init,
		options: options,
		play: playAudio,
		pause: pauseAudio,
		getState: getState,
		skip: onEnded,
		stop: stopAudio,
		key: 'readtome'
	};

	return api;
};