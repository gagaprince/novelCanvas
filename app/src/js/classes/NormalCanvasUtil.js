"use strict";
/**
 * 过渡效果为一般过渡
 * */
var NovelCanvasUtil = require('./NovelCanvasUtil');
var NormalCanvasUtil = NovelCanvasUtil.extend({
    turnLock:false,
    init:function($canvas){
        this._super($canvas);
        this.initListener();
    },
    drawNextPage:function(moveX){
        if(this.turnLock){
            return;
        }
        var textArt = this.currentTextArt;
        var currentPage = textArt.getCurrentPage();
        var nextPage = textArt.getNextPage();
        if(currentPage==nextPage){//说明是第一张或者最后一张 直接画
            this.drawPage(nextPage);
        }else if(nextPage!=null){
            this.startNormalTurnPage(currentPage,nextPage,true,moveX);
        }else{
            //发出已经到最后一页的广播
        }
    },
    drawPrePage:function(moveX){
        if(this.turnLock){
            return;
        }
        var textArt = this.currentTextArt;
        var currentPage = textArt.getCurrentPage();
        var prePage = textArt.getPrePage();
        if(currentPage==prePage){//说明是第一张或者最后一张 直接画
            this.drawPage(prePage);
        }else if(prePage!=null){
            this.startNormalTurnPage(prePage,currentPage,false,moveX);
        }else{
            //发出已经到第一页的广播
        }
    },
    startNormalTurnPage:function(page1,page2,isNext,moveX){
        if(this.turnLock){
            return;
        }
        this.turnLock = true;
        if(isNext){
            var initPos = moveX||0;
            this.turnNextPage(page1,page2,initPos);
        }else{
            var initPos = moveX||-this.width;
            this.turnPrePage(page1,page2,initPos);
        }
    },
    turnNextPage:function(currentPage,nextPage,moveX){
        this.drawPage(nextPage);
        if(moveX<-this.width){
            var textArt = this.currentTextArt;
            textArt.movePage(1);
            this.turnLock = false;
        }else{
            this.drawPage(currentPage,moveX);
            var _this = this;
            setTimeout(function(){
                _this.turnNextPage(currentPage,nextPage,moveX-20);
            },10);
        }

    },
    turnPrePage:function(prePage,currentPage,moveX){
        this.drawPage(currentPage);
        if(moveX>0){
            this.drawPage(prePage);
            var textArt = this.currentTextArt;
            textArt.movePage(-1);
            this.turnLock = false;
        }else{
            this.drawPage(prePage,moveX);
            var _this = this;
            setTimeout(function(){
                _this.turnPrePage(prePage,currentPage,moveX+20);
            },10);
        }
    },
    dragNextPage:function(moveX){
        var textArt = this.currentTextArt;
        var currentPage = textArt.getCurrentPage();
        var nextPage = textArt.getNextPage();
        if(nextPage==null){
            return;
        }
        this.drawPage(nextPage);
        this.drawPage(currentPage,moveX);

    },
    dragPrePage:function(moveX){
        var textArt = this.currentTextArt;
        var currentPage = textArt.getCurrentPage();
        var prePage = textArt.getPrePage();
        if(prePage==null){
            return;
        }
        this.drawPage(currentPage);
        this.drawPage(prePage,moveX);
    },
    initListener:function(){
        var canvas = this.canvas;
        var _this = this;
        var touchStart={};
        var touchCurrent = {};
        var touchEnd = {};
        var isClick = true;
        var isTurnNext = true;
        canvas.addEventListener("touchstart",function(e){
            var touch = e.touches[0];
            touchStart={
                x:touch.pageX,
                y:touch.pageY
            }
            e.stopPropagation();
            e.preventDefault();
        },false);
        canvas.addEventListener("touchmove",function(e){
            var touch = e.touches[0];
            touchCurrent={
                x:touch.pageX,
                y:touch.pageY
            }

            var disX = touchCurrent.x-touchStart.x;
            if(disX>10||disX<-10){
                if(isClick){
                    if(disX>10){
                        isTurnNext = false;
                    }else{
                        isTurnNext = true;
                    }
                }
                isClick=false;
            }
            if(!isClick){
                //页面随动
                if(isTurnNext){
                    //向后翻页
                    _this.dragNextPage(touchCurrent.x-_this.width);
                }else{
                    //向前翻页
                    _this.dragPrePage(touchCurrent.x-_this.width);
                }
            }

            e.stopPropagation();
            e.preventDefault();
        },false);

        canvas.addEventListener("touchend",function(e){
            var touch = e.changedTouches[0];
            touchEnd={
                x:touch.pageX,
                y:touch.pageY
            }
            var x = touch.pageX;
            if(isClick){
                if(x>_this.width*0.66){
                    _this.drawNextPage();
                }else if(x<_this.width/3){
                    _this.drawPrePage();
                }
            }else{
                var textArt = _this.currentTextArt;
                var moveX = x-_this.width;
                if(isTurnNext){
                    if(x>_this.width/2){
                        //回到原来的位置
                        textArt.movePage(1);
                        _this.drawPrePage(moveX);
                    }else{
                        //继续翻页
                        _this.drawNextPage(moveX);
                    }
                }else{
                    if(x>_this.width/2){
                        //继续翻页
                        _this.drawPrePage(moveX);
                    }else{
                        //回到原来的位置
                        textArt.movePage(-1);
                        _this.drawNextPage(moveX);
                    }
                }
            }



            e.stopPropagation();
            e.preventDefault();
            isClick = true;
            touchStart={};
            touchCurrent={};
            touchEnd = {};
        },false);
    }

});
module.exports = NormalCanvasUtil;
