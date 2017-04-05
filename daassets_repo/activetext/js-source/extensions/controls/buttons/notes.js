/* global ActiveText */
ActiveText.namespace('ActiveText.UI.BasicControls.AvailableControls');
(function(ActiveText) {
    'use strict';

    /**
     * @const
     * @type {string}
     */
    var KEY = 'note';

    /**
     * @const
     * @type {{title: string, icon: string, className: string}}
     */
    var DEFAULT_BUTTON_STYLES = {
        title: 'Annotations',
        icon: 'icon-file',
        className: KEY,
        accesskey: 'A'
    };

    /**
     * @param activeTextInstance {ActiveText}
     * @param options {object}
     * @return {object}
     */
    function create(activeTextInstance, options) {
        var notesController = ActiveText.ExtensionUtils.getExtensionByKey(activeTextInstance, 'notes');

        function buttonClickHandler(event) {
            $(activeTextInstance).trigger(ActiveText.Events.UI_ELEMENT_CLICKED, {
                which: KEY
            });
            if(notesController) {
                var newNote = noteFactory.renderNoteFromData({
                    'point': [ 66, 32 ],
                    'relativePoint': [ 0.1, 0.1 ],
                    'text': 'this is my note'
                });
                var convertedIndex = activeTextInstance.model.getCurrentIndex();
                var overlayWrapperElement = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, convertedIndex, 'annotations');
                overlayWrapperElement.append(newNote);
            }
            return false;
        }

        function teardown() {
            newElement.off({
                click: buttonClickHandler,
                remove: teardown
            });
            notesController = undefined;
            factory = undefined;
        }

        var factory = ActiveText.UI.BasicControls.SimpleButtonFactory;
        var newElement = factory.createSimpleButton(DEFAULT_BUTTON_STYLES, options);
        var noteFactory = new ActiveText.NoteFactory(activeTextInstance);

        newElement.on({
            click: buttonClickHandler,
            remove: teardown
        });

        return newElement;
    }

    ActiveText.UI.BasicControls.AvailableControls[KEY] = {
        create: create
    };
})(ActiveText);