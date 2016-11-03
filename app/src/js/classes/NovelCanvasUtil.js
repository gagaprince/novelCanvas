"use strict";
var SplitArtUtil = require('./../util/SplitArtUtil');
var HClass = require('./HClass');
var CanvasUtil = HClass.extend({
    ctx:null,
    canvas:null,
    fontSize:18,
    fontFamilay:'arial',
    width:0,
    height:0,
    currentTextArt:null,
    bufferCanvas:null,
    bctx:null,
    bg:null,
    bgBox:null,//截取背景显示区域

    ctor:function($canvas,settings){
        this.init($canvas,settings);
    },
    init:function($canvas,settings){
        this.canvas = $canvas[0];
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.initBufferCanvas();

        SplitArtUtil.init(this);
        this.initSetting(settings);
    },
    initSetting:function(settings){
        this.setFont(settings["fontSize"],settings["family"],settings["fontColor"]);
        var bgUrl = settings["bgUrl"];
        this.initBg(bgUrl);
    },
    initBg:function(bgUrl){
        if(bgUrl){
            var $img = $('<img src="'+bgUrl+'"/>');
            var _this = this;
            $img.on('load',function(){
                var bg = _this.bg = $img[0];
                var width = bg.width;
                var height = bg.height;
                var cWidth = _this.width;
                var cHeight = _this.height;

                var tempHeight = width/cWidth*cHeight;
                var boxWidth=0,boxHeight=0;
                if(tempHeight<height){
                    boxHeight = tempHeight
                    boxWidth = width;
                }else{
                    boxHeight = height;
                    boxWidth = height/cHeight*cWidth;
                }
                _this.bgBox={
                    x:0,y:0,
                    width:boxWidth,
                    height:boxHeight
                }
                _this.drawCurrentPage();
            });
        }
    },
    initBufferCanvas:function(){
        var bufferCanvasDom = $("<canvas></canvas>");
        this.bufferCanvas = bufferCanvasDom[0];
        bufferCanvasDom.attr('width',this.width);
        bufferCanvasDom.attr('height',this.height);
        this.bctx = this.bufferCanvas.getContext("2d");
    },
    setFont:function(font,family,color){
        var ctx = this.bctx;
        this.fontSize = font||18;
        this.fontFamilay = family||'arial';
        ctx.fillStyle=color||"#000";
        ctx.font=this.fontSize+"px "+this.fontFamilay;
    },
    drawArt:function(text){
        var textArt = SplitArtUtil.splitArt(text);
        this.currentTextArt = textArt;
        /*var ctx = this.ctx;
        var length = Math.floor(this.width/this.fontSize);
        var txt = text.substring(0,length);
        var box = ctx.measureText(txt);
        this.drawText(txt,0,this.fontSize);*/
        console.log(textArt);
        this.drawCurrentPage();
    },
    drawCurrentPage:function(){
        var textArt = this.currentTextArt;
        if(textArt){
            var textPage = textArt.getCurrentPage();
            if(textPage!=null) {
                this.drawPage(textPage);
            }
        }
    },
    drawNextPage:function(){
        var textArt = this.currentTextArt;
        var textPage = textArt.getNextPage();
        if(textPage!=null){
            console.log(textPage);
            this.drawPage(textPage);
        }else{
            //发出已经到最后一页的广播
        }
    },
    drawPrePage:function(){
        var textArt = this.currentTextArt;
        var textPage = textArt.getPrePage();
        if(textPage!=null){
            this.drawPage(textPage);
        }else{
            //发出已经到最前页的广播
        }
    },
    drawPage:function(textPage,moveX){
        if(!moveX){
            moveX=0;
        }
        var ctx = this.bctx;
        ctx.save();
        ctx.translate(moveX,0);
        this.clearDisk();
        var textLines = textPage.getTextLines();
        for(var i=0;i<textLines.length;i++){
            var textLine = textLines[i];
            this.drawTextLine(textLine);
        }
        ctx.restore();
        this.repaint();
    },
    drawTextLine:function(textLine){
        var text = textLine.text;
        var x = textLine.x;
        var y = textLine.y;
        this.drawText(text,x,y);
    },
    //清空画布
    clearDisk:function(){
        var ctx = this.bctx;
        ctx.save();
        ctx.fillStyle="#ffffff";
        ctx.fillRect(0,0,this.width,this.height);
        if(this.bg){//如果有bg就绘制背景
            ctx.globalAlpha=0.7;
            var sx = this.bgBox.x;
            var sy = this.bgBox.y;
            var swidth = this.bgBox.width;
            var sheight = this.bgBox.height;
            ctx.drawImage(this.bg,sx,sy,swidth,sheight,0,0,this.width,this.height);
        }
        ctx.restore();
    },
    drawText:function(text,x,y){
        var ctx = this.bctx;
        ctx.save();
        ctx.fillText(text,x,y);
        ctx.restore();
    },
    repaint:function(){
        var ctx = this.ctx;
        var img = this.bufferCanvas;
        ctx.drawImage(img,0,0);
    }

});
module.exports = CanvasUtil;