/* global ActiveText, Spinner, NProgress */
ActiveText.View = ActiveText.View || {};
/**
 * @class Loader
 * @memberOf ActiveText.View
 * @param activeTextInstance {ActiveText}
 * @returns {{register: register, showOn: showOn, hideOn: hideOn}}
 * @constructor
 */
ActiveText.View.Loader = function(activeTextInstance) {
    'use strict';

    /**
     * @type {boolean}
     */
    var forced = false;

    function register() {
        new ActiveText.View.Loader.Styles().init(activeTextInstance);
        NProgress.configure({containerElement: $('#messages-placeholder')});

        $(document).ajaxStart(showLoader).ajaxComplete(hideLoader);
        $(activeTextInstance).on(ActiveText.Commands.SHOW_LOADER, forceShowLoader);
        $(activeTextInstance).on(ActiveText.Commands.HIDE_LOADER, forceHideLoader);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(activeTextInstance.options.containerElement).off('remove', teardown);
            NProgress.configure({
                containerElement: undefined,
                showSpinner: !ActiveText.BrowserUtils.isOldVersionOfInternetExplorer
            });
            $(document).off('ajaxStart', showLoader).off('ajaxComplete', hideLoader);
        }
    }

    function forceShowLoader() {
        forced = true;
        showLoader();
    }

    function forceHideLoader() {
        forced = false;
        hideLoader();
    }

    function showLoader() {
        NProgress.start();
    }

    function showOn(eventNamesArray) {
        var event;
        for(var i = 0, l = eventNamesArray.length; i < l; i++) {
            event = eventNamesArray[i];
            $(activeTextInstance).on(event, showLoader);
        }
    }

    function hideLoader() {
        if(forced) {
            NProgress.inc();
        } else {
            NProgress.done();
        }
    }

    function hideOn(eventNamesArray) {
        var event;
        for(var i = 0, l = eventNamesArray.length; i < l; i++) {
            event = eventNamesArray[i];
            $(activeTextInstance).on(event, hideLoader);
        }
    }

    return {
        register: register,
        showOn: showOn,
        hideOn: hideOn
    };
};