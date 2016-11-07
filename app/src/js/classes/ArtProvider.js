"use strict";
var SplitArtUtil = require('./../util/SplitArtUtil');
var TextArt = require('./TextArt');
//这是一个种组合形式的
var ArtProvider = TextArt.extend({
    needArtByIndex:null,
    currentIndex:0,
    preArt:null,
    currentArt:null,
    nextArt:null,
    ctor:function(options){
        this.needArtByIndex = options.needArtByIndex;
        this.currentIndex = options.currentIndex;
    },
    init:function(){
        this.textPages = [];
        //会初始化当前art 下一个art  上一个art
        if(this.needArtByIndex){
            var currentIndex = this.currentIndex;
            var _this = this;
            this.needArtByIndex(this.currentIndex,function(text){
               //初始化当前页面
                var textArt = SplitArtUtil.splitArt(text,currentIndex);
                _this.currentArt = textArt;
                _this.pushAllPageIn(textArt);
                _this.getNextArt();
                _this.getPreArt();
            });
        }else{
            throw "needArtByIndx function is undefined ！";
        }

    },
    //获取前一个章节
    getNextArt:function(){
        var _this = this;
        var currentIndex = this.currentIndex;
        this.needArtByIndex(this.currentIndex,function(text){
            //初始化当前页面
            var textArt = SplitArtUtil.splitArt(text,currentIndex+1);
            _this.nextArt = textArt
            _this.pushAllPageIn(textArt);
        });
    },
    //获取后一个章节
    getPreArt:function(){
        var _this = this;
        var currentIndex = this.currentIndex;
        this.needArtByIndex(this.currentIndex,function(text){
            //初始化当前页面
            var textArt = SplitArtUtil.splitArt(text,currentIndex-1);
            _this.preArt = textArt
            _this.pushAllPageIn(textArt,true);
        });
    },
    pushAllPageIn:function(art,isBefore){//是否从前面插入
        var pageList = this.textPages;
        var artPageList = art.getPageList();
        if(isBefore){
            for(var i=artPageList.length-1;i>=0;i--){
                pageList.unshift(artPageList[i]);
            }
            this.currentPage+=artPageList.length;
        }else{
            for(var i=0;i<artPageList.length;i++){
                pageList.push(artPageList[i]);
            }
        }
    },
    moveNextPage:function(){
        var currentArt = this.currentArt;
        if(currentArt.getNextPage()!=null){
            currentArt.movePage(1);
        }else{
            //切换currentArt
            this.currentArt = this.nextArt;
            this.getNextArt();
        }

    },
    movePrePage:function(){},
    getCurrentPage:function(){},
    getNextPage:function(){},
    getPrePage:function(){}

});
module.exports = ArtProvider;