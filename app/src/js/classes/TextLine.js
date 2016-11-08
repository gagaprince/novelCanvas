"use strict";
var HClass = require('./HClass');
var TextLine = HClass.extend({
    x:0,//绘制文字的x起点
    y:0,//绘制文字的y起点
    lineHeight:0,
    text:"",//绘制文字的内容
    top:0,
    ctor:function(text,lineHeight,left,top){
        this.text = text;
        this.lineHeight = lineHeight;
        this.x = left;
        this.top=top;
    },
    setLine:function(lineIndex){
        this.y = (lineIndex+1) * this.lineHeight+this.top;
    }
});
module.exports = TextLine;