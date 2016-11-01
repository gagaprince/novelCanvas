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
        var textArt = new TextArt();

        return textArt;
    }
};
module.exports = SplitArtUtil;