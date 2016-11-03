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
    drawPrePageBottomPoint:function(p){
        var ur = mu.p(this.width,0);
        var bl = mu.p(0,this.height);
        var br = mu.p(this.width,this.height);
        var dis = mu.giveMeDisPP(bl,p);
        if(dis>this.width){
            //当手触点在半径范围w 用圆弧上的点 代替手触点
            p = mu.giveMePByPPK(bl,p,this.width/dis);
        }
        //计算p点和右下点的中点
        var mp = mu.giveMePByPPK(br,p,0.5);
        //计算mp 和 p的中点
        var mmp = mu.giveMeDisPP(p,mp,0.5);
        //计算prp直线的方程 使用两点式
        var lprp = mu.createLineFunByPP(p,pr);
        //计算mp与prp垂直直线的方程 使用斜截式
        var k = lprp.B/lprp.A;
        var lmpz = mu.createLineFunByPK(mp,k);
        var lmmpz = mu.createLineFunByPK(mmp,k);

        //计算右边 使用两点式
        var lr = mu.createLineFunByPP(br,ur);
        //计算lmpz与右边的交点
        var mrp = mu.giveMeLLP(lr,lmpz);//右侧贝塞尔曲线的起点
        //计算底边 使用两点式
        var lb = mu.createLineFunByPP(bl,br);
        //计算lmpz与下边的交点
        var mbp = mu.giveMeLLP(lb,lmpz);//底测贝塞尔曲线的起点








    },
    initListener:function(){

    }
});
module.exports = EmulateCanvasUtil;