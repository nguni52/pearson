/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'readtome';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Read to Me',
        icon: 'icon-volume-up',
        className: KEY,
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

        function buttonClickHandler(event) {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            if(readToMeExtension.getState().playing()) {
                if(readToMeExtension.pause()) {
                    newElement.toggle_button(false);
                }
            } else {
                if(readToMeExtension.play()) {
                    newElement.toggle_button(true);
                }
            }
        }

        function updateButtonState(event) {
            if(event.type === 'onplay' || event.type === 'onresume') {
                newElement.toggle_button(true);
            } else {
                newElement.toggle_button(false);
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

			var isDPSView = activeTextInstance.view.model.getDisplayedPages() === 2;
			var leftPageIndex = ActiveText.NavigationUtils.calculateLeftmostPageIndexFromIndex(activeTextInstance, data.toPage);
			var hasAudio;
			var pageIndex = leftPageIndex;

			if(isDPSView===false && leftPageIndex!==data.toPage) {
				pageIndex=data.toPage;
			}

            newElement.toggle_button(false);
			hasAudio = hasMediaOverlayForDPSByIndex(pageIndex);

            if(hasAudio) {
                newElement.enable();
            } else {
                newElement.disable();
                //TODO: test on page with no audio
            }
        }

        function attachEventListeners(buttonElement) {
            buttonElement.on({
                click: buttonClickHandler
                // todo: Get the hoverintent plugin in here.
            });

            $(readToMeExtension).on({
                'onplay': updateButtonState,
                'onresume': updateButtonState,
                'onpause': updateButtonState,
                'onfinish': updateButtonState
            });

            $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, onPageChange);
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
        var newElement = factory.createToggleButton(DEFAULT_BUTTON_STYLES, options);

        if(readToMeExtension) {
            attachEventListeners(newElement);
        } else {
            newElement.disable();
            //            debug.log('Error: Required class ActiveText.ReadToMe was not found in the ActiveText instance.');
        }

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);