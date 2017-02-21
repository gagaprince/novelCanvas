"use strict";
var SplitArtUtil = require('./../util/SplitArtUtil');
var TextArt = require('./TextArt');
//这是一个种组合形式的
var ArtProvider = TextArt.extend({
    needArtByIndex:null,//外部传入的请求数据的函数
    initIndex:0,
    initPage:0,
    preArt:null,
    currentArt:null,
    nextArt:null,
    initReady:null,
    onPageTurn:null,
    ctor:function(options){
        this.needArtByIndex = options.needArtByIndex;
        this.initIndex = options.initIndex;
        this.initPage = options.initPage;
        this.initReady = options.initReady;
        this.onPageTurn = options.onPageTurn;
        this.init();
    },
    init:function(){
        this.textPages = [];
        //会初始化当前art 下一个art  上一个art
        if(this.needArtByIndex){
            var currentIndex = this.initIndex;
            var _this = this;
            this.needArtByIndex(this.initIndex,function(text){
               //初始化当前页面
                var textArt = SplitArtUtil.splitArt(text,currentIndex);
                _this.currentArt = textArt;
                _this.setCurrentPage(_this.initPage);
                _this.pushAllPageIn(textArt);
                _this.getNextArt(textArt);
                _this.getPreArt(textArt);
                if(_this.initReady){
                    _this.initReady();
                }
            });
        }else{
            throw "needArtByIndx function is undefined ！";
        }

    },
    //获取前一个章节
    getNextArt:function(currentArt){
        var _this = this;
        var currentIndex = currentArt.getArtIndex();

        console.log("请求第"+(currentIndex+1)+"页数据");
        this.nextArt=null;
        this.needArtByIndex(currentIndex+1,function(text){
            if(_this.nextArt==null){
                //初始化当前页面
                var textArt = SplitArtUtil.splitArt(text,currentIndex+1);
                _this.nextArt = textArt
                _this.pushAllPageIn(textArt);
            }
        });
    },
    //获取后一个章节
    getPreArt:function(currentArt){
        var _this = this;
        var currentIndex = currentArt.getArtIndex();

        console.log("请求第"+(currentIndex-1)+"页数据");
        this.preArt=null;
        this.needArtByIndex(currentIndex-1,function(text){
            if(_this.preArt==null){
                //初始化当前页面
                var textArt = SplitArtUtil.splitArt(text,currentIndex-1);
                _this.preArt = textArt
                _this.pushAllPageIn(textArt,true);
            }
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
    removeFirstArtPage:function(){
        var preArt = this.preArt;
        if(preArt!=null){
            for(var i=0;i<preArt.size();i++){
                this.textPages.shift();
            }
            this.currentPage = this.currentPage-preArt.size();
        }
    },
    removeLastArtPage:function(){
        var nextArt = this.nextArt;
        if(nextArt!=null){
            for(var i=0;i<nextArt.size();i++){
                this.textPages.pop();
            }
        }
    },
    movePage:function(step){
        var currentPage = this.currentPage;
        this._super(step);
        //检测是否跨越章节
        var newCurrentPage = this.currentPage;
        if(this.preArt!=null){
            var preArtLength = this.preArt.size();
        }else{
            var preArtLength = 0;
        }
        var currentArtLength = this.currentArt.size();
        var preCurrentLength = currentArtLength+preArtLength;
        if(newCurrentPage<preArtLength){
            //向前触动翻章节
            this.preparedPreArt();
        }else if(newCurrentPage>=preCurrentLength){
            //向后翻动章节
            this.preparedNextArt();
        }
        if(this.onPageTurn){
            var chapter = this.currentArt.getArtIndex();
            var pno = this.getCurrentPage().getPage();
            this.onPageTurn(chapter,pno);
        }
    },
    preparedPreArt:function(){
        //请求之前的章节
        var preArt = this.preArt;
        if(preArt==null||preArt.size()==0){
            //不必做移除操作 直接请求
        }else{
            //移除nextArt数据
            //将preArt赋值给currentArt
            this.removeLastArtPage();
            this.nextArt = this.currentArt;
            this.currentArt = this.preArt;
        }
        this.getPreArt(this.currentArt);
        //请求preArt
    },
    preparedNextArt:function(){
        var nextArt = this.nextArt;
        if(nextArt==null||nextArt.size()==0){

        }else{
            this.removeFirstArtPage();
            this.preArt = this.currentArt;
            this.currentArt = this.nextArt;
        }
        this.getNextArt(this.currentArt);
    }

});
module.exports = ArtProvider;