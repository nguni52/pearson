/* ===========================================================
 * bootstrap-popover.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */

/**
 * @fileoverview
 * @suppress {checkVars|uselessCode}
 */
!function($)
{

    "use strict"; // jshint ;_;

    /* POPOVER PUBLIC CLASS DEFINITION
     * =============================== */

    var Popover = function(element, options)
    {
        this.init('atPopover', element, options)
    }

    /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

        constructor   : Popover, setContent : function()
        {
            var $tip = this.tip()
                , title = this.getTitle()
                , content = this.getContent()

            $tip.find('.at-popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
            $tip.find('.at-popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

            $tip.removeClass('fade top bottom left right in')
        }, hasContent : function()
        {
            return this.getTitle() || this.getContent()
        }, getContent : function()
        {
            var content
                , $e = this.$element
                , o = this.options

            content = $e.attr('data-content')
                || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content)

            return content
        }, tip        : function()
        {
            if(!this.$tip)
            {
                this.$tip = $(this.options.template)
            }
            return this.$tip
        }

    })

    /* POPOVER PLUGIN DEFINITION
     * ======================= */

    $.fn.atPopover = function(option)
    {
        return this.each(function()
        {
            var $this = $(this)
                , data = $this.data('at-popover')
                , options = typeof option == 'object' && option
            if(!data)
            {
                $this.data('at-popover', (data = new Popover(this, options)))
            }
            if(typeof option == 'string')
            {
                data[option]()
            }
        })
    }

    $.fn.atPopover.Constructor = Popover

    $.fn.atPopover.defaults = $.extend({}, $.fn.tooltip.defaults, {
        placement : 'right', content : '', template : '<div class="at-popover"><div class="arrow"></div><div class="at-popover-inner"><h3 class="at-popover-title"></h3><div class="at-popover-content"><p></p></div></div></div>'
    })

}(window.jQuery);