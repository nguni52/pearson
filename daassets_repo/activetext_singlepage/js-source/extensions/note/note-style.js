/* global ActiveText*/
ActiveText.namespace('ActiveText.Notes.Style');
ActiveText.Notes.Style = 'div.annotations {' +
    'position: relative;' +
    'z-index: 1;' + // prevent shadows falling behind containers with backgrounds
    'overflow: visible;' +
    'list-style: none;' +
    'margin: 0;' +
    'padding: 0;' +
    'pointer-events: none' +
    '}' +
    'div.annotations div.note {' +
    'position: relative;' +
    'float: left;' +
    'padding: 0;' +
    'background: #ffcc00;' + // Old browsers
    'background: -moz-linear-gradient(top,  #ffcc00 0%, #ffdf60 100%);' + // FF3.6+
    'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffcc00), color-stop(100%,#ffdf60));' + // Chrome,Safari4+
    'background: -webkit-linear-gradient(top,  #ffcc00 0%,#ffdf60 100%);' + // Chrome10+,Safari5.1+
    'background: -o-linear-gradient(top,  #ffcc00 0%,#ffdf60 100%);' + // Opera 11.10+
    'background: -ms-linear-gradient(top,  #ffcc00 0%,#ffdf60 100%);' + // IE10+
    'background: linear-gradient(to bottom,  #ffcc00 0%,#ffdf60 100%);' + // W3C
    'filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ffcc00", endColorstr="#ffdf60",GradientType=0 );' + // IE6-9
    '-webkit-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;' +
    '-moz-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;' +
    'box-shadow: 0 3px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.06) inset;' +
    '}' +
    'div.annotations div.note textarea {' +
    'background: transparent;' +
    'background: rgba(255,255,255,0.2);' +
    'border: none;' +
    'outline: none;' +
    'resize: none;' +
    'width:100%;' +
    'height:100%;' +
    '}' +
    'div.annotations div.note div.close {' +
    'position: absolute;' +
    'top:0;' +
    'right:0;' +
    'padding:6px 8px 12px;' +
    'line-height:8px;' +
    'cursor:pointer;' +
    'background:transparent' +
    '}' +
    'div.annotations div.note div.close a {' +
    'color:black;' +
    'text-decoration:none' +
    '}' +
    'div.annotations div.note div.close a:hover {' +
    'color:red' +
    '}' +
    'div.annotations div.note div.content {' +
    'word-wrap: break-word;' +
    'position: absolute;' +
    'top: 25px;' +
    'bottom: 10px;' +
    'left: 10px;' +
    'right: 10px;' +
    'overflow: hidden' +
    '}' +
    'div.annotations div.note:before,' +
    'div.annotations div.note:after {' +
    'content: "";' +
    'z-index: -1;' +
    'position: absolute;' +
    'left: 10px;' +
    'bottom: 10px;' +
    'width: 70%;' +
    'max-width: 300px;' + // avoid rotation causing ugly appearance at large container widths
    'max-height: 100px;' +
    'height: 55%;' +
    '-webkit-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);' +
    '-moz-box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);' +
    'box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);' +
    '-webkit-transform: skew(-15deg) rotate(-6deg);' +
    '-moz-transform: skew(-15deg) rotate(-6deg);' +
    '-ms-transform: skew(-15deg) rotate(-6deg);' +
    '-o-transform: skew(-15deg) rotate(-6deg);' +
    'transform: skew(-15deg) rotate(-6deg);' +
    '}' +
    'div.annotations div.note:after {' +
    'left: auto;' +
    'right: 10px;' +
    '-webkit-transform: skew(15deg) rotate(6deg);' +
    '-moz-transform: skew(15deg) rotate(6deg);' +
    '-ms-transform: skew(15deg) rotate(6deg);' +
    '-o-transform: skew(15deg) rotate(6deg);' +
    'transform: skew(15deg) rotate(6deg);' +
    '}' +
    '.ui-resizable-e {' +
    'cursor: e-resize;' +
    'width: 7px;' +
    'right: -5px;' +
    'top: 0;' +
    'height: 100%;' +
    '}' +
    '.ui-resizable-s {' +
    'cursor: s-resize;' +
    'height: 7px;' +
    'width: 100%;' +
    'bottom: -5px;' +
    'left: 0;' +
    '}' +
    '.ui-resizable-se {' +
    'cursor: se-resize;' +
    'width: 12px;' +
    'height: 12px;' +
    'right: 1px;' +
    'bottom: 1px;' +
    '}' +
    '.ui-resizable-handle {' +
    'position: absolute;' +
    'font-size: 0.1px;' +
    'display: block;' +
    '}' +
    '.note-container {' +
    'pointer-events:all' +
    '}';
