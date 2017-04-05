/* global ActiveText */
/**
 * @class Notes
 * @memberOf ActiveText
 * @returns {{init: init, key: string, hideNotes: hideNotes, showNotes: showNotes, loadData: undefined}}
 * @constructor
 */
ActiveText.Notes = function() {
    'use strict';

    /**
     * @type {ActiveText}
     */
    var activeTextInstance;

    /**
     * @type {ActiveText.NoteFactory}
     */
    var factory;

    /**
     * @type {Boolean}
     */
    var notesVisible = true;

    /**
     * @type {ActiveText.NoteDataService}
     */
    var data;

    /**
     * @const
     * @type {string}
     */
    var LAYER_KEY = 'annotations';

    /**
     * @param instance {ActiveText}
     */
    function init(instance) {
        activeTextInstance = instance;

        factory = new ActiveText.NoteFactory(activeTextInstance);
        data = new ActiveText.NoteDataService(activeTextInstance);

        api.loadData = data.loadData;

        ActiveText.CSSUtils.embedCSS(ActiveText.Notes.Style);

        var containerResizeFunction = ActiveText.ResizeUtils.getNonProportionalResizeBehaviour(activeTextInstance, LAYER_KEY);

        $(data).on(ActiveText.Events.LOADED_NOTES_FOR_INDEX, onNotesDataLoaded);
        $(activeTextInstance).on(ActiveText.Events.RESIZE, containerResizeFunction);
        $(activeTextInstance.options.containerElement).on(ActiveText.Notes.Events.UPDATE, '.' +
            LAYER_KEY, onNoteUpdated);
    }

    /**
     * @param event {event}
     * @param eventData {{data:object, index:number}}
     */
    function onNotesDataLoaded(event, eventData) {
        var data = eventData.data;
        var convertedIndex = eventData.index;
        var overlayWrapperElement = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, convertedIndex, LAYER_KEY);

        overlayWrapperElement.empty();

        for(var i = 0, l = data.length; i < l; i++) {
            if(data[i].type === 'note' && data[i].data.text.length !== 0) {
                renderNoteFromDataOnPage(data[i].data, overlayWrapperElement);
            }
        }
    }

    /**
     * @returns {array}
     */
    function getDataForAllNotes() {
        function pushDataForEachNote(index, value) {
            rtn.push(factory.getDataRepresentation(value));
        }

        var currentFrame;
        var currentIndex = activeTextInstance.model.getCurrentIndex();
        var rtn;
        for(var i = 0, l = activeTextInstance.view.model.getDisplayedPages(); i < l; i++) {
            rtn = [];
            currentFrame = ActiveText.LayerUtils.getOverlayForIndexByKey(activeTextInstance, currentIndex +
                i, LAYER_KEY);
            $(currentFrame).find('.note-container').each(pushDataForEachNote);
            data.setCacheForPage(currentIndex + i, rtn);
        }
        return rtn;
    }

    function onNoteUpdated(event, eventData) {
        getDataForAllNotes();
    }

    function renderNoteFromDataOnPage(data, page) {
        var newNote = factory.renderNoteFromData(data);
        page.append(newNote);
    }

    function hideNotes() {
        notesVisible = false;
        ActiveText.LayerUtils.setLayerVisibility(activeTextInstance, LAYER_KEY, false);
    }

    function showNotes() {
        notesVisible = true;
        ActiveText.LayerUtils.setLayerVisibility(activeTextInstance, LAYER_KEY, true);
    }

    /**
     * @type {{init: init, key: string, hideNotes: hideNotes, showNotes: showNotes, loadData: undefined}}
     */
    var api = {
        init: init,
        key: 'notes',
        hideNotes: hideNotes,
        showNotes: showNotes,
        loadData: undefined
    };

    return api;
};
