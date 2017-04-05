/* global ActiveText, Modernizr */
ActiveText.Hotspots.TargetAreaFactory = (function() {
    'use strict';

    function createTarget(item) {
        var selectedCharName = ActiveText.CharacterSelection.getCharacter();
        var uriCharName = '';
        var uriString;
        var charIDString = 'id=""';
        var targetArea;
        var classNameString = 'class=""';
        var targetAreaClass = '';

        if(item.data.uri) {
            uriString = item.data.uri.toString();
            if(uriString.indexOf('type=prompt') !== -1) {
                targetAreaClass = 'ctp noSwipe';
                charIDString = 'id="' + uriCharName + '"';
            } else if(uriString.indexOf('character') !== -1) {
                uriCharName = ActiveText.Hotspots.Helper.returnCharacterFromUri(uriString);
                charIDString = 'id="' + uriCharName + '"';
                targetAreaClass = 'charSelect';
            } else {
                targetAreaClass = 'otherTA';
            }
        }

        if(selectedCharName !== '' && selectedCharName === uriCharName) {
            classNameString = 'class="character-selected"';
        }

        if(item.data.shape === 'polygon') {
            var svgData = $('<svg class="target-area noSwipe ' + targetAreaClass +
                '" version="1.1" xmlns="http://www.w3.org/2000/svg" width="' +
                item.data.width + '" height="' + item.data.height + '" viewBox="0 0 ' + item.data.width + ' ' +
                item.data.height + '">' +
                '<polygon ' + charIDString + ' ' + classNameString + ' fill-opacity="0.5" fill="' + item.data.fill +
                '" stroke="' + item.data.stroke + '" points="' + item.data.points +
                '" visibility="visible" style="cursor:pointer;pointer-events:visible;"/>' +
                '</svg>');
            targetArea = svgData;

            targetArea.css({
                width: parseInt(item.data.width, 10),
                height: parseInt(item.data.height, 10),
                position: (ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) ? 'relative' : 'absolute',
                marginTop: parseInt(item.data.y, 10),
                marginLeft: parseInt(item.data.x, 10),
                cursor: 'default',
                pointerEvents: 'none',
                overflow: 'hidden'
            });
        } else {
            targetArea = $('<div class="target-area noSwipe ' + targetAreaClass +
                '"><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="' +
                item.data.width + '"  height="' + item.data.height + '" ' + charIDString + ' ' + classNameString +
                ' /></div>');

            targetArea.css({
                width: parseInt(item.data.width, 10),
                height: parseInt(item.data.height, 10),
                position: (ActiveText.BrowserUtils.isOldVersionOfInternetExplorer) ? 'relative' : 'absolute',
                marginTop: parseInt(item.data.y, 10),
                marginLeft: parseInt(item.data.x, 10),
                cursor: 'pointer',
                pointerEvents: 'all',
                overflow: 'hidden'
            });
        }

        if(item.data && item.data.id) {
            targetArea.attr('id', item.data.id);
        }

        return targetArea;
    }

    return {
        createTarget: createTarget
    };
})();
