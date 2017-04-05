/* global ActiveText*/
/**
 * @class Constants
 * @memberOf ActiveText
 * @type {{BLANK_PAGE_CONTENT: string, USE_LOCAL_CACHE: boolean}}
 */
ActiveText.Constants = {
    /**
     * @const
     * @type {string}
     */
    BLANK_PAGE_CONTENT: '<html><head></head><body>&nbsp;</body></html>',
    /**
     * @const
     * @type {boolean}
     */
    USE_LOCAL_CACHE: (true && !$.browser.msie && !/phantom/i.test(navigator.userAgent) &&
        window.location.protocol !== 'file:')
};
