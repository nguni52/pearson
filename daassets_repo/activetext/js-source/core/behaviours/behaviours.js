/* global ActiveText */
/**
 * @class Behaviours
 * @memberOf ActiveText
 * @param activeTextInstance {ActiveText}
 * @returns {{shouldAllowOverlappingContent: shouldAllowOverlappingContent, allowOverlappingButtons: allowOverlappingButtons}}
 * @constructor
 */
ActiveText.Behaviours = function(activeTextInstance) {
    'use strict';

    function shouldAllowOverlappingContent() {
        return !ActiveText.ViewUtils.isSinglePageView(activeTextInstance);
    }

    function allowOverlappingButtons() {
        if(activeTextInstance.view.model.getScaleMode() === 'ftw') {
            return false;
        } else {
            return !(activeTextInstance.options.allowOverlap !== undefined &&
                activeTextInstance.options.allowOverlap.toString().toLowerCase() === 'false');
        }
    }

    function shouldGeneratePageEdges() {
        var defaults = (activeTextInstance && activeTextInstance.options &&
            activeTextInstance.options.defaults) ? activeTextInstance.options.defaults : {generatePageEdges: true};
        var generatePageEdges = (defaults.generatePageEdges !== false);
        return generatePageEdges === true;
    }

    return {
        shouldAllowOverlappingContent: shouldAllowOverlappingContent,
        allowOverlappingButtons: allowOverlappingButtons,
        shouldGeneratePageEdges: shouldGeneratePageEdges
    };
};
