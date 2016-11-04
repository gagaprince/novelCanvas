"use strict";
/**
 * 仿真翻页
 * */
var NovelCanvasUtil = require('./NovelCanvasUtil');
var mu = require('../util/MathUtil');
var EmulateCanvasUtil = NovelCanvasUtil.extend({
    init:function($canvas,settings){
        this._super($canvas,settings);
        this.initListener();
    },
    drawPrePageByPoint:function(point){
        var y = point.y;
        if(y>this.height/2){
            //点在下方
            this.drawPrePageBottomPoint(point);
        }else{
            //点在上方
            this.drawPrePageUpPoint(point);
        }
    },
    drawPrePageUpPoint:function(p){

    },
    drawPrePageBottomPoint:function(p,page1,page2){
        //需要找出9个关键点
        var ur = mu.p(this.width,0);
        var bl = mu.p(0,this.height);
        var br = mu.p(this.width,this.height);
        var dis = mu.giveMeDisPP(bl,p);
        if(dis>this.width-80){
            //当手触点在半径范围w 用圆弧上的点 代替手触点
            p = mu.giveMePByPPK(bl,p,(this.width-80)/dis);
        }
        //计算p点和右下点的中点
        var mp = mu.giveMePByPPK(br,p,0.5);
        //计算mp 和 p的0.25点
        var mmp = mu.giveMePByPPK(p,mp,0.5);
        //计算brp直线的方程 使用两点式
        var lbrp = mu.createLineFunByPP(p,br);
        //计算mp与prp垂直直线的方程 使用斜截式
        var k = lbrp.B/lbrp.A;
        var lmpz = mu.createLineFunByPK(mp,k);
        var lmmpz = mu.createLineFunByPK(mmp,k);

        //计算右边 使用两点式
        var lr = mu.createLineFunByPP(br,ur);
        //计算lmpz与右边的交点
        var mrp = mu.giveMeLLP(lr,lmpz);//右侧贝塞尔曲线的中点
        //计算底边 使用两点式
        var lb = mu.createLineFunByPP(bl,br);
        //计算lmpz与下边的交点
        var mbp = mu.giveMeLLP(lb,lmpz);//底测贝塞尔曲线的中点
        //计算右侧贝塞尔曲线的起点和终点
        var mmrp = mu.giveMeLLP(lmmpz,lr);//右侧贝塞尔起点
        var lpmrp = mu.createLineFunByPP(p,mrp);//p点和mrp点直线
        var mmlp = mu.giveMeLLP(lmmpz,lpmrp);//右侧贝塞尔终点
        //计算底部侧贝塞尔曲线的起点和终点
        var mmbp=mu.giveMeLLP(lmmpz,lb);//底部贝塞尔起点
        var lpmbp = mu.createLineFunByPP(p,mbp);
        var mmup = mu.giveMeLLP(lmmpz,lpmbp);//底部贝塞尔终点
        //计算右侧三点重心
        var midRp = mu.giveMeQuadraticPByT(mmrp,mrp,mmlp,0.5);
        var midBp = mu.giveMeQuadraticPByT(mmbp,mbp,mmup,0.5);

        //九个关键点
        //p mmbp mbp mmup midBp mmrp mmlp mrp midRp
        this.clearDisk();
        this.drawUpPage(p, mmbp, mbp, mmup, midBp, mmrp, mmlp, mrp, midRp,page1);
        this.drawDownPage(p, mmbp, mbp, mmup, midBp, mmrp, mmlp, mrp, midRp,page2);
        this.drawbgPage(p, mmbp, mbp, mmup, midBp, mmrp, mmlp, mrp, midRp);

    },
    //绘制上面一页
    drawUpPage:function(p, mmbp, mbp, mmup, midBp, mmrp, mmlp, mrp, midRp,page){
        var ctx = this.bctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.width,0);
        ctx.lineTo(mmrp.x,mmrp.y);
        ctx.quadraticCurveTo(mrp.x,mrp.y,mmlp.x,mmlp.y);
        ctx.lineTo(p.x, p.y);
        ctx.lineTo(mmup.x,mmup.y);
        ctx.quadraticCurveTo(mbp.x,mbp.y,mmbp.x,mmbp.y);
        ctx.lineTo(0,this.height);
        ctx.closePath();
        ctx.clip();
//        this.drawCurrentPage(true);
        this.drawPage(page);
        ctx.restore();
        this.repaint();
    },
    drawDownPage:function(p, mmbp, mbp, mmup, midBp, mmrp, mmlp, mrp, midRp,page){
        var ctx = this.bctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(mmrp.x,mmrp.y);
        ctx.quadraticCurveTo(mrp.x,mrp.y,mmlp.x,mmlp.y);
        ctx.moveTo(midRp.x,midRp.y);
        ctx.lineTo(midBp.x,midBp.y);
        ctx.moveTo(mmup.x,mmup.y);
        ctx.quadraticCurveTo(mbp.x,mbp.y,mmbp.x,mmbp.y);
        ctx.lineTo(this.width,this.height);
        ctx.lineTo(mmrp.x,mmrp.y);
        ctx.moveTo(mmrp.x,mmrp.y);
        ctx.closePath();
        ctx.clip();

        ctx.beginPath();
        ctx.moveTo(midBp.x,midBp.y);
        ctx.lineTo(mmbp.x,mmbp.y);
        ctx.lineTo(this.width,this.height);
        ctx.lineTo(mmrp.x,mmrp.y);
        ctx.lineTo(midRp.x,midRp.y);
        ctx.closePath();
        ctx.clip();
        //画底部内容
        var textArt = this.currentTextArt;
        textArt.movePage(1);
//        this.drawCurrentPage(true);
        this.drawPage(page);
        //在画一层阴影
        ctx.beginPath();
        ctx.moveTo(mmrp.x,mmrp.y);
        ctx.lineTo(midRp.x,midRp.y);
        ctx.lineTo(midBp.x,midBp.y);
        ctx.lineTo(mmbp.x,mmbp.y);
        ctx.lineTo(p.x,p.y);
        ctx.closePath();

        ctx.fillStyle = 'rgba(0, 0, 0,0.8)';
        ctx.shadowOffsetX = 15; // 阴影Y轴偏移
        ctx.shadowOffsetY = 15; // 阴影X轴偏移
        ctx.shadowBlur = 14; // 模糊尺寸
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 颜色
        ctx.fill();

        ctx.restore();
        this.repaint();
    },
    drawbgPage:function(p, mmbp, mbp, mmup, midBp, mmrp, mmlp, mrp, midRp){
        var ctx = this.bctx;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(mmrp.x,mmrp.y);
        ctx.quadraticCurveTo(mrp.x,mrp.y,mmlp.x,mmlp.y);
        ctx.lineTo(p.x,p.y);
        ctx.lineTo(mmup.x,mmup.y);
        ctx.quadraticCurveTo(mbp.x,mbp.y,mmbp.x,mmbp.y);
        ctx.lineTo(this.width,this.height);
        ctx.lineTo(mmrp.x,mmrp.y);
        ctx.moveTo(mmrp.x,mmrp.y);
        ctx.closePath();
        ctx.clip();

        ctx.beginPath();
        ctx.moveTo(midBp.x,midBp.y);
        ctx.lineTo(midRp.x,midRp.y);
        ctx.lineTo(0,0);
        ctx.lineTo(0,this.height);
        ctx.closePath();
        ctx.clip();

        var mp = mu.giveMePByPPK(mu.p(this.width,this.height),p,0.5);
        var grd=ctx.createLinearGradient(p.x,p.y,mp.x,mp.y);
        grd.addColorStop(0,"#999999");
        grd.addColorStop(0.4,"#aaaaaa");
        grd.addColorStop(0.6,"#dddddd");
        grd.addColorStop(1,"#666666");
        ctx.fillStyle=grd;
        ctx.globalAlpha=0.7;

        ctx.fill();
        ctx.restore();
        this.repaint();
    },
    drawCurrentPage:function(isNoClean){
        var textArt = this.currentTextArt;
        if(textArt){
            var textPage = textArt.getCurrentPage();
            if(textPage!=null) {
                if(!isNoClean){
                    this.clearDisk();
                }
                this.drawPage(textPage);
            }
        }
    },
    drawPage:function(textPage,moveX){
        if(!moveX){
            moveX=0;
        }
        var ctx = this.bctx;
        var textLines = textPage.getTextLines();
        for(var i=0;i<textLines.length;i++){
            var textLine = textLines[i];
            this.drawTextLine(textLine);
        }
        this.repaint();
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
                    _this.dragNextPage(touchCurrent.x);
                }else{
                    //向前翻页
                    _this.dragPrePage(touchCurrent.x);
                }
            }

            _this.drawPrePageByPoint(touchStart);
            e.stopPropagation();
            e.preventDefault();
        },false);

        canvas.addEventListener("touchend",function(e){
            var touch = e.changedTouches[0];
            touchEnd={
                x:touch.pageX,
                y:touch.pageY
            }

            e.stopPropagation();
            e.preventDefault();
            touchStart={};
            touchCurrent={};
            touchEnd = {};
        },false);
    }
});
module.exports = EmulateCanvasUtil;