/* global ActiveText, ActiveText, requestAnimationFrame, Modernizr */
ActiveText.Hotspots.AutoLoadingWidgetsController = function(activeTextInstance, options) {
    'use strict';

    var haveShownPopUp = false;

    var controller;

    options = options || activeTextInstance.options;
    
    function init(parent) {
        controller = parent;
        if(options && options.autoPop && typeof(options.autoPop) === 'function') {
            /*jshint validthis: true */
            var newData = options.autoPop.call(this);

            if(!Modernizr.csstransitions || !Modernizr.csstransforms3d) {
                //ie<10 needs to trigger the FRAME_CONTENT_LOADED event as will never see ANIMATE_PAGE_END event.
                $(activeTextInstance).on(ActiveText.Events.FRAME_CONTENT_LOADED, function() {
                    handleAutoPop(newData);
                });
            } else {
                if(activeTextInstance.options.allowAnimation) {
                    $(activeTextInstance).on(ActiveText.Events.ANIMATE_PAGE_END, function() {
                        handleAutoPop(newData);
                    });
                } else {
                    $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, function() {
                        handleAutoPop(newData);
                    });
                }
            }
        }
    }

    function checkIfURILinksToAWidget(uri) {
        return uri.indexOf('wdgt') !== -1;
    }

    /**
     * @param popData {object}
     */
    function handleAutoPop(popData) {
        var pageIndex = activeTextInstance.model.getCurrentIndex();
        if(pageIndex === popData.index && haveShownPopUp === false) {
            var item = popData.data[0];
            var uri;
            if(item.data && item.data.uri) {
                uri = item.data.uri;
                item.data.parsedUri = ActiveText.DataUtils.parseURI(uri);
            }
            item.widget = checkIfURILinksToAWidget(uri);

            var hotspot = ActiveText.Hotspots.TargetAreaFactory.createTarget(item);
            hotspot.data(item);
            controller.hotspotClickHandler.apply(hotspot, [
                {
                    type: 'click',
                    currentTarget: hotspot
                }
            ]);

            haveShownPopUp = true;
        }

    }

    return {
        init: init
    };
};
