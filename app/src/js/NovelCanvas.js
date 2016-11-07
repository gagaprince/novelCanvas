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

//    var CanvasUtil = require('./classes/NovelCanvasUtil.js');
    var CanvasUtil = require('./classes/NormalCanvasUtil.js');
    var EmulateCanvasUtil = require('./classes/EmulateCanvasUtil.js');
    var canvasUtil=null;
    var myCanvas = {
        canvasFrame:null,
        canvas:null,
        options:{
            width:375,
            height:600,
            bgUrl:null
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
//            canvasUtil = new CanvasUtil(this.canvas,this.options);
            canvasUtil = new EmulateCanvasUtil(this.canvas,this.options);
        },
        initArticle:function(){
//            this.setArticle("我是你大爷我是你大");
        },
        setArticle:function(text,artIndex){
            this.currentArtIndex = artIndex;
            canvasUtil.drawArt(text,artIndex);
        },
        next:function(){
            //向后翻
            canvasUtil.drawNextPage();
        },
        pre:function(){
            //向前翻
            canvasUtil.drawPrePage();
        }
    };

    return {
        init:function(options){
            myCanvas.init(options);
        },
        setArticle:function(text,currentArtPage){
            myCanvas.setArticle(text,currentArtPage);
        },
        next:function(){
            myCanvas.next();
        },
        pre:function(){
            myCanvas.pre();
        }
    }

}));