/* global ActiveText */
ActiveText.Controls = ActiveText.Controls || {};
ActiveText.Controls.TooltipHelper = (function() {
    'use strict';

    function fixTooltipPosition() {
        var container = $('.activetext');
        $('.tooltip').each(function() {
            if($(this).length && container.length) {
                var difference = (container.offset().left + container.width()) -
                    ($(this).offset().left + $(this).width());
                var marginString;

                if(difference < 0) {
                    difference -= 10;
                    if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
                        marginString = '0 ' + (-difference) + 'px 0 0';
                    } else {
                        marginString = '0 ' + (-difference) + 'px 0 ' + difference + 'px';
                    }
                }
                difference = ($(this).offset().left) - (container.offset().left);
                if(difference < 0) {
                    difference -= 10;
                    if(ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) {
                        marginString = '0 0 0 ' + (-difference) + 'px';
                    } else {
                        marginString = '0 ' + difference + 'px 0 ' + (-difference) + 'px';
                    }
                }

                $(this).find('.tooltip-inner').css('margin', marginString);
            }
        });
    }

    function resetTooltipPositionFixes() {
        var tooltip = $('.tooltip');
        tooltip.find('.tooltip-inner').css('margin', '');
    }

    return {
        fixTooltipPosition: fixTooltipPosition,
        resetTooltipPositionFixes: resetTooltipPositionFixes
    };
})();