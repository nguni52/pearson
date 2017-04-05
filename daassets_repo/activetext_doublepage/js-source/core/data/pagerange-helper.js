/* global ActiveText */
ActiveText.PageRangeHelper = (function() {
    'use strict';

    function isAllowedPageNumber(activeTextInstance, pageNumber) {
        var rtn = false;
        var pageRangeIsDefined = activeTextInstance.options && activeTextInstance.options.pageRange !== undefined &&
            activeTextInstance.options.pageRange.toString().length;
        if(pageRangeIsDefined) {
            var pageRange = activeTextInstance.options.pageRange;
            var valueType = typeof(pageRange);
            if(valueType === 'number') {
                rtn = (pageNumber === pageRange);
            } else if(valueType === 'string') {
                var groups = pageRange.split(',');
                for(var i = 0, l = groups.length; i < l; i++) {
                    if(groups[i].indexOf('-') === -1) {
                        rtn = (rtn || (parseInt(groups[i], 10) === pageNumber));
                    } else {
                        var range = groups[i].split('-');
                        var rangeMin = parseInt(range.shift(), 10);
                        var rangeMax = parseInt(range.pop(), 10);
                        if(pageNumber >= rangeMin && pageNumber <= rangeMax) {
                            rtn = true;
                        }
                    }
                }
            }
        } else {
            rtn = true;
        }
        return rtn;
    }

    return {
        isAllowedPageNumber: isAllowedPageNumber
    };
})();