"use strict";
var HClass = require('./HClass');
var TextArt = HClass.extend({
    textPages:null,
    allText:"",
    currentPage:0,
    artIndex:0,
    ctor:function(text,artIndex){
        this.allText = text;
        this.textPages=[];
        this.artIndex = artIndex;
    },
    getArtIndex:function(){
        return this.artIndex;
    },
    size:function(){
        return this.textPages.length;
    },
    getPageList:function(){
        return this.textPages;
    },
    addTextPage:function(textPage){
        textPage.setPage(this.textPages.length);
        this.textPages.push(textPage);
    },
    getCurrentPage:function(){
        return this.getTextPage(this.currentPage);
    },
    getNextPage:function(){
        var desPage = this.currentPage+1;
        if(desPage>=this.textPages.length){
            return null;
        }
        return this.getTextPage(desPage);
    },
    getPrePage:function(){
        var desPage = this.currentPage-1;
        if(desPage<0){
            return null;
        }
        return this.getTextPage(desPage);
    },
    movePage:function(step){
        this.currentPage = this.currentPage+step;
        if(this.currentPage<0){
            this.currentPage=0;
        }
        if(this.currentPage>=this.textPages.length){
            this.currentPage = this.textPages.length-1;
        }
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