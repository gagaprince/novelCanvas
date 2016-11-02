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
    ctor:function($canvas){
        this.init($canvas);
    },
    init:function($canvas){
        this.canvas = $canvas[0];
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.initBufferCanvas();
        this.setFont();
        SplitArtUtil.init(this);
    },
    initBufferCanvas:function(){
        var bufferCanvasDom = $("<canvas></canvas>");
        this.bufferCanvas = bufferCanvasDom[0];
        bufferCanvasDom.attr('width',this.width);
        bufferCanvasDom.attr('height',this.height);
        this.bctx = this.bufferCanvas.getContext("2d");
    },
    setFont:function(font,family){
        var ctx = this.bctx;
        this.fontSize = font||18;
        this.fontFamilay = family||'arial';
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
        var textPage = textArt.getCurrentPage();
        if(textPage!=null) {
            this.drawPage(textPage);
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