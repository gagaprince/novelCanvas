"use strict";
var HClass = require('./HClass');
var TextPage = HClass.extend({
    textLines:[],
    pageIndex:0,
    addTextLine:function(textLine){
        textLine.setLine(this.textLines.length);
        this.textLines.push(textLine);
    },
    setPage:function(pageIndex){
        this.pageIndex = pageIndex;
    },
    getTextLine:function(index){
        if(index<0){
            index=0;
        }
        if(index>=this.textLines.length){
            index = this.textLines.length-1;
        }
        return this.textLines[index];
    }
});
module.exports = TextPage;