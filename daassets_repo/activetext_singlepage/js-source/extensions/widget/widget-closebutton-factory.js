/* global ActiveText, ActiveText, Modernizr */
ActiveText.Widget = ActiveText.Widget || {};
ActiveText.Widget.CloseButtonFactory = (function() {
    'use strict';

    function createCloseButton(pathToResources) {
        function touchDown() {
            closeButton.attr('src', downState);
        }

        function mouseOver() {
            closeButton.attr('src', hoverState);
        }

        function mouseOut() {
            closeButton.attr('src', upState);
        }

        var closeButton;

        var cssString = '.chromeless-closebutton' +
            '{' +
            "-webkit-tap-highlight-color:rgba(0,0,0,0);" +
            "width: 30px;" +
            "height: 30px;" +
            "margin-left: -15px;" +
            "margin-right: -15px;" +
            "margin-top: -15px;" +
            '}';

        if(Modernizr.svg) {
            cssString += '.chromeless-closebutton svg:hover circle {' +
                'fill:#666666;' +
                '}' +
                '.chromeless-closebutton svg:active circle {' +
                'fill:#ff0000;' +
                '}';

            var svgSource = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"' +
                'width="30.202px" height="30.201px" viewBox="0 0 30.202 30.201" enable-background="new 0 0 30.202 30.201" xml:space="preserve">' +
                '<circle fill="#010101" stroke="#FFFFFF" stroke-width="2" stroke-miterlimit="10" cx="15.101" cy="15.101" r="14.101"/>' +
                '<g>' +
                '<path fill="#FFFFFF" d="M10.654,20.815L9.58,19.74c-0.451-0.454-0.451-0.866-0.039-1.279l3.389-3.391L9.541,11.68' +
                'C9.129,11.267,9.129,10.855,9.58,10.4l1.074-1.076c0.455-0.453,0.891-0.475,1.303-0.061l3.391,3.391l3.391-3.391' +
                'c0.412-0.414,0.824-0.414,1.28,0.041l1.072,1.075c0.477,0.476,0.477,0.888,0.061,1.3l-3.39,3.391l3.39,3.391' +
                'c0.414,0.412,0.393,0.845-0.061,1.3l-1.074,1.076c-0.455,0.455-0.869,0.455-1.281,0.041l-3.39-3.39l-3.391,3.39' +
                'C11.544,21.291,11.132,21.291,10.654,20.815z"/>' +
                '</g>' +
                '</svg>';
            closeButton = $('<div class="chromeless-closebutton">' + svgSource + '</div>');
        } else {
            var upState = pathToResources + 'img/close_button.png';
            var hoverState = pathToResources + 'img/close_button_hover.png';
            var downState = pathToResources + 'img/close_button_down.png';

            closeButton = $('<img src="' + upState + '" width="30" height="30" class="chromeless-closebutton" />');

            closeButton.on({
                mouseover: mouseOver,
                mouseout: mouseOut,
                mousedown: touchDown,
                touchstart: touchDown,
                touchend: mouseOut
            });
        }
        ActiveText.CSSUtils.embedCSS(cssString, 'chromeless-closebutton');

        return closeButton;
    }

    return {
        createCloseButton: createCloseButton
    };
})();