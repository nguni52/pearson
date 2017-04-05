/* global ActiveText */
ActiveText.CharacterSelection = (function() {
    'use strict';

    var currentCharacter = '';

    function setCharacter(targetElement, character) {
        clearCharacter();
        if(targetElement && targetElement[0].nodeName !== 'svg') {
            targetElement[0].setAttribute('class', 'character-selected');
            currentCharacter = character;
        }
    }

    function getCharacter() {
        return currentCharacter;
    }

    function clearCharacter() {
        $('.character-selected').each(function() {
            deselectCharacter($(this));
        });
    }

    function deselectCharacter(targetElement) {
        if(targetElement && targetElement[0].nodeName !== 'svg') {
            targetElement[0].setAttribute('class', '');
            currentCharacter = '';
        }
    }

    return {
        setCharacter: setCharacter,
        getCharacter: getCharacter,
        deselectCharacter: deselectCharacter
    };

})();