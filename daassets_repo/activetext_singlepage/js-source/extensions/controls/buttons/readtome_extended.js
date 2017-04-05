/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'readtomeExtended';

    /**
     * @const
     * @type {{title: string, className: string}}
     */
    var READTOME_BUTTON_STYLES = {
        title: 'Read to Me',
        className: 'readToMeButton',
        accesskey: 'R'
    }, DONE_BUTTON_STYLES = {
        title: 'Done',
        className: 'doneButton',
        accesskey: 'R'
    };

    /**
     * @param activeTextInstance {ActiveText}
     * @param options {object}
     * @returns {jQuery}
     */
    function create(activeTextInstance, options) {
        /**
         * @type {ActiveText.ReadToMe}
         */
        var readToMeExtension = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'readtome');

        var readToMeButton, doneButton;

        function doneButtonClickHandler() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            var rtn = false;
            if(doneButton.toggle_state() === true) {
                doneButton.toggle_button(false);
                readToMeExtension.skip();
                readToMeExtension.play();
                rtn = true;
            }
            return rtn;
        }

        function readToMeButtonClickHandler() {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            if(readToMeExtension.getState().playing()) {
                if(readToMeExtension.pause()) {
                    readToMeButton.toggle_button(false);
                }
            } else {
                if(readToMeExtension.play()) {
                    readToMeButton.toggle_button(true);
                }
            }
        }

        function updateButtonState(event) {
            if(event.type === 'onplay' || event.type === 'onresume') {
                readToMeButton.toggle_button(true);
                doneButton.toggle_button(false);
            } else {
                readToMeButton.toggle_button(false);
                doneButton.toggle_button(true);
            }
            if(event.type === 'onpause') {
                doneButton.toggle_button(true);
            }
            if(event.type === 'onfinish') {
                doneButton.toggle_button(false);
            }
        }

        function hasMediaOverlayForDPSByIndex(pageIndex) {
            var hasAudio = false;
            var smilLoader = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'smildataloader');
            var currentPage;
            for(var i = 0, l = activeTextInstance.view.model.getDisplayedPages(); i < l; i++) {
                currentPage = pageIndex + i;
                if(smilLoader && smilLoader.hasSMILForPage(currentPage)) {
                    hasAudio = true;
                }
            }
            return hasAudio;
        }

        function onPageChange(event, data) {
            var leftPageIndex = ActiveText.NavigationUtils.calculateLeftmostPageIndexFromIndex(activeTextInstance, data.toPage);
            var hasAudio;
			var isDPSView = activeTextInstance.view.model.getDisplayedPages() === 2;
            var JDPlayer = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'jdplays');
            var RapidPlayer = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'rapidplays');
            var plays = JDPlayer || RapidPlayer;
            var inPerformanceMode = plays.isInPerformanceMode(activeTextInstance);
			var pageIndex = leftPageIndex;

			if(isDPSView===false && leftPageIndex!==data.toPage) {
				pageIndex=data.toPage;
			}

			hasAudio = hasMediaOverlayForDPSByIndex(pageIndex);

            if(inPerformanceMode === true) {
                readToMeButton.hide();
                doneButton.show();
                doneButton.toggle_button(false);
            } else if(inPerformanceMode === false) {
                readToMeButton.show();
                doneButton.hide();
                readToMeButton.toggle_button(false);

                if(hasAudio) {
                    readToMeButton.enable();
                } else {
                    readToMeButton.disable();
                }
            }
        }

        function attachEventListeners(read, done) {
            read.on({
                click: readToMeButtonClickHandler
            });
            done.on({
                click: doneButtonClickHandler
            });

            $(readToMeExtension).on({
                'onplay': updateButtonState,
                'onresume': updateButtonState,
                'onpause': updateButtonState,
                'onfinish': updateButtonState
            });

            $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, onPageChange);
            $(activeTextInstance).on(ActiveText.Commands.RESIZE, onPageChange);
        }

        function attachReadToMeExtension() {
            readToMeExtension = new ActiveText.ReadToMe();
            readToMeExtension.init(activeTextInstance);
            activeTextInstance.extensions.push(readToMeExtension);
        }

        if(!readToMeExtension && typeof(ActiveText.ReadToMe) === 'function') {
            attachReadToMeExtension();
        }

        var factory = ActiveText.UI.BasicControls.ToggleButtonFactory;
        readToMeButton = factory.createToggleButton(READTOME_BUTTON_STYLES, options.options.readtome);
        doneButton = factory.createToggleButton(DONE_BUTTON_STYLES, options.options.done);
        doneButton.css('display', 'none'); // use display none here because show/hide defaults to block style instead of inline-block

        var newElement = $('<span class="playAPart"></span>');
        $(newElement).append(readToMeButton);
        $(newElement).append(doneButton);

        if(readToMeExtension) {
            attachEventListeners(readToMeButton, doneButton);
        } else {
            readToMeButton.disable();
        }

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);