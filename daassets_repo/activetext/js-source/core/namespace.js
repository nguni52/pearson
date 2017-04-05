/* global ActiveText */
ActiveText.namespace = function namespace(str, root) {
    'use strict';

    if(!str) {
        str = '';
    }
    var chunks = str.split('.');
    if(!root) {
        root = window;
    }
    if($.browser.msie && parseInt($.browser.version, 10) < 9) {
        window.hasOwnProperty = function(obj) {
            return (this[obj]) ? true : false;
        };
    }

    var current = root;
    for(var i = 0; i < chunks.length; i++) {
        if(!current.hasOwnProperty(chunks[i])) {
            current[chunks[i]] = {};
        }
        current = current[chunks[i]];
    }
    return current;
};
