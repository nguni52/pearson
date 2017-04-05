/* globals FastClick */
/**
 * @class ActiveText
 * @param options
 * @returns {{init: init, ready: boolean, options: *, behaviours: undefined, navigation: undefined, model: undefined, utils: undefined, data: undefined, loader: undefined, view: undefined, theme: undefined, constants: undefined, version: undefined, extensions: undefined}}
 * @constructor
 */
var ActiveText = function(options) {
    'use strict';

    var api = {
        init: init,
        ready: false,
        options: options,
        behaviours: undefined,
        navigation: undefined,
        model: undefined,
        utils: undefined,
        data: undefined,
        loader: undefined,
        view: undefined,
        theme: undefined,
        constants: undefined,
        version: undefined,
        extensions: undefined
    };

    function init() {
        api.ready = true;
        // calling this here is necessary to allow for the disabling of the left edge.
        $(api).trigger(ActiveText.Events.REFRESH);
    }

    function attachExtensions() {
        api.extensions = [];
        if(options && options.extensions && $.isArray(options.extensions)) {
            for(var i = 0, l = options.extensions.length; i < l; i++) {
                if(typeof(options.extensions[i]) === 'object') {
                    api.extensions.push(options.extensions[i]);
                }
            }
        }

        if(ActiveText.Analytics) {
            api.extensions.push(new ActiveText.Analytics());
        }
    }

    function attachClassDependencies() {
        api.behaviours = new ActiveText.Behaviours(api);
        api.navigation = new ActiveText.Navigation.Controller(api);
        api.model = new ActiveText.Navigation.Model(api);
        api.utils = new ActiveText.Utils(api);
        api.data = new ActiveText.Data(api);
        api.settings = new ActiveText.Settings(api);
        api.loader = new ActiveText.Loader(api);
        api.view = new ActiveText.View(api, options);
        api.theme = new ActiveText.Theme(api, options);
        api.constants = ActiveText.Constants;
        api.version = ActiveText.version;
        attachExtensions();
    }

    function initExtensions() {
        if(api.extensions && $.isArray(api.extensions)) {
            for(var i = 0, l = api.extensions.length; i < l; i++) {
                if(typeof(api.extensions[i].init) === 'function') {
                    var extensionOptions;
                    if(options && options.options) {
                        extensionOptions = options.options[i];
                    }
                    api.extensions[i].init(api, extensionOptions);
                }
            }
        }
    }

    function initClassDependencies() {
        api.model.init();
        api.settings.init();
        api.data.init();
        api.loader.init();
        api.view.init();

        initExtensions();

        if(FastClick !== undefined) {
            if(options && options.containerElement) {
                var layer = options.containerElement.get(0);
                if(layer !== undefined) {
                    FastClick.attach(layer);
                }
            }
        }

        new ActiveText.Style().init();
    }

    attachClassDependencies();
    initClassDependencies();

    // auto-init when the resources are loaded
    $(api).on(ActiveText.Events.RESOURCES_LOADED, init);
    $(api).on(ActiveText.Events.RESOURCES_ERROR, init);

    if(options && options.containerElement) {
        $(options.containerElement).on('remove', teardown);
    }

    $(api).trigger(ActiveText.Commands.INIT_WHITEBOARD);

    function teardown() {
        $(api).off(ActiveText.Events.RESOURCES_LOADED, init);
        $(api).off(ActiveText.Events.RESOURCES_ERROR, init);
        $(options.containerElement).off('remove', teardown);

        api.ready = false;
        api = undefined;
    }

    return api;
};