"use strict";
var HClass = require('./HClass');
var TextLine = HClass.extend({
    x:0,//绘制文字的x起点
    y:0,//绘制文字的y起点
    lineHeight:0,
    text:"",//绘制文字的内容
    ctor:function(text,lineHeight){
        this.text = text;
        this.lineHeight = lineHeight;
    },
    setLine:function(lineIndex){
        this.y = lineIndex * this.lineHeight;
    }
});
module.exports = TextLine;