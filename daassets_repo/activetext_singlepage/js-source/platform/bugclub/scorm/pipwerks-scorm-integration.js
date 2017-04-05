/* global ActiveText, GenericAPIAdaptor, BugClub */
ActiveText.SCORM = ActiveText.SCORM || {};
/**
 * @class Pipwerks
 * @memberOf ActiveText.SCORM
 * @returns {{init: init, key: string, scormInterfaceReady: scormInterfaceReady, launchActivity: launchActivity, closeEBook: closeEBook}}
 * @constructor
 */
ActiveText.SCORM.Pipwerks = function() {
	'use strict';

	var ua = navigator.userAgent, phantom = /phantom/i.test(ua);

	/**
	 * @type {ActiveText}
	 */
	var activeTextInstance;

	/**
	 * @type {BUGCLUB.SCORM.ScormClient}
	 */
	var scormInterface;

	/**
	 * @type {EbookLauncher}
	 */
	var ebookLauncher;

	/**
	 * To stop infinite loops, we use this flag.
	 * @type {boolean}
	 */
	var hasSetInitialPageNumber = false;

	/**
	 * To stop infinite loops, we use this flag.
	 * @type {boolean}
	 */
	var hasLoadedInitialState = false;

	/**
	 * Makes the instance of ActiveText available to this class.
	 * @param instance {ActiveText}
	 */
	function init(instance) {
		activeTextInstance = instance;
		checkAllInterfacesAreReady();
	}

	/**
	 * It's possible that the workflow won't be init > scormInterfaceReady, so this function checks that
	 * all of the dependencies are set before we start working with the data, or we'll get errors.
	 */
	function checkAllInterfacesAreReady() {
		if(activeTextInstance && scormInterface && ebookLauncher) {
			whenAllInterfacesAreReady();
		}
	}

	/**
	 * Once we're ready, we start.
	 */
	function whenAllInterfacesAreReady() {
		// likelyhood is that we're already on a page so our 'resume' page index won't fire a new event unless
		// the user starts interacting, so we just want to stash the current page number at this point.
		if(!hasSetInitialPageNumber) {
			var currentPageNumber = activeTextInstance.model.getCurrentPageNumber();
			if(scormInterface && scormInterface.savePageNumber) {
				try {
					scormInterface.savePageNumber(currentPageNumber);
				}
				catch(e) {
					debug.log('Failed to save current page number:', e);
				}
			}
			hasSetInitialPageNumber = true;
		}

		if(!hasLoadedInitialState) {
			hasLoadedInitialState = true;
		}

		// bind events to the future page turn events.
		$(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, onPageChange);

		var scormDataInstance = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'bugclubscorm');

		// when the hotspot overlays are loaded for a page, we need to also load their status
		$(scormDataInstance).on(BugClub.SCORM.ActivityData.PARSED_DATA, loadStatusForActivities);

		var overlayDataLoader = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'overlaydataloader');
		if(overlayDataLoader) {
			for(var y = 0, ln = activeTextInstance.data.getFlatListOfNavigation().length; y < ln; y++) {
				overlayDataLoader.loadDataForPageIndex(y);
			}
		}
	}

	/**
	 * When an overlay is loaded and parsed (to extract the proper id from the uri) get their status
	 * @param event {object}
	 * @param data {{ index : number, data : Array }}
	 */
	function loadStatusForActivities(event, data) {

		var immediateResponse = {};
		var arrayOfActivities = data.data;





		for(var i = 0, l = arrayOfActivities.length; i < l; i++) {

			if(!arrayOfActivities[i].data.seqid) {
				continue;
			}
			var activityId = arrayOfActivities[i].data.seqid;
			var baseScormKey = 'cmi.objectives.' + activityId + '.';

			immediateResponse[activityId.toString()] = {
				completion_status: scormInterface.getScormValue(baseScormKey + 'completion_status'),
				progress_measure: scormInterface.getScormValue(baseScormKey + 'progress_measure'),
				score: {
					max: scormInterface.getScormValue(baseScormKey + 'score.max'),
					raw: scormInterface.getScormValue(baseScormKey + 'score.raw')
				},
				success_status: scormInterface.getScormValue(baseScormKey + 'success_status')
			};
		}
		$(activeTextInstance).trigger(ActiveText.SCORMIntegration.SCORM_DATA_UPDATED, immediateResponse);
	}

	/**
	 * Sets up the connection between the pipwerks SCORM classes and ActiveText.
	 * @param pipwerksEBookClass {{ ebookLauncher : function, savePageNumber : function }}
	 */
	function scormInterfaceReady(pipwerksEBookClass) {
		ebookLauncher = pipwerksEBookClass.ebookLauncher;
		scormInterface = ebookLauncher.scormClient;

		if(!phantom) {
			debug.log('ActiveText.SCORM.Pipwerks: SCORM interface is ready:', scormInterface, ebookLauncher);
		}

		checkAllInterfacesAreReady();
	}

	/**
	 * Responds to page change events from ActiveText and forwards them to the
	 * scormInterface.savePageNumber function.
	 * @param event {object}
	 * @param data {object}
	 */
	function onPageChange(event, data) {
		if(scormInterface && scormInterface.savePageNumber) {
			setTimeout(function() {
				try {
					scormInterface.savePageNumber(data.toPage);
				}
				catch(e) {
					debug.log('Failed to save current page number:', e);
				}
			}, 0);
		}
	}

	/**
	 * Calls out to the ebookLauncher class and launches an activity.
	 * @param attrStr {string} The identifier for the activity id.
	 */
	function launchActivity(attrStr) {
		if(ebookLauncher && typeof(ebookLauncher.launchActivity) === 'function') {
			ebookLauncher.launchActivity(attrStr);
		} else {
			debug.debug('Unable to launch activity because ebookLauncher does not exist or ebookLauncher.launchActivity is not a function.', ebookLauncher);
		}
	}

	function closeEBook() {
		if(ebookLauncher && typeof ebookLauncher.closeEbook === 'function') {
			ebookLauncher.closeEbook();
		} else {
			window.open('', '_self', '');
			window.close();
		}
	}

	return {
		init: init,
		key: 'pipwerks',
		scormInterfaceReady: scormInterfaceReady,
		launchActivity: launchActivity,
		closeEBook: closeEBook
	};
};
