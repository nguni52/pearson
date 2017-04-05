/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-fontface-backgroundsize-boxshadow-flexbox-flexboxlegacy-hsla-multiplebgs-opacity-rgba-textshadow-cssanimations-generatedcontent-csstransforms-csstransforms3d-csstransitions-applicationcache-canvas-hashchange-history-audio-indexeddb-localstorage-postmessage-sessionstorage-websqldatabase-inlinesvg-smil-svg-svgclippaths-touch-shiv-cssclasses-addtest-prefixed-teststyles-testprop-testallprops-hasevent-prefixes-domprefixes-cors-fullscreen_api-ie8compat-json
 */
(function()
{
    /* jshint strict: false, sub: true, nomen: false */
    var tests = {};
    var mod = 'modernizr';
    var smile = ':)';
    var ns = {'svg' : 'http://www.w3.org/2000/svg'};

    tests['flexbox'] = function()
    {
        return window.Modernizr.testAllProps('flexWrap');
    };

    tests['flexboxlegacy'] = function()
    {
        return window.Modernizr.testAllProps('boxDirection');
    };

    tests['canvas'] = function()
    {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['touch'] = function()
    {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
        {
            bool = true;
        }
        else
        {
            window.Modernizr.testStyles(['@media (', window.Modernizr._prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function(node)
            {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    };
    tests['postmessage'] = function()
    {
        return !!window.postMessage;
    };

    tests['websqldatabase'] = function()
    {
        return !!window.openDatabase;
    };

    tests['indexedDB'] = function()
    {
        return !!window.Modernizr.testAllProps("indexedDB", window);
    };

    tests['hashchange'] = function()
    {
        return window.Modernizr.hasEvent('hashchange', window) &&
            (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function()
    {
        return !!(window.history && history.pushState);
    };

    tests['rgba'] = function()
    {
        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(150,255,150,.5)';
        return ('' + style.backgroundColor).indexOf('rgba') > -1;
    };

    tests['hsla'] = function()
    {
        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:hsla(120,40%,100%,.5)';
        return (style.backgroundColor.indexOf('rgba') > -1) || (style.backgroundColor.indexOf('hsla') > -1);
    };

    tests['multiplebgs'] = function()
    {
        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background:url(https://),url(https://),red url(https://)';

        // If the UA supports multiple backgrounds, there should be three occurrences
        // of the string "url(" in the return value for elemStyle.background
        return (/(url\s*\(.*?){3}/).test(style.background);
    };

    tests['backgroundsize'] = function()
    {
        return window.Modernizr.testAllProps('backgroundSize');
    };

    tests['boxshadow'] = function()
    {
        return window.Modernizr.testAllProps('boxShadow');
    };

    tests['textshadow'] = function()
    {
        return document.createElement('div').style.textShadow === '';
    };

    tests['opacity'] = function()
    {
        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = window.Modernizr._prefixes.join('opacity:.55;');

        // The non-literal . in this regex is intentional:
        // German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(style.opacity);
    };

    tests['cssanimations'] = function()
    {
        return window.Modernizr.testAllProps('animationName');
    };

    tests['csstransforms'] = function()
    {
        return !!window.Modernizr.testAllProps('transform');
    };

    tests['csstransforms3d'] = function()
    {

        var ret = !!window.Modernizr.testAllProps('perspective');

        if(ret && 'webkitPerspective' in document.documentElement.style)
        {

            window.Modernizr.testStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function(node, rule)
            {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;
    };

    tests['csstransitions'] = function()
    {
        return window.Modernizr.testAllProps('transition');
    };

    tests['fontface'] = function()
    {
        var bool;

        window.Modernizr.testStyles('@font-face {font-family:"font";src:url("https://")}', function(node, rule)
        {
            var style = document.getElementById('smodernizr'),
                sheet = style.sheet || style.styleSheet,
                cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText ||
                    '') : '';

            bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };

    tests['generatedcontent'] = function()
    {
        var bool;

        window.Modernizr.testStyles(['#', mod, '{font:0/0 a}#', mod, ':after{content:"', smile, '";visibility:hidden;font:3px/1 a}'].join(''), function(node)
        {
            bool = node.offsetHeight >= 3;
        });

        return bool;
    };

    tests['audio'] = function()
    {
        var elem = document.createElement('audio'),
            bool = false;

        try
        {
            if(bool = !!elem.canPlayType)
            {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');

                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                bool.m4a = ( elem.canPlayType('audio/x-m4a;') ||
                    elem.canPlayType('audio/aac;')).replace(/^no$/, '');
            }
        }
        catch(e)
        {
        }

        return bool;
    };

    tests['localstorage'] = function()
    {
        try
        {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        }
        catch(e)
        {
            return false;
        }
    };

    tests['sessionstorage'] = function()
    {
        try
        {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        }
        catch(e)
        {
            return false;
        }
    };
    tests['applicationcache'] = function()
    {
        return !!window.applicationCache;
    };

    tests['svg'] = function()
    {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function()
    {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    tests['smil'] = function()
    {
        return !!document.createElementNS &&
            /SVGAnimate/.test({}.toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    tests['svgclippaths'] = function()
    {
        return !!document.createElementNS &&
            /SVGClipPath/.test({}.toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };
    if(window.Modernizr)
    {
        for(var key in tests)
        {
            if(typeof(key) === "string")
            {
                var test = tests[key];
                if(!window.Modernizr.hasOwnProperty(key))
                {
                    window.Modernizr.addTest(key, test);
                }
            }
        }
    }
    else
    {
        window.Modernizr = (function(window, document, undefined)
        {

            var version = '2.6.2',

                Modernizr = {},

                enableClasses = true,

                docElement = document.documentElement,

                mod = 'modernizr',
                modElem = document.createElement(mod),
                mStyle = modElem.style,

                inputElem  ,

                smile = ':)',

                toString = {}.toString,

                prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),

                omPrefixes = 'Webkit Moz O ms',

                cssomPrefixes = omPrefixes.split(' '),

                domPrefixes = omPrefixes.toLowerCase().split(' '),

                ns = {'svg' : 'http://www.w3.org/2000/svg'},

                tests = tests,//{},
                inputs = {},
                attrs = {},

                classes = [],

                slice = classes.slice,

                featureName,

                injectElementWithStyles = function(rule, callback, nodes, testnames)
                {

                    var style, ret, node, docOverflow,
                        div = document.createElement('div'),
                        body = document.body,
                        fakeBody = body || document.createElement('body');

                    if(parseInt(nodes, 10))
                    {
                        while(nodes--)
                        {
                            node = document.createElement('div');
                            node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                            div.appendChild(node);
                        }
                    }

                    style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
                    div.id = mod;
                    (body ? div : fakeBody).innerHTML += style;
                    fakeBody.appendChild(div);
                    if(!body)
                    {
                        fakeBody.style.background = '';
                        fakeBody.style.overflow = 'hidden';
                        docOverflow = docElement.style.overflow;
                        docElement.style.overflow = 'hidden';
                        docElement.appendChild(fakeBody);
                    }

                    ret = callback(div, rule);
                    if(!body)
                    {
                        fakeBody.parentNode.removeChild(fakeBody);
                        docElement.style.overflow = docOverflow;
                    }
                    else
                    {
                        div.parentNode.removeChild(div);
                    }

                    return !!ret;

                },

                isEventSupported = (function()
                {

                    var TAGNAMES = {
                        'select' : 'input', 'change' : 'input',
                        'submit' : 'form', 'reset' : 'form',
                        'error'  : 'img', 'load' : 'img', 'abort' : 'img'
                    };

                    function isEventSupported(eventName, element)
                    {

                        element = element || document.createElement(TAGNAMES[eventName] || 'div');
                        eventName = 'on' + eventName;

                        var isSupported = eventName in element;

                        if(!isSupported)
                        {
                            if(!element.setAttribute)
                            {
                                element = document.createElement('div');
                            }
                            if(element.setAttribute && element.removeAttribute)
                            {
                                element.setAttribute(eventName, '');
                                isSupported = is(element[eventName], 'function');

                                if(!is(element[eventName], 'undefined'))
                                {
                                    element[eventName] = undefined;
                                }
                                element.removeAttribute(eventName);
                            }
                        }

                        element = null;
                        return isSupported;
                    }

                    return isEventSupported;
                })(),

                _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

            if(!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined'))
            {
                hasOwnProp = function(object, property)
                {
                    return _hasOwnProperty.call(object, property);
                };
            }
            else
            {
                hasOwnProp = function(object, property)
                {
                    return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
                };
            }

            if(!Function.prototype.bind)
            {
                Function.prototype.bind = function bind(that)
                {

                    var target = this;

                    if(typeof target != "function")
                    {
                        throw new TypeError();
                    }

                    var args = slice.call(arguments, 1),
                        bound = function()
                        {

                            if(this instanceof bound)
                            {

                                var F = function()
                                {
                                };
                                F.prototype = target.prototype;
                                var self = new F();

                                var result = target.apply(
                                    self,
                                    args.concat(slice.call(arguments))
                                );
                                if(Object(result) === result)
                                {
                                    return result;
                                }
                                return self;

                            }
                            else
                            {

                                return target.apply(
                                    that,
                                    args.concat(slice.call(arguments))
                                );

                            }

                        };

                    return bound;
                };
            }

            function setCss(str)
            {
                mStyle.cssText = str;
            }

            function setCssAll(str1, str2)
            {
                return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
            }

            function is(obj, type)
            {
                return typeof obj === type;
            }

            function contains(str, substr)
            {
                return !!~('' + str).indexOf(substr);
            }

            function testProps(props, prefixed)
            {
                for(var i in props)
                {
                    var prop = props[i];
                    if(!contains(prop, "-") && mStyle[prop] !== undefined)
                    {
                        return prefixed == 'pfx' ? prop : true;
                    }
                }
                return false;
            }

            function testDOMProps(props, obj, elem)
            {
                for(var i in props)
                {
                    var item = obj[props[i]];
                    if(item !== undefined)
                    {

                        if(elem === false)
                        {
                            return props[i];
                        }

                        if(is(item, 'function'))
                        {
                            return item.bind(elem || obj);
                        }

                        return item;
                    }
                }
                return false;
            }

            function testPropsAll(prop, prefixed, elem)
            {

                var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
                    props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

                if(is(prefixed, "string") || is(prefixed, "undefined"))
                {
                    return testProps(props, prefixed);

                }
                else
                {
                    props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
                    return testDOMProps(props, prefixed, elem);
                }
            }

            for(var feature in tests)
            {
                if(hasOwnProp(tests, feature))
                {
                    featureName = feature.toLowerCase();
                    Modernizr[featureName] = tests[feature]();

                    classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
                }
            }

            Modernizr.addTest = function(feature, test)
            {
                if(typeof feature == 'object')
                {
                    for(var key in feature)
                    {
                        if(hasOwnProp(feature, key))
                        {
                            Modernizr.addTest(key, feature[ key ]);
                        }
                    }
                }
                else
                {

                    feature = feature.toLowerCase();

                    if(Modernizr[feature] !== undefined)
                    {
                        return Modernizr;
                    }

                    test = typeof test == 'function' ? test() : test;

                    if(typeof enableClasses !== "undefined" && enableClasses)
                    {
                        docElement.className += ' ' + (test ? '' : 'no-') + feature;
                    }
                    Modernizr[feature] = test;

                }

                return Modernizr;
            };

            setCss('');
            modElem = inputElem = null;

            ;
            (function(window, document)
            {
                var options = window.html5 || {};

                var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

                var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

                var supportsHtml5Styles;

                var expando = '_html5shiv';

                var expanID = 0;

                var expandoData = {};

                var supportsUnknownElements;

                (function()
                {
                    try
                    {
                        var a = document.createElement('a');
                        a.innerHTML = '<xyz></xyz>';
                        supportsHtml5Styles = ('hidden' in a);

                        supportsUnknownElements = a.childNodes.length == 1 || (function()
                        {
                            (document.createElement)('a');
                            var frag = document.createDocumentFragment();
                            return (
                                typeof frag.cloneNode == 'undefined' ||
                                    typeof frag.createDocumentFragment == 'undefined' ||
                                    typeof frag.createElement == 'undefined'
                                );
                        }());
                    }
                    catch(e)
                    {
                        supportsHtml5Styles = true;
                        supportsUnknownElements = true;
                    }

                }());
                function addStyleSheet(ownerDocument, cssText)
                {
                    var p = ownerDocument.createElement('p'),
                        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

                    p.innerHTML = 'x<style>' + cssText + '</style>';
                    return parent.insertBefore(p.lastChild, parent.firstChild);
                }

                function getElements()
                {
                    var elements = html5.elements;
                    return typeof elements == 'string' ? elements.split(' ') : elements;
                }

                function getExpandoData(ownerDocument)
                {
                    var data = expandoData[ownerDocument[expando]];
                    if(!data)
                    {
                        data = {};
                        expanID++;
                        ownerDocument[expando] = expanID;
                        expandoData[expanID] = data;
                    }
                    return data;
                }

                function createElement(nodeName, ownerDocument, data)
                {
                    if(!ownerDocument)
                    {
                        ownerDocument = document;
                    }
                    if(supportsUnknownElements)
                    {
                        return ownerDocument.createElement(nodeName);
                    }
                    if(!data)
                    {
                        data = getExpandoData(ownerDocument);
                    }
                    var node;

                    if(data.cache[nodeName])
                    {
                        node = data.cache[nodeName].cloneNode();
                    }
                    else if(saveClones.test(nodeName))
                    {
                        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
                    }
                    else
                    {
                        node = data.createElem(nodeName);
                    }

                    return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
                }

                function createDocumentFragment(ownerDocument, data)
                {
                    if(!ownerDocument)
                    {
                        ownerDocument = document;
                    }
                    if(supportsUnknownElements)
                    {
                        return ownerDocument.createDocumentFragment();
                    }
                    data = data || getExpandoData(ownerDocument);
                    var clone = data.frag.cloneNode(),
                        i = 0,
                        elems = getElements(),
                        l = elems.length;
                    for(; i < l; i++)
                    {
                        clone.createElement(elems[i]);
                    }
                    return clone;
                }

                function shivMethods(ownerDocument, data)
                {
                    if(!data.cache)
                    {
                        data.cache = {};
                        data.createElem = ownerDocument.createElement;
                        data.createFrag = ownerDocument.createDocumentFragment;
                        data.frag = data.createFrag();
                    }

                    ownerDocument.createElement = function(nodeName)
                    {
                        if(!html5.shivMethods)
                        {
                            return data.createElem(nodeName);
                        }
                        return createElement(nodeName, ownerDocument, data);
                    };

                    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                        'var n=f.cloneNode(),c=n.createElement;' +
                        'h.shivMethods&&(' +
                        getElements().join().replace(/\w+/g, function(nodeName)
                        {
                            data.createElem(nodeName);
                            data.frag.createElement(nodeName);
                            return 'c("' + nodeName + '")';
                        }) +
                        ');return n}'
                    )(html5, data.frag);
                }

                function shivDocument(ownerDocument)
                {
                    if(!ownerDocument)
                    {
                        ownerDocument = document;
                    }
                    var data = getExpandoData(ownerDocument);

                    if(html5.shivCSS && !supportsHtml5Styles && !data.hasCSS)
                    {
                        data.hasCSS = !!addStyleSheet(ownerDocument,
                            'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
                                'mark{background:#FF0;color:#000}'
                        );
                    }
                    if(!supportsUnknownElements)
                    {
                        shivMethods(ownerDocument, data);
                    }
                    return ownerDocument;
                }

                var html5 = {

                    'elements' : options.elements ||
                        'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

                    'shivCSS' : (options.shivCSS !== false),

                    'supportsUnknownElements' : supportsUnknownElements,

                    'shivMethods' : (options.shivMethods !== false),

                    'type' : 'default',

                    'shivDocument' : shivDocument,

                    createElement : createElement,

                    createDocumentFragment : createDocumentFragment
                };
                window.html5 = html5;

                shivDocument(document);

            }(this, document));

            Modernizr._version = version;

            Modernizr._prefixes = prefixes;
            Modernizr._domPrefixes = domPrefixes;
            Modernizr._cssomPrefixes = cssomPrefixes;

            Modernizr.hasEvent = isEventSupported;

            Modernizr.testProp = function(prop)
            {
                return testProps([prop]);
            };

            Modernizr.testAllProps = testPropsAll;

            Modernizr.testStyles = injectElementWithStyles;
            Modernizr.prefixed = function(prop, obj, elem)
            {
                if(!obj)
                {
                    return testPropsAll(prop, 'pfx');
                }
                else
                {
                    return testPropsAll(prop, obj, elem);
                }
            };

            docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                (enableClasses ? ' js ' + classes.join(' ') : '');

            return Modernizr;

        })(this, this.document);

        for(var key in tests)
        {
            if(typeof(key) === "string")
            {
                var test = tests[key];
                if(!window.Modernizr.hasOwnProperty(key))
                {
                    window.Modernizr.addTest(key, test);
                }
            }
        }
    }
    // cors
    // By Theodoor van Donge
    window.Modernizr.addTest('cors', !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()));
    window.Modernizr.addTest('fullscreen', function()
    {
        for(var i = 0; i < window.Modernizr._domPrefixes.length; i++)
        {
            if(document[window.Modernizr._domPrefixes[i].toLowerCase() + 'CancelFullScreen'])
            {
                return true;
            }
        }
        return !!document['cancelFullScreen'] || false;
    });

    // http://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW20
    // https://developer.mozilla.org/en/API/Fullscreen

    // IE8 compat mode aka Fake IE7
    // by Erich Ocean

    // In this case, IE8 will be acting as IE7. You may choose to remove features in this case.

    // related:
    // james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/

    window.Modernizr.addTest('ie8compat', function()
    {
        return (!window.addEventListener && document.documentMode && document.documentMode === 7);
    });
    // native JSON support.
    // developer.mozilla.org/en/JSON

    // this will also succeed if you've loaded the JSON2.js polyfill ahead of time
    //   ... but that should be obvious. :)

    window.Modernizr.addTest('json', !!window.JSON && !!JSON.parse);
})();