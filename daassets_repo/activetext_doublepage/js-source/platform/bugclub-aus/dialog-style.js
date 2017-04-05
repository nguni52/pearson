/* global ActiveText, BugClubAus */
ActiveText.namespace("BugClubAus.DialogStyleText");
BugClubAus.DialogStyleText = (function(ActiveText) {
    "use strict";

    function getStyle(activeTextInstance) {
        /**
         * @const
         * @type {string}
         */
        var pathToResources = ActiveText.SkinUtils.getPathToResources(activeTextInstance);

        /**
         * @const
         * @type {string}
         */
        return ".ui-helper-hidden{display:none}" +
            ".ui-helper-hidden-accessible{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}" +
            ".ui-helper-reset{margin:0;padding:0;border:0;outline:0;line-height:1.3;text-decoration:none;font-size:100%;list-style:none}" +
            ".ui-helper-clearfix:before,.ui-helper-clearfix:after{content:\"\";display:table;border-collapse:collapse}" +
            ".ui-helper-clearfix:after{clear:both}" +
            ".ui-helper-clearfix{min-height:0}" +
            ".ui-helper-zfix{width:100%;height:100%;top:0;left:0;position:absolute;opacity:0;filter:Alpha(Opacity=0)}" +
            ".ui-front{z-index:1000}" +
            ".ui-state-disabled{cursor:default!important}" +
            ".ui-icon{display:block;text-indent:-99999px;overflow:hidden;background-repeat:no-repeat}" +
            ".ui-widget-overlay{position:fixed;top:0;left:0;width:100%;height:100%}" +
            ".ui-resizable{position:relative}" +
            ".ui-resizable-handle{position:absolute;font-size:.1px;display:block}" +
            ".ui-resizable-disabled .ui-resizable-handle,.ui-resizable-autohide .ui-resizable-handle{display:none}" +
            ".ui-resizable-n{cursor:n-resize;height:7px;width:100%;top:-5px;left:0}" +
            ".ui-resizable-s{cursor:s-resize;height:7px;width:100%;bottom:-5px;left:0}" +
            ".ui-resizable-e{cursor:e-resize;width:7px;right:-5px;top:0;height:100%}" +
            ".ui-resizable-w{cursor:w-resize;width:7px;left:-5px;top:0;height:100%}" +
            ".ui-resizable-se{cursor:se-resize;width:12px;height:12px;right:1px;bottom:1px}" +
            ".ui-resizable-sw{cursor:sw-resize;width:9px;height:9px;left:-5px;bottom:-5px}" +
            ".ui-resizable-nw{cursor:nw-resize;width:9px;height:9px;left:-5px;top:-5px}" +
            ".ui-resizable-ne{cursor:ne-resize;width:9px;height:9px;right:-5px;top:-5px}" +
            ".ui-button{display:inline-block;position:relative;padding:0;line-height:normal;margin-right:.1em;cursor:pointer;vertical-align:initial;text-align:center;overflow:visible}" +
            ".ui-button,.ui-button:link,.ui-button:visited,.ui-button:hover,.ui-button:active{text-decoration:none}" +
            ".ui-button-icon-only{width:2.2em}button.ui-button-icon-only{width:2.4em}" +
            ".ui-button-icons-only{width:3.4em}button.ui-button-icons-only{width:3.7em}" +
            ".ui-button .ui-button-text{display:block;line-height:normal}" +
            ".ui-button-text-only .ui-button-text{padding:.1em .2em}" +
            ".ui-button-icon-only .ui-button-text,.ui-button-icons-only .ui-button-text{padding:.4em;text-indent:-9999999px}" +
            ".ui-button-text-icon-primary .ui-button-text,.ui-button-text-icons .ui-button-text{padding:.4em 1em .4em 2.1em}" +
            ".ui-button-text-icon-secondary .ui-button-text,.ui-button-text-icons .ui-button-text{padding:.4em 2.1em .4em 1em}" +
            ".ui-button-text-icons .ui-button-text{padding-left:2.1em;padding-right:2.1em}input.ui-button{padding:.4em 1em}" +
            ".ui-button-icon-only .ui-icon,.ui-button-text-icon-primary .ui-icon,.ui-button-text-icon-secondary .ui-icon,.ui-button-text-icons .ui-icon,.ui-button-icons-only .ui-icon{position:absolute;top:50%;margin-top:-8px}" +
            ".ui-button-icon-only .ui-icon{left:50%;margin-left:-8px}" +
            ".ui-button-text-icon-primary .ui-button-icon-primary,.ui-button-text-icons .ui-button-icon-primary,.ui-button-icons-only .ui-button-icon-primary{left:.5em}" +
            ".ui-button-text-icon-secondary .ui-button-icon-secondary,.ui-button-text-icons .ui-button-icon-secondary,.ui-button-icons-only .ui-button-icon-secondary{right:.5em}" +
            ".ui-buttonset{margin-right:7px}" +
            ".ui-buttonset .ui-button{margin-left:0;margin-right:-.3em}input.ui-button::-moz-focus-inner,button.ui-button::-moz-focus-inner{border:0;padding:0}" +
            ".ui-dialog{position:absolute;top:0;left:0;padding:0em;outline:0;" +
            "-moz-box-shadow: 0 4px 8px rgba(0,0,0,0.5);" +
            "-webkit-box-shadow: 0 4px 8px rgba(0,0,0,0.5);" +
            "box-shadow: 0 4px 8px rgba(0,0,0,0.5);" +
            "}" +
            "img {vertical-align:initial;}" +
            ".ui-dialog .ui-dialog-titlebar{" +
            "padding:0 .2em;" +
            "position:relative}" +
            ".ui-dialog .ui-dialog-title{float:left;margin:.1em 0;white-space:nowrap;width:90%;overflow:hidden;text-overflow:ellipsis}" +
            ".ui-dialog .ui-dialog-titlebar-close{position:absolute;right:.3em;top:50%;width:21px;margin:-10px 0 0 0;padding:1px;height:20px}" +
            ".ui-dialog .ui-dialog-content{position:relative;border:0;" +
            "padding:.5em;" +
            "background:0;overflow:auto}" +
            ".ui-dialog .ui-dialog-buttonpane{text-align:left;border-width:1px 0 0;background-image:none;margin-top:.5em;padding:.3em 1em .5em .4em}" +
            ".ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset{float:right}" +
            ".ui-dialog .ui-dialog-buttonpane button{margin:.5em .4em .5em 0;cursor:pointer}" +
            ".ui-dialog .ui-resizable-se{width:12px;height:12px;right:-5px;bottom:-5px;background-position:16px 16px}" +
            ".ui-draggable .ui-dialog-titlebar{cursor:move}" +
            ".ui-widget .ui-widget{font-size:1em}" +
            ".ui-widget input,.ui-widget select,.ui-widget textarea,.ui-widget button{font-family:Helvetica,Arial,sans-serif;font-size:1em}" +
            ".ui-widget-content{" +
            "border:1px solid #5693af;" +
            "background:#649393;" +
            "color:#222}" +
            ".ui-widget-content .content{" +
            "background:#fff;" +
            "padding:.5em;" +
            "}" +
            ".ui-widget-content a{color:#222}" +
            ".ui-widget-header{" +
            "background:#649393 url(" + pathToResources +
            "img/bugclub/dialog/ui-bg_flat_0_649393_40x100.png) 50% 50% repeat-x;color:#fff;font-weight:bold}" +
            ".ui-widget-header a{color:#fff}" +
            ".ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default{border:1px solid #5693af;background:#c8eafc url(" +
            pathToResources +
            "img/bugclub/dialog/ui-bg_glass_100_c8eafc_1x400.png) 50% 50% repeat-x;font-weight:normal;color:#000}" +
            ".ui-state-default a,.ui-state-default a:link,.ui-state-default a:visited{color:#000;text-decoration:none}" +
            ".ui-state-hover,.ui-widget-content .ui-state-hover,.ui-widget-header .ui-state-hover,.ui-state-focus,.ui-widget-content .ui-state-focus,.ui-widget-header .ui-state-focus{border:1px solid #5693af;background:#a9e0fa url(" +
            pathToResources +
            "img/bugclub/dialog/ui-bg_glass_100_a9e0fa_1x400.png) 50% 50% repeat-x;font-weight:normal;color:#000}" +
            ".ui-state-hover a,.ui-state-hover a:hover,.ui-state-hover a:link,.ui-state-hover a:visited{color:#000;text-decoration:none}" +
            ".ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active{border:1px solid #5693af;background:#ffc70b url(" +
            pathToResources +
            "img/bugclub/dialog/ui-bg_glass_100_ffc70b_1x400.png) 50% 50% repeat-x;font-weight:normal;color:#000}" +
            ".ui-state-active a,.ui-state-active a:link,.ui-state-active a:visited{color:#000;text-decoration:none}" +
            ".ui-state-highlight,.ui-widget-content .ui-state-highlight,.ui-widget-header .ui-state-highlight{border:1px solid #f47721;background:#ffc70b url(" +
            pathToResources + "img/bugclub/dialog/ui-bg_glass_100_ffc70b_1x400.png) 50% 50% repeat-x;color:#000}" +
            ".ui-state-highlight a,.ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a{color:#000}" +
            ".ui-state-error,.ui-widget-content .ui-state-error,.ui-widget-header .ui-state-error{border:1px solid #cd0a0a;background:#fef1ec url(" +
            pathToResources + "img/bugclub/dialog/ui-bg_glass_95_fef1ec_1x400.png) 50% 50% repeat-x;color:#cd0a0a}" +
            ".ui-state-error a,.ui-widget-content .ui-state-error a,.ui-widget-header .ui-state-error a{color:#cd0a0a}" +
            ".ui-state-error-text,.ui-widget-content .ui-state-error-text,.ui-widget-header .ui-state-error-text{color:#cd0a0a}" +
            ".ui-priority-primary,.ui-widget-content .ui-priority-primary,.ui-widget-header .ui-priority-primary{font-weight:bold}" +
            ".ui-priority-secondary,.ui-widget-content .ui-priority-secondary,.ui-widget-header .ui-priority-secondary{opacity:.7;filter:Alpha(Opacity=70);font-weight:normal}" +
            ".ui-state-disabled,.ui-widget-content .ui-state-disabled,.ui-widget-header .ui-state-disabled{opacity:.35;filter:Alpha(Opacity=35);background-image:none}" +
            ".ui-state-disabled .ui-icon{filter:Alpha(Opacity=35)}" +
            ".ui-icon{width:16px;height:16px}" +
            ".ui-icon,.ui-widget-content .ui-icon{background-image:url(" + pathToResources +
            "img/bugclub/dialog/ui-icons_ffffff_256x240.png)}" +
            ".ui-widget-header .ui-icon{background-image:url(" + pathToResources + "img/bugclub/dialog/ui-icons_91d0d0_256x240.png)}" +
            ".ui-state-default .ui-icon{background-image:url(" + pathToResources + "img/bugclub/dialog/ui-icons_000000_256x240.png)}" +
            ".ui-state-hover .ui-icon,.ui-state-focus .ui-icon{background-image:url(" + pathToResources + "img/bugclub/dialog/ui-icons_000000_256x240.png)}" +
            ".ui-state-active .ui-icon{background-image:url(" + pathToResources + "img/bugclub/dialog/ui-icons_000000_256x240.png)}" +
            ".ui-state-highlight .ui-icon{background-image:url(" + pathToResources + "img/bugclub/dialog/ui-icons_000000_256x240.png)}" +
            ".ui-state-error .ui-icon,.ui-state-error-text .ui-icon{background-image:url(" + pathToResources + "img/bugclub/dialog/ui-icons_cd0a0a_256x240.png)}" +
            ".ui-dialog .ui-dialog-titlebar-close {" +
            "background:transparent !important;" +
            "outline:none;" +
            "width:26px;" +
            "height:26px;" +
            "margin-top:4px;" +
            "margin-right:1px;" +
            "top:0;" +
            "}" +
            ".ui-dialog .ui-dialog-titlebar-close.ui-button-icon-only .ui-icon {" +
            "top:0;" +
            "left:0;" +
            "margin:0;" +
            "padding:0;" +
            "}" +
            ".ui-icon-closethick,.ui-dialog .ui-dialog-titlebar-close{" +
            "width:26px;" +
            "height:26px;" +
            "background-size:contain;" +
            "background:transparent url(" + pathToResources + "img/bugclub/legacy/ks1/pupil/Button_smallteacherClose_upSkin.png) top left no-repeat !important;" +
            "margin-top:2px;" +
            "border:none;" +
            "}" +
            ".ui-icon-closethick:hover,.ui-icon-closethick.ui-state-hover,.ui-dialog .ui-dialog-titlebar-close.ui-state-hover{" +
            "background:transparent url(" + pathToResources + "img/bugclub/legacy/ks1/pupil/Button_smallteacherClose_overSkin.png) top left no-repeat !important;" +
            "border:none;" +
            "}" +
            ".ui-icon-grip-dotted-vertical{background-position:0 -224px}.ui-icon-grip-dotted-horizontal{background-position:-16px -224px}.ui-icon-grip-solid-vertical{background-position:-32px -224px}.ui-icon-grip-solid-horizontal{background-position:-48px -224px}.ui-icon-gripsmall-diagonal-se{background-position:-64px -224px}.ui-icon-grip-diagonal-se{background-position:-80px -224px}.ui-corner-all,.ui-corner-top,.ui-corner-left,.ui-corner-tl{border-top-left-radius:6px}.ui-corner-all,.ui-corner-top,.ui-corner-right,.ui-corner-tr{border-top-right-radius:6px}.ui-corner-all,.ui-corner-bottom,.ui-corner-left,.ui-corner-bl{border-bottom-left-radius:6px}.ui-corner-all,.ui-corner-bottom,.ui-corner-right,.ui-corner-br{border-bottom-right-radius:6px}" +
            ".ui-widget-overlay{background:#000 url(" + pathToResources + "img/bugclub/dialog/ui-bg_flat_50_000000_40x100.png) 50% 50% repeat-x;opacity:.3;filter:Alpha(Opacity=30)}" +
            ".ui-widget-shadow{margin:-8px 0 0 -8px;padding:8px;background:#000 url(" + pathToResources + "img/bugclub/dialog/ui-bg_flat_50_000000_40x100.png) 50% 50% repeat-x;opacity:.25;filter:Alpha(Opacity=25);border-radius:8px}" +
            // summary screen dialog
            ".ui-widget-content.summary-screen{" +
            "background:url(" + pathToResources + "img/bugclub/legacy/ks1/pupil/Canvas_closeBook_backgroundSkin.png) top left no-repeat;" +
            "z-index:2010;" +
            "border:none;" +
            "-webkit-box-shadow:none;" +
            "-moz-box-shadow:none;" +
            "box-shadow:none;" +
            "}" +
            ".ui-widget-content.summary-screen .ui-dialog-titlebar,.ui-widget-content.summary-screen .ui-dialog-buttonpane{" +
            "background:transparent;" +
            "}" +
            ".ui-widget-content.summary-screen .ui-dialog-content{" +
            "background:transparent;" +
            "}" +
            ".ui-widget-content.summary-screen .ui-dialog-titlebar-close{" +
            "display:none;" +
            "}" +
            ".ui-widget-content.summary-screen .content .summary-icons{" +
            "position:absolute;" +
            "top:56px;" +
            "left:50px;" +
            "right:50px;" +
            "height:64px;" +
            "}" +
            ".ui-widget-content.summary-screen.ks1 .content .bug{" +
            "margin:220px 0 0 30px;" +
            "}" +
            ".ui-widget-content.summary-screen.ks2 .content .bug{" +
            "margin:180px 0 0 50px;" +
            "}" +
            ".ui-widget-content.summary-screen .content .button-close{" +
            "margin-left:1em;" +
            "}" +
            ".ui-widget-content.summary-screen .content .button-keep-reading{" +
            "background:url(" + pathToResources + "img/bugclub/legacy/ks1/pupil/Button_keepReading_downSkin.png) top left no-repeat;" +
            "width:260px;" +
            "height:81px;" +
            "}" +
            ".ui-widget-content.summary-screen.ks1 .content .buttons{" +
            "position:absolute;" +
            "bottom:70px;" +
            "right:30px;" +
            "}" +
            ".ui-widget-content.summary-screen.ks2 .content .buttons{" +
            "position:absolute;" +
            "bottom:90px;" +
            "right:80px;" +
            "}" +
            ".ui-widget-content.summary-screen .content .buttons a{" +
            "margin-left:1em;" +
            "outline:0;" +
            "border:none;" +
            "}";
    }

    return {
        getStyle: getStyle
    };
})(ActiveText);
