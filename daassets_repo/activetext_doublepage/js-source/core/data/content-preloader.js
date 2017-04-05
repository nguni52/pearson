/* global ActiveText */
/**
 * @class ContentPreloader
 * @memberOf ActiveText
 * @returns {{init: init}}
 * @constructor
 */
ActiveText.ContentPreloader = function(activeTextInstance) {
    "use strict";

    function init() {
        var signalBus = $(activeTextInstance);
        signalBus.on(ActiveText.Commands.LOAD_RESOURCE_FOR_CURRENT_INDEX, parseAndPreloadContent);

        if(activeTextInstance.options && activeTextInstance.options.containerElement) {
            $(activeTextInstance.options.containerElement).on('remove', teardown);
        }

        function teardown() {
            $(activeTextInstance.options.containerElement).off('remove', teardown);
            signalBus.off(ActiveText.Commands.LOAD_RESOURCE_FOR_CURRENT_INDEX, parseAndPreloadContent);
        }
    }

    function parseAndPreloadContent(event, obj) {
        if(obj && document.images) {
            var rawData = obj.data;
            var baseURL = obj.baseURL;
            if(rawData) {
                var results = /<img.+?src=["|'](.+?)["|'].+?\/?>/gi.exec(rawData);
                if(results) {
                    var message = results[1];
                    var preloadObj = new Image();
                    var pathAsArray = baseURL.split("/");
                    pathAsArray.pop();
                    var path = pathAsArray.join("/");
                    preloadObj.src = path + "/" + message;
                }
            }
        }
    }

    return {
        init: init
    };
};
