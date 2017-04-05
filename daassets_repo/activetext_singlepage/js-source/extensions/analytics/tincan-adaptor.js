/* global ActiveText */
ActiveText.TinCanAdaptor = function(tincan) {
    'use strict';

    var activeTextInstance;

    function init(instance) {
        if(!tincan) {
            debug.warn('Unable to start TinCanAdaptor because existing TinCan API Adaptor was not supplied.');
            return;
        }

        if(instance && instance.options && instance.options.containerElement) {
            $(instance.options.containerElement).on('remove', teardown);

            $(instance).on(ActiveText.Analytics.Events.BOOK_OPENED, transformBookOpened);
            $(instance).on(ActiveText.Analytics.Events.BOOK_CLOSED, transformBookClosed);
            $(instance).on(ActiveText.Analytics.Events.PAGE_VIEW, transformPageView);
            $(instance).on(ActiveText.Analytics.Events.PAGE_EXIT, transformPageExit);
            $(instance).on(ActiveText.Analytics.Events.OVERLAY_ACTIVATED, transformOverlayActivated);
            $(instance).on(ActiveText.Analytics.Events.WIDGET_CLOSED, transformWidgetClosed);

            activeTextInstance = instance;
        }

        function teardown() {
            $(instance.options.containerElement).off('remove', teardown);

            $(instance).off(ActiveText.Analytics.Events.BOOK_OPENED, transformBookOpened);
            $(instance).off(ActiveText.Analytics.Events.BOOK_CLOSED, transformBookClosed);
            $(instance).off(ActiveText.Analytics.Events.PAGE_VIEW, transformPageView);
            $(instance).off(ActiveText.Analytics.Events.PAGE_EXIT, transformPageExit);
            $(instance).off(ActiveText.Analytics.Events.OVERLAY_ACTIVATED, transformOverlayActivated);
            $(instance).off(ActiveText.Analytics.Events.WIDGET_CLOSED, transformWidgetClosed);

            activeTextInstance = undefined;
        }
    }

    function transformBookOpened(event, data) {
        var meta = activeTextInstance.data.getMetaData();
        var statementData = {};
        if(data) {
            var bookTitle, isbn;
            if(meta) {
                bookTitle = meta.title;
                isbn = meta.identifier;
            }
            statementData = {
                verb: {
                    id: 'http://activitystrea.ms/schema/1.0/access',
                    display: {
                        "en-US": "accessed"
                    }
                },
                object: {
                    id: data.whichbook,
                    definition: {
                        name: bookTitle,
                        type: "book",
                        extensions: {
                            "http://id.tincanapi.com/extension/isbn": isbn,
                            "http://id.tincanapi.com/extension/browser-info": data.browser
                        }
                    }
                },
                context: {
                    platform: data.host,
                    extensions: {
                        "http://id.tincanapi.com/extension/browser-info": data.browser
                    }
                }
            };
        }
        tincan.sendStatement(statementData);
    }

    function transformBookClosed(event, data) {
        var meta = activeTextInstance.data.getMetaData();
        var statementData = {};
        if(data) {
            var bookTitle, isbn;
            if(meta) {
                bookTitle = meta.title;
                isbn = meta.identifier;
            }
            statementData = {
                verb: {
                    id: 'http://adlnet.gov/expapi/verbs/exited',
                    display: {
                        "en-US": "exited"
                    }
                },
                object: {
                    id: data.whichbook,
                    definition: {
                        name: bookTitle,
                        type: "book",
                        extensions: {
                            "http://id.tincanapi.com/extension/isbn": isbn,
                            "http://id.tincanapi.com/extension/browser-info": data.browser
                        }
                    }
                },
                context: {
                    platform: data.host,
                    extensions: {
                        "http://id.tincanapi.com/extension/browser-info": data.browser
                    }
                }
            };
        }
        tincan.sendStatement(statementData);
    }

    function transformPageView(event, data) {
        var meta = activeTextInstance.data.getMetaData();
        var statementData = {};
        if(data) {
            var bookTitle, isbn;
            if(meta) {
                bookTitle = meta.title;
                isbn = meta.identifier;
            }
            statementData = {
                verb: {
                    id: 'http://activitystrea.ms/schema/1.0/read',
                    display: {
                        "en-US": "read"
                    }
                },
                object: {
                    id: data.pageurl,
                    definition: {
                        name: data.pagetitle,
                        type: "page",
                        extensions: {
                            "http://id.tincanapi.com/extension/browser-info": data.browser
                        }
                    }
                },
                context: {
                    contextActivities: {
                        parent: {
                            id: data.whichbook,
                            definition: {
                                name: bookTitle,
                                type: "book",
                                extensions: {
                                    "http://id.tincanapi.com/extension/isbn": isbn,
                                    "http://id.tincanapi.com/extension/browser-info": data.browser
                                }
                            }
                        }
                    },
                    platform: data.host,
                    extensions: {
                        "http://id.tincanapi.com/extension/browser-info": data.browser
                    }
                }
            };
        }
        tincan.sendStatement(statementData);
    }

    function transformPageExit(event, data) {
        var meta = activeTextInstance.data.getMetaData();
        var statementData = {};
        if(data) {
            var bookTitle, isbn;
            if(meta) {
                bookTitle = meta.title;
                isbn = meta.identifier;
            }
            statementData = {
                verb: {
                    id: 'http://adlnet.gov/expapi/verbs/exited',
                    display: {
                        "en-US": "exited"
                    }
                },
                object: {
                    id: data.pageurl,
                    definition: {
                        name: data.pagetitle,
                        type: "page",
                        extensions: {
                            "http://id.tincanapi.com/extension/browser-info": data.browser
                        }
                    }
                },
                context: {
                    contextActivities: {
                        parent: {
                            id: data.whichbook,
                            definition: {
                                name: bookTitle,
                                type: "book",
                                extensions: {
                                    "http://id.tincanapi.com/extension/isbn": isbn,
                                    "http://id.tincanapi.com/extension/browser-info": data.browser
                                }
                            }
                        }
                    },
                    platform: data.host,
                    extensions: {
                        "http://id.tincanapi.com/extension/browser-info": data.browser
                    }
                }
            };
        }
        tincan.sendStatement(statementData);
    }

    function transformOverlayActivated(event, data) {
        var meta = activeTextInstance.data.getMetaData();
        var statementData = {};
        if(data) {
            var bookTitle, isbn;
            if(meta) {
                bookTitle = meta.title;
                isbn = meta.identifier;
            }
            statementData = {
                verb: {
                    id: 'http://adlnet.gov/expapi/verbs/launched',
                    display: {
                        "en-US": "launched"
                    }
                },
                object: {
                    id: data.uridata,
                    definition: {
                        name: data.title,
                        type: "application"
                    }
                },
                context: {
                    contextActivities: {
                        parent: {
                            id: data.whichbook,
                            definition: {
                                name: bookTitle,
                                type: "book",
                                extensions: {
                                    "http://id.tincanapi.com/extension/isbn": isbn,
                                    "http://id.tincanapi.com/extension/browser-info": data.browser
                                }
                            }
                        }
                    },
                    platform: data.host,
                    extensions: {
                        "http://id.tincanapi.com/extension/browser-info": data.browser
                    }
                }
            };
        }
        tincan.sendStatement(statementData);
    }

    function transformWidgetClosed(event, data) {
        var meta = activeTextInstance.data.getMetaData();
        var statementData = {};
        if(data) {
            var bookTitle, isbn;
            if(meta) {
                bookTitle = meta.title;
                isbn = meta.identifier;
            }
            statementData = {
                verb: {
                    id: 'http://adlnet.gov/expapi/verbs/exited',
                    display: {
                        "en-US": "exited"
                    }
                },
                object: {
                    id: data.uridata,
                    definition: {
                        name: data.title,
                        type: "application"
                    }
                },
                context: {
                    contextActivities: {
                        parent: {
                            id: data.whichbook,
                            definition: {
                                name: bookTitle,
                                type: "book",
                                extensions: {
                                    "http://id.tincanapi.com/extension/isbn": isbn,
                                    "http://id.tincanapi.com/extension/browser-info": data.browser
                                }
                            }
                        }
                    },
                    platform: data.host,
                    extensions: {
                        "http://id.tincanapi.com/extension/browser-info": data.browser
                    }
                }
            };
        }
        tincan.sendStatement(statementData);
    }

    return {
        init: init,
        key: 'tincan'
    };
};