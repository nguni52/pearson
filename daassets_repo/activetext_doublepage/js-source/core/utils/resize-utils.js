/* global ActiveText */
ActiveText.ResizeUtils = (function(ActiveText) {
    'use strict';

    function getProportionalResizeBehaviour(activeTextInstance, layerKey) {
        return function() {
            var model = activeTextInstance.model;
            var view = activeTextInstance.view;
            var currentIndex = model.getCurrentIndex();
            var scale = ActiveText.ViewUtils.getScaleValue(activeTextInstance);
            var dpsDimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
            var magnificationValue = activeTextInstance.view.model.getMagnificationValue();
            var svgWidth = dpsDimensions.dpswidth / 2;
            var svgHeight = dpsDimensions.height;
            var overlayWrapperElement;

			//changed l=view.model.getDisplayedPages() to l=2 as we always need to scale both pages to avoid hotspot creep
            for(var i = 0, l = 2; i < l; i++) {
                overlayWrapperElement = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, currentIndex +
                    i, layerKey);
                if(overlayWrapperElement) {
                    overlayWrapperElement.width(svgWidth * scale).height(svgHeight * scale);
                    ActiveText.ViewUtils.scaleHTMLElement(activeTextInstance, overlayWrapperElement, 1 / scale *
                        magnificationValue);
                }
            }
        };
    }

    function getNonProportionalResizeBehaviour(activeTextInstance, layerKey) {
        return function() {
            var view = activeTextInstance.view;
            var model = activeTextInstance.model;
            var currentIndex = model.getCurrentIndex();
            var dpsDimensions = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
            var svgWidth = dpsDimensions.dpswidth / 2;
            var svgHeight = dpsDimensions.height;
            var overlayWrapperElement;
			//changed l=view.model.getDisplayedPages() to l=2 as we always need to scale both pages to avoid hotspot creep
            for(var i = 0, l = 2; i < l; i++) {
                overlayWrapperElement = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, currentIndex +
                    i, layerKey);
                if(overlayWrapperElement) {
                    overlayWrapperElement.width(svgWidth).height(svgHeight);
                }
            }
        };
    }

    return {
        getProportionalResizeBehaviour: getProportionalResizeBehaviour,
        getNonProportionalResizeBehaviour: getNonProportionalResizeBehaviour
    };
})(ActiveText);
