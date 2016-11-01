"use strict";
var canvasUtil = {
    ctx:null,
    canvas:null,
    fontSize:18,
    fontFamilay:'arial',
    width:0,
    height:0,
    init:function($canvas){
        this.canvas = $canvas[0];
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.setFont();
    },
    setFont:function(font,family){
        var ctx = this.ctx;
        this.fontSize = font||18;
        this.fontFamilay = family||'arial';
        ctx.font=this.fontSize+"px "+this.fontFamilay;

    },
    drawArt:function(text){
        var ctx = this.ctx;
        var length = Math.floor(this.width/this.fontSize);
        var txt = text.substring(0,length);
        var box = ctx.measureText(txt);
        console.log(box);
        this.drawText(txt,0,this.fontSize);
    },
    drawText:function(text,x,y){
        var ctx = this.ctx;
        ctx.save();
        ctx.fillText(text,x,y);
        ctx.restore();
    }

};
module.exports = canvasUtil;