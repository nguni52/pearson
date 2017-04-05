/* global ActiveText */
/**
 * @class Events
 * @memberOf ActiveText
 * @type {{REFRESH: string, BOOK_STRUCTURE_LOADED: string, CONTAINER_XML_LOADED: string, OPF_DATA_LOADED: string, OPF_META_LOADED: string, NAVMAP_LOADED: string, RESOURCES_LOADED: string, RESOURCES_ERROR: string, RESIZE: string, CHANGE_SCALING_MODE: string, ANIMATE_PAGE: string, ANIMATE_PAGE_START: string, ANIMATE_PAGE_END: string, FRAME_CREATED: string, FRAME_CONTENT_LOADED: string, FRAME_CONTENT_ERROR: string, LOADED_OVERLAY_DATA: string, OVERLAY_DATA_FAIL: string, VIEW_MODE_CHANGED: string, LOADED_NOTES_FOR_INDEX: string, AUDIO_HIGHLIGHT_PAUSED: string}}
 */
ActiveText.Events = {
    REFRESH: 'refresh.activetext.events',
    BOOK_STRUCTURE_LOADED: 'bookstructureloaded.activetext.events',
    CONTAINER_XML_LOADED: 'containerxmlloaded.activetext.events',
    OPF_DATA_LOADED: 'opfdataloaded.activetext.events',
    OPF_META_LOADED: 'opfmetaloaded.activetext.events',
    NAVMAP_LOADED: 'navmaploaded.activetext.events',
    RESOURCES_LOADED: 'resourcesloaded.activetext.events',
    RESOURCES_ERROR: 'resourceserror.activetext.events',
    RESIZE: 'resize_at.activetext.events',
    CHANGE_SCALING_MODE: 'changeScalingMode.activetext.events',
    ANIMATE_PAGE: 'animatepageturn.activetext.events',
    ANIMATE_PAGE_START: 'animatepagestart.activetext.events',
    ANIMATE_PAGE_END: 'animatepageend.activetext.events',
    FRAME_CREATED: 'framecreated.activetext.events',
    FRAME_CONTENT_LOADED: 'framecontentloaded.activetext.events',
    FRAME_CONTENT_ERROR: 'framecontenterror.activetext.events',
    LOADED_OVERLAY_DATA: 'loadedoverlaydata.activetext.events',
    OVERLAY_DATA_FAIL: 'overlaydatafail.activetext.events',
    VIEW_MODE_CHANGED: 'viewmodechange.activetext.events',
    LOADED_NOTES_FOR_INDEX: 'haveNotesDataForIndex',
    AUDIO_HIGHLIGHT_PAUSED: 'audiohighlightpaused',
    UI_ELEMENT_CLICKED: 'uielementclicked',
    UI_ELEMENT_LOADED: 'uielementloaded'
};
