/* global ActiveText */
/**
 * @class Utils
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @type {{isFullWindowScalingMode: isFullWindowScalingMode, getPageNumberFromId: getPageNumberFromId, getReaderDPSWidth: getReaderDPSWidth, updatePageClassNameFor: updatePageClassNameFor, getSourcePathForIndex: getSourcePathForIndex}}
 * @constructor
 */

ActiveText.Utils = function(activeTextInstance) {
    'use strict';

    function isFullWindowScalingMode() {
        if(activeTextInstance && activeTextInstance.options && activeTextInstance.options.defaults &&
            activeTextInstance.options.defaults.wmode) {
            return activeTextInstance.options.defaults.wmode === 'fullscreen';
        } else {
            return false;
        }
    }

    function closeWidgetTrigger() {
        parent.window.$('.ui-dialog-titlebar-close').trigger('click');
    }

    function getPageNumberFromId(id) {
        var rtn;
        var allPages = activeTextInstance.data.getFlatListOfNavigation();
        for(var i = 0; i < allPages.length; i++) {
            if(parseInt(allPages[i].id, 10) === parseInt(id, 10)) {
                rtn = i;
                break;
            }
        }
        return rtn;
    }

    function getReaderDPSWidth() {
        return ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance).dpswidth;// *
    }

    function updatePageClassNameFor(index) {
        if(Boolean(Math.abs(index % 2) === 1) === !activeTextInstance.settings.getFirstPageIsLeft()) {
            return 'leftPage';
        } else {
            return 'rightPage';
        }
    }

    function getSourcePathForIndex(index) {
        var rtn;
        var pages = activeTextInstance.data.getFlatListOfNavigation();
        try {
            rtn = pages[index].src;
        }
        catch(e) {
            rtn = 'about:blank';
        }
        return rtn;
    }

    return  {
        isFullWindowScalingMode: isFullWindowScalingMode,
        getPageNumberFromId: getPageNumberFromId,
        getReaderDPSWidth: getReaderDPSWidth,
        updatePageClassNameFor: updatePageClassNameFor,
        getSourcePathForIndex: getSourcePathForIndex,
        closeWidgetTrigger: closeWidgetTrigger
    };
};
