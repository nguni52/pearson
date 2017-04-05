/* global ActiveText, Modernizr */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'quicknav';

    /**
     * @const
     * @type {number}
     */
    var ENTER_KEY = 13;

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_SINGLE_PAGE_FORMAT = 'Page %%1 of %%2';

    /**
     * @const
     * @type {string}
     */
    var DEFAULT_MULTI_PAGE_FORMAT = 'Pages %%1–%%2 of %%3';

    //function to separate text from quickNav text box:
    // eg:
    // Expects similar to: 'page 1' and should return 1 for changePage to navigate to page 1
    function getQuickNavPageNumber(quickNavText) {
        //regex removes with spaces from quickNavText and splits by Decimal number characters.
        var separatedString = quickNavText.replace(/\s+/g, '').split(/\D+/);
        var pages = [];
        var pagescount = 0;
        for(var i = 0; i < separatedString.length; i++) {
            if(!isNaN(parseInt(separatedString[i], 10))) {
                pages[pagescount] = separatedString[i];
                pagescount++;
            }
        }

        return pages[0];
    }

    function create(activeTextInstance, options) {
        function changePageOnEnterKey(event) {
            if(event.which === ENTER_KEY) {
                changePage();
                newElement.blur();
            }
            resizeInput.apply(newElement);
        }

        function getQuickNavPageText(quickNavText) {
            var flatNavigation = activeTextInstance.data.getFlatListOfNavigation();
            var quickNavTextLower = quickNavText.toLowerCase().replace(/\s+/g, '').replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');

            for(var i = 0; i < flatNavigation.length; i++) {
                var title = flatNavigation[i].title.toLowerCase().replace(/\s+/g, '').replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');

                if(title === quickNavTextLower) {
                    return i;
                }
            }

            return false;
        }

        function changePage() {
            var quickNavText = newElement.val();
            var pageToNav = getQuickNavPageText(quickNavText);
            if(pageToNav) {
                pageToNav = ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, getQuickNavPageText(quickNavText));
            } else {
                pageToNav = getQuickNavPageNumber(quickNavText);
            }

            activeTextInstance.navigation.gotoPage(pageToNav);
        }

        function updateDisplay() {
            var pageNumber = activeTextInstance.model.getCurrentPageNumber();
            var stringToDisplay = ActiveText.FormattingUtils.formatPageLabel(activeTextInstance, singlePageFormat, multiPageFormat, pageNumber);
            newElement.val(stringToDisplay);

            newElement.attr({
                'aria-valuemax': ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMaximumValidPageIndex(activeTextInstance)),
                'aria-valuemin': ActiveText.NavigationUtils.pageIndexToPageNumber(activeTextInstance, ActiveText.NavigationUtils.getMinimumValidPageIndex(activeTextInstance)),
                'aria-valuenow': activeTextInstance.model.getCurrentPageNumber(),
                'aria-valuetext': stringToDisplay
            });

            resizeInput.apply(newElement);
        }

        function clearInput() {
            newElement.val('');
        }

        var singlePageFormat;
        if(options.options && options.options.textFormatSinglePage) {
            singlePageFormat = options.options.textFormatSinglePage;
        } else {
            singlePageFormat = DEFAULT_SINGLE_PAGE_FORMAT;
        }

        var multiPageFormat;
        if(options.options && options.options.textFormatMultiPage) {
            multiPageFormat = options.options.textFormatMultiPage;
        } else {
            multiPageFormat = DEFAULT_MULTI_PAGE_FORMAT;
        }

        var newElement = $('<input type="text" aria-live="polite" aria-label="Quick Navigation" accesskey="N" />').css({
            width: 140,
            borderRadius: '25px',
            fontSize: 16,
            padding: '6px 12px',
            verticalAlign: 'middle',
            border: '4px solid',
            outline: 'none',
            fontWeight: 'bold',
            textAlign: 'center',
            textOverflow: 'ellipsis'
        });

        if(options.options && options.options.style) {
            newElement.css(options.options.style);
        }

        if(Modernizr.touch) {
            newElement.focus(clearInput);
        }
        newElement.blur(updateDisplay);
        newElement.click(clearInput);
        newElement.keyup(changePageOnEnterKey);

        var container = $('<div class="quicknav" style="display:inline-block;position:relative;width:auto"></div>').append(newElement);

        if(options.options && options.options.style && options.options.style.background) {
            container.css('background', options.options.style.background);
            container.css('background-position', 'center');
        }

        function resizeInput() {
            /* jshint validthis:true */
            var length = $(this).val().length;
            if(length < 10) {
                length = 10;
            } else if(length > 19) {
                length = 20;
            }
            $(this).attr('size', length);
        }

        resizeInput.apply(newElement);

        $(activeTextInstance).on(ActiveText.Commands.GO_TO_PAGE, updateDisplay);
        $(activeTextInstance).on(ActiveText.Events.RESIZE, updateDisplay);
        $(activeTextInstance).on(ActiveText.Events.BOOK_STRUCTURE_LOADED, updateDisplay);

        return container;
    }

    /**
     * @type {{create: Function, test: {getQuickNavPageNumber: Function}}}
     */
    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create,
        test: {
            getQuickNavPageNumber: getQuickNavPageNumber
        }
    };
})(ActiveText);
