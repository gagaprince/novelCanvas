(function(global, factory) {
    var fa = factory();
    if (typeof define === "function") { // AMD || CMD
        if (define.amd) {
            define(function() {
                return fa;
            });
        } else if (define.cmd) {
            define(function(require, exports, module) {
                module.exports = fa;
            });
        }
    } else if (typeof module === "object" && typeof module.exports === "object") { // commonJS
        module.exports = fa;
    } else { // global

    }
    window.NovelCanvas = fa;
}(typeof window !== "undefined" ? window : this, function() {
    "use strict";

    var canvasUtil = require('./util/NovelCanvasUtil.js');

    var myCanvas = {
        canvasFrame:null,
        canvas:null,
        options:{
            width:375,
            height:600
        },
        init:function(options){
            $.extend(this.options,options);
            this.initDom();
            this.initCanvas();
            this.initArticle();
        },
        initDom:function(){
            this.canvasFrame = $("#novelCanvasFrame");
            this.canvas = this.canvasFrame.find('canvas');
        },
        initCanvas:function(){
            //根据传入的宽高 初始化canvas
            this.canvas.css({
                width:this.options.width+'px',
                height:this.options.height+"px"
            });
            this.canvas.attr("width",this.options.width);
            this.canvas.attr("height",this.options.height);
            canvasUtil.init(this.canvas);
        },
        initArticle:function(){
            this.setArticle("我是你大爷我是你大爷\n\n\n我是你大爷我是你大爷我是你大爷");
        },
        setArticle:function(text){
            canvasUtil.drawArt(text);
        }
    };

    return {
        init:function(options){
            myCanvas.init(options);
        }
    }

}));