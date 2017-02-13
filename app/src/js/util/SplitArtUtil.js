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
    rect:{
        top:0,
        left:0,
        right:0,
        bottom:0
    },
    init:function(options){
        this.width = options.width;
        this.height = options.height;
        this.fontSize = options.fontSize||1;
        this.lineHeight = options.lineHeight;
        this.rect = options.rect||this.rect;
        this.ctx = options.bctx;//取缓冲屏的画笔
    },
    splitArt:function(text,artIndex){
        text = this.replace(text);
        var textArt = new TextArt(text,artIndex);
        var textSY = text;
        while(textSY.length>0){
            textSY = this.splitPage(textArt,textSY);
        }
        return textArt;
    },
    replace:function(text){
        return text.replace(/\n/g,'')
            .replace(/<br\/>/g,'\n')
            .replace(/<br>/g,'\n')
            .replace(/&nbsp;/g,' ');
    },
    splitPage:function(textArt,textSY){
        var rect = this.rect;
        var pageHeight = this.height-rect.top-rect.bottom;
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
        return textSY;
    },
    splitLine:function(textPage,textSY){
        var rect = this.rect;
        var pageWidth = this.width-rect.left-rect.right;
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
        var rect = this.rect;
        var textLine = new TextLine(text,this.lineHeight,rect.left,rect.top);
        textPage.addTextLine(textLine);
        return textSY;
    }
};
module.exports = SplitArtUtil;