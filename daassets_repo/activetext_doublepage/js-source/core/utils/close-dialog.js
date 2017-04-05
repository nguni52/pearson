/* global ActiveText */
/**
 * @class CloseDialog
 * @memberOf ActiveText
 */

ActiveText.CloseDialog = function(closeTargetElement) {
    'use strict';
    $('.ui-dialog').find('.ui-dialog-titlebar-close').trigger('click');
};