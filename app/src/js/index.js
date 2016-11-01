"use strict";
var NovelCanvas = require('./NovelCanvas.js');
$(document).ready(function(){
    var height = $(window).height();
    var width = $(window).width();
    NovelCanvas.init({
        width:width,
        height:height
    });
});