/* global ActiveText */
ActiveText.LoaderUtils = (function() {
    'use strict';

    function correctPointsToPixels(input) {
        return input.replace(/([0-9]+)pt/g, function(match, group0) {
            return Math.round(parseInt(group0, 10) * 96 / 72) + 'px';
        });
    }

    function sourceURLIsValid(sourceURL) {
        return sourceURL.indexOf('about:blank') === -1;
    }

    return {
        correctPointsToPixels: correctPointsToPixels,
        sourceURLIsValid: sourceURLIsValid
    };
})();
