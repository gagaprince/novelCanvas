"use strict";
var MathUtil = {
    //两点式
    createLineFunByPP:function(p1,p2){
        var X1 = p1.x;
        var Y1 = p1.y;
        var X2 = p2.x;
        var Y2 = p2.y;
        return {
            A:Y2-Y1,
            B:X1-X2,
            C:X2*Y1-X1*Y2
        }
    },
    createLineFunByPK:function(p,k){
        var X = p.x;
        var Y = p.y;
        var K = k;
        return {
            A:K,
            B:-1,
            C:Y-K*X
        }
    },
    //获取两直线交点坐标
    giveMeLLP:function(l1,l2){
        var a1 = l1.A;
        var b1 = l1.B;
        var c1 = l1.C;
        var a2 = l2.A;
        var b2 = l2.B;
        var c2 = l2.C;
        if(a1*b2==a2*b1){
            return null;
        }
        return this.p((b1*c2-b2*c1)/(a1*b2-a2*b1),(a2*c1-a1*c2)/(a1*b2-a2*b1));
    },
    giveMeDisPP:function(p1,p2){
        var disX = p2.x-p1.x;
        var disY = p2.y-p1.y;
        return Math.sqrt(disX*disX+disY*disY);
    },
    //根据两点获取两点所在直线上 距离p1为p1 p2距离k倍的点 k可以为负
    giveMePByPPK:function(p1,p2,k){
        var n=k/(1-k)
        var x1 = p1.x;
        var x2 = p2.x;
        var y1 = p1.y;
        var y2 = p2.y
        return this.p((x1+n*x2)/(1+n),(y1+n*y2)/(1+n));
    },
    p:function(x,y){
        return {
            x:x,
            y:y
        }
    }

};
module.exports = MathUtil;