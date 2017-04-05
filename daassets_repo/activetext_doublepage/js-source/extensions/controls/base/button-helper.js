/* global ActiveText */
ActiveText.Controls = ActiveText.Controls || {};
ActiveText.Controls.ButtonHelper = (function() {
    'use strict';

    function mouseOver(event) {
        /*jshint validthis:true */
        var button = $(event.currentTarget);
        var styleOptions = button.data('hoverStyles');
        var hoverImageSrc = button.data('hoverImageSrc');
        var toggleButtonHoverImageSrc = button.data('toggleButtonHoverImageSrc');
        if(!button.data('disabled')) {
            if(button.data('selected') === true) {
                $(this).find('img').attr('src', toggleButtonHoverImageSrc);
            } else {
                $(this).find('img').attr('src', hoverImageSrc);
            }
        }

        if(styleOptions) {
            $(this).css(styleOptions);
        }
        if($(button).attr('has-tooltip')) {
            $(button).tooltip('hide').tooltip('show');
            ActiveText.Controls.TooltipHelper.fixTooltipPosition();
        }
    }

    function mouseOut(event) {
        /*jshint validthis:true */
        var button = $(event.currentTarget);
        var styleOptions = button.data('styles');
        var imageSrc = button.data('imageSrc');
        var toggleButtonImageSrc = button.data('toggleButtonImageSrc');
        button.removeClass('selected');

        if(event.type !== 'blur') {
            button.blur();
        }

        if(!button.data('disabled')) {
            if(button.data('selected') === true) {
                button.find('img').attr('src', toggleButtonImageSrc);
            } else {
                button.find('img').attr('src', imageSrc);
            }
        }

        if(styleOptions) {
            button.css(styleOptions);
        }

        if($(button).attr('has-tooltip')) {
            ActiveText.Controls.TooltipHelper.resetTooltipPositionFixes();
            $(button).tooltip('hide');
        }
    }

    function mouseDown(event) {
        /*jshint validthis:true */
        var button = $(event.currentTarget);
        var downImageSrc = button.data('downImageSrc');
        var toggleButtonDownImageSrc = button.data('toggleButtonDownImageSrc');
        button.addClass('selected');
        if(!button.data('disabled')) {
            if(toggleButtonDownImageSrc && button.data('selected') === true) {
                button.find('img').attr('src', toggleButtonDownImageSrc);
            } else {
                button.find('img').attr('src', downImageSrc);
            }
        }
    }

    function setDisabled($this) {
        $this.blur().data('disabled', true);
        $this.attr({
            'aria-disabled': true
        });
    }

    function setEnabled($this) {
        $this.data('disabled', false);
        $this.attr({
            'aria-disabled': false
        });
    }

    function setDisabledImage($this) {
        var disabledImageSrc = $this.data('disabledImageSrc');
        $this.find('img').attr('src', disabledImageSrc);
    }

    function setUpImage($this) {
        if($this.data('selected') === true) {
            var toggleButtonImageSrc = $this.data('toggleButtonImageSrc');
            $this.find('img').attr('src', toggleButtonImageSrc);
        } else {
            var imageSrc = $this.data('imageSrc');
            $this.find('img').attr('src', imageSrc);
        }
    }

    function fadeDisable() {
        /* jshint validthis:true */
        var $this = $(this);
        $this.css({
            cursor: 'pointer'
        });
        setDisabled($this);
        $this.stop(true, true).fadeTo(500, 0.5);
    }

    function fadeEnable() {
        /* jshint validthis:true */
        var $this = $(this);
        $this.css({
            cursor: 'pointer'
        });
        setEnabled($this);
        $(this).stop(true, true).fadeTo(500, 1);
    }

    function basicDisable() {
        /* jshint validthis:true */
        var $this = $(this);
        $this.css({
            cursor: 'not-allowed'
        });
        setDisabledImage($this);
        setDisabled($this);
    }

    function basicEnable() {
        /* jshint validthis:true */
        var $this = $(this);
        $this.css({
            cursor: 'pointer'
        });
        setUpImage($this);
        setEnabled($this);
    }

    function hideDisable() {
        /* jshint validthis:true */
        var $this = $(this);
        $this.css({
            visibility: 'hidden'
        });
        setDisabled($this);
    }

    function showEnable() {
        /* jshint validthis:true */
        var $this = $(this);
        $this.css({
            visibility: 'visible'
        });
        setEnabled($this);
    }

    function focusAction() {
        /* jshint validthis:true */
        if($(this).attr('has-tooltip')) {
            //            $(this).tooltip('hide').tooltip('show');
            $(this).tooltip('show');
            ActiveText.Controls.TooltipHelper.fixTooltipPosition();
        }
        mouseOver.apply(this, arguments);
    }

    function blurAction() {
        /* jshint validthis:true */
        if($(this).attr('has-tooltip')) {
            ActiveText.Controls.TooltipHelper.resetTooltipPositionFixes();
            $(this).tooltip('hide');
        }
        mouseOut.apply(this, arguments);
    }

    function accessibleClick(event) {
        /* jshint validthis:true */
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode === ActiveText.Keymap.ENTER) {
            $(this).click();
        }
    }

    function getAccessKeyHTMLFor(title, accesskey) {
        var rtn = title;
        if(title && accesskey) {
            var i = title.indexOf(accesskey);
            if(title.indexOf(accesskey) !== -1) {
                rtn = title.slice(0, i) + '<u>' + accesskey + '</u>' + title.slice(i + 1);
            }
        }
        return rtn;
    }

    return {
        mouseOver: mouseOver,
        mouseOut: mouseOut,
        mouseDown: mouseDown,
        fadeEnable: fadeEnable,
        fadeDisable: fadeDisable,
        basicDisable: basicDisable,
        basicEnable: basicEnable,
        hideDisable: hideDisable,
        showEnable: showEnable,
        focusAction: focusAction,
        blurAction: blurAction,
        accessibleClick: accessibleClick,
        getAccessKeyHTMLFor: getAccessKeyHTMLFor
    };
})();