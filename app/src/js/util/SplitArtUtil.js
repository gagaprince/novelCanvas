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
        this.ctx = options.bctx;//取缓冲屏的画笔
    },
    splitArt:function(text){
        text = this.replace(text);
        var textArt = new TextArt(text);
        var textSY = text;
        while(textSY.length>0){
            textSY = this.splitPage(textArt,textSY);
        }
        return textArt;
    },
    replace:function(text){
        return text.replace(/<br\/>/g,'\n');
    },
    splitPage:function(textArt,textSY){
        var pageHeight = this.height;
        var lineHeight = this.lineHeight;
        console.log(lineHeight);
        var lines = Math.floor(pageHeight/lineHeight);
        var textPage = new TextPage();
        for(var i=0;i<lines;i++){
            textSY = this.splitLine(textPage,textSY);
            if(textSY<=0){
                break;
            }
        }
        textArt.addTextPage(textPage);
        return textSY;
    },
    splitLine:function(textPage,textSY){
        var pageWidth = this.width;
        var fontSize = this.fontSize;
        var ctx = this.ctx;
        var lineNumFloor = Math.floor(pageWidth/fontSize);
        var text = '';//一行文字内容
        var hhIndex = textSY.indexOf('\n');
        if(hhIndex>=0&&hhIndex<lineNumFloor){
            text = textSY.substring(0,hhIndex+1);
            textSY = textSY.substring(hhIndex+1,textSY.length);
        }else{
            while(true){
                if(lineNumFloor+1<textSY.length){
                    text = textSY.substring(0,lineNumFloor+1);
                    var textWidth = ctx.measureText(text).width;
                    var lastText = text.substring(lineNumFloor,lineNumFloor+1);
                    if(lastText=='\n'){
                        text = textSY.substring(0,lineNumFloor+1);
                        textSY = textSY.substring(lineNumFloor+1,textSY.length);
                        break;
                    }else if(textWidth>pageWidth){
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
        }
        var textLine = new TextLine(text,this.lineHeight);
        textPage.addTextLine(textLine);
        return textSY;
    }
};
module.exports = SplitArtUtil;