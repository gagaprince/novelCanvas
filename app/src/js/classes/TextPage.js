"use strict";
var HClass = require('./HClass');
var TextPage = HClass.extend({
    textLines:[],
    addTextLine:function(textLine){
        this.textLines.push(textLine);
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