"use strict";
var HClass = require('./HClass');
var TextPage = HClass.extend({
    textLines:null,
    pageIndex:0,
    title:"",
    ctor:function(){
        this.textLines=[];
    },
    addTextLine:function(textLine){
        textLine.setLine(this.textLines.length);
        this.textLines.push(textLine);
    },
    setPage:function(pageIndex){
        this.pageIndex = pageIndex;
    },
    getPage:function(){
        return this.pageIndex;
    },
    setTitle:function(title){
        this.title = title;
    },
    getTitle:function(){
        return this.title;
    },
    getTextLines:function(){
        return this.textLines;
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