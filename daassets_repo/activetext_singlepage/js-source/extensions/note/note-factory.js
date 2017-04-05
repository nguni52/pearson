/* global ActiveText */
ActiveText.NoteFactory = function(activeTextInstance) {
    'use strict';

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_NOTE_WIDTH = 100;

    /**
     * @const
     * @type {number}
     */
    var DEFAULT_NOTE_HEIGHT = 100;

    // disable swipe gestures on notes.
    $.fn.swipe.excludedElements += ',.note,.note-container';

    function getDataRepresentation(elem) {
        var newNote = $(elem);
        var noteElement = newNote.find('.note');
        var noteWidth = noteElement.width();
        var noteHeight = noteElement.height();
        var noteTop = newNote.get(0).style.top;
        var noteLeft = newNote.get(0).style.left;
        var pageSize = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);

        return {
            type: 'note',
            data: {
                point: [noteTop, noteLeft],
                relativePoint: [parseInt(noteTop, 10) / pageSize.height, parseInt(noteLeft, 10) / pageSize.width],
                id: newNote.data('id'),
                text: newNote.find('.content').text(),
                width: noteWidth,
                height: noteHeight
            }
        };
    }

    function renderNoteFromData(data) {
        _.defaults(data, {width: DEFAULT_NOTE_WIDTH, height: DEFAULT_NOTE_HEIGHT});

        function onSaveClick(e) {
            var note = $(e.target).parent().parent();
            exitEditMode(note);
            return false;
        }

        function noteBlurAction(e) {
            var note = $(e.currentTarget);
            exitEditMode(note);
            return false;
        }

        function onMoveComplete(e, ui) {
            newNote.parent().trigger(ActiveText.Notes.Events.UPDATE);
        }

        function onResizeComplete(e, ui) {
            newNote.parent().trigger(ActiveText.Notes.Events.UPDATE);
            e.stopImmediatePropagation();
        }

        function exitEditMode(note) {
            note.data('edit', false);
            var newText = note.find('.content textarea').val();
            note.find('.content').html(newText);
            note.find('.save-button').hide();
            note.parent().trigger(ActiveText.Notes.Events.UPDATE);
        }

        function enterEditMode(note) {
            note.data('edit', true);
            var existingText = note.find('.content').text();
            var newHTMLContent = $('<textarea cols="12" rows="4"></textarea>');
            note.find('.content').html(newHTMLContent);
            note.find('.save-button').show();
            newHTMLContent.blur(noteBlurAction);
            newHTMLContent.focus().val(existingText); // this positions the caret in the end - at least

        }

        function toggleEditMode(e) {
            var note = $(e.currentTarget);
            var isInEditMode = note.data('edit') === true;
            if(isInEditMode) {
                //                    exitEditMode(note);
                newNote.parent().trigger(ActiveText.Notes.Events.UPDATE);
            }
            else {
                enterEditMode(note);
            }
            return false;
        }

        function removeNote(e) {
            var removeButton = $(e.target);
            var note = removeButton.parent().parent();
            var annotationsLayer = note.parent();
            note.remove();
            annotationsLayer.trigger(ActiveText.Notes.Events.UPDATE);
        }

        function onMouseDown(e) {
            dragged = false;
            e.stopPropagation();
        }

        function onMouseUp(e) {
            var $target = $(e.target),
                editableElements = 'textarea, .content',
                closeElements = 'a[role="button"], div.close',
                saveElements = '.save-button',
                drawingToolsAreActive = $('.iwbToolsPanel').is(':visible');

            if(!dragged && !drawingToolsAreActive) {
                if($target.is(editableElements)) {
                    toggleEditMode(e);
                }
                else if($target.is(closeElements)) {
                    removeNote(e);
                }
                else if($target.is(saveElements)){
                    onSaveClick(e);
                }
            }
        }

        function onStartDrag() {
            if($('.iwbToolsPanel').is(':visible')) {
                return false;
            }
            dragged = true;
        }

        var dragged;

        var noteTemplate = '<div class="note-container">' +
            '<div class="note">' +
            '<button class="save-button" style="display:none" role="button">Save</button>' +
            '<div class="hide"></div>' +
            '<div class="close"><a href="#" title="Delete Note" role="button" aria-label="Delete Note">x</a></div>' +
            '<div class="content"></div>' +
            '</div>' +
            '</div>';

        data.point = data.relativePoint || data.point;
        var pageSize = ActiveText.ViewUtils.getUnscaledDPSTargetDimensions(activeTextInstance);
        var newNote = $(noteTemplate).data(data).css({
            // top: data.point[0],
            // left: data.point[1],
            top: pageSize.height * data.point[0] + 'px',
            left: pageSize.width * data.point[1] + 'px',
            width: data.width,
            height: data.height,
            position: 'absolute'
        });
        newNote.data('edit', false).find('.content').text(data.text);

        newNote.on({
            mousedown: onMouseDown,
            mouseup: onMouseUp
        }).draggable({
            cursor: 'move',
            stack: '.note-container',
            zIndex: 100,
            start: onStartDrag,
            stop: onMoveComplete
        }).find('.note').css({
            width: '100%',
            height: '100%'
        }).resizable({
            minWidth: 50,
            minHeight: 50,
            stop: onResizeComplete
        });

        return newNote;
    }

    return {
        renderNoteFromData: renderNoteFromData,
        getDataRepresentation: getDataRepresentation
    };
};