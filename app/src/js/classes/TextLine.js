var HClass = require('./HClass');
var TextLine = HClass.extend({
    x:0,//绘制文字的x起点
    y:0,//绘制文字的y起点
    text:""//绘制文字的内容
});
module.exports = TextLine;