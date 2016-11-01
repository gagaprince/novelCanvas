"use strict";
var TextArt = require('../classes/TextArt');
var TextPage = require('../classes/TextPage');
var TextLine = require('../classes/TextLine');
var SplitArtUtil={
    width:0,
    height:0,
    lineHeight:0,
    fontSize:0,
    ctx:null,
    init:function(options){
        this.width = options.width;
        this.height = options.height;
        this.fontSize = options.fontSize||1;
        this.lineHeight = options.fontSize+4;
        this.ctx = options.ctx;
    },
    splitArt:function(text){
        var textArt = new TextArt(text);
        var textSY = text;
        while(textSY.length>0){
            textSY = this.splitPage(textArt,textSY);
        }
        return textArt;
    },
    splitPage:function(textArt,textSY){
        var pageHeight = this.height;
        var lineHeight = this.lineHeight;
        var lines = Math.floor(pageHeight/lineHeight);
        var textPage = new TextPage();
        for(var i=0;i<lines;i++){
            textSY = this.splitLine(textPage,textSY);
            if(textSY<=0){
                break;
            }
        }
        textArt.addTextPage(textPage);
    },
    splitLine:function(textPage,textSY){
        var pageWidth = this.width;
        var fontSize = this.fontSize;
        var ctx = this.ctx;
        var lineNumFloor = Math.floor(pageWidth/fontSize);
        var text = '';//一行文字内容
        while(true){
            if(lineNumFloor+1<textSY.length){
                text = textSY.substring(0,lineNumFloor+1);
                var textWidth = ctx.measureText(text);
                if(textWidth>pageWidth){
                    text = textSY.substring(0,lineNumFloor);
                    textSY = textSY.substring(lineNumFloor,textSY.length);
                    break;
                }
                lineNumFloor++;
            }else{
                text = textSY ;
                textSY = "";
                break;
            }
        }
        var textLine = new TextLine(text,this.lineHeight);
        textPage.addTextLine(textLine);
        return textSY;
    }
};
module.exports = SplitArtUtil;