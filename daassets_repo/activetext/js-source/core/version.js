/* global ActiveText */
ActiveText.version = (function() {
    'use strict';

    return {
        string: '@versioncode@',
        major: '@majorversion@',
        minor: '@minorversion@',
        hotfix: '@hotfixversion@',
        build: '@buildversion@'
    };
})();
