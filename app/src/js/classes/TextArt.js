"use strict";
var HClass = require('./HClass');
var TextArt = HClass.extend({
    textPages:[],
    allText:"",
    ctor:function(text){
        this.allText = text;
    },
    addTextPage:function(textPage){
        textPage.setPage(this.textPages.length);
        this.textPages.push(textPage);
    },
    getTextPage:function(index){
        if(index<0){
            index=0;
        }
        if(index>=this.textPages.length){
            index = this.textPages.length-1;
        }
        return this.textPages[index];
    }
});
module.exports = TextArt;