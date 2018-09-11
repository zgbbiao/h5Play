function setSlaceWH(obj) {

    /*
    屏幕：
    * 设计高，initW
    * 设计宽：initH
    * 实际高   curH
    * 实际宽   curW
    *
    * 精灵：
    * 设计高：  s_initH
    * 设计宽   s_initW
    * 实际高   s_curH
    * 实际宽   s_curW
    *
    *屏幕
    *  实际（宽高）/ 设计（宽高） ==  当前缩放比例
    * 精灵
    * 设计（宽高） * 屏幕当前缩放比例  == 当前实际（宽高）
    *
    * */

    return {
        w: getCurrW(obj.initW, obj.s_initW, 'width'),
        h: getCurrW(obj.initH, obj.s_initH, 'height'),
        biliW: getCreen().width / obj.initW,
        biliH: getCreen().height / obj.initH
    }
}

/*
* @desc:  求当前精灵的宽高
* @params:  init: 设计（宽或高）
* @params:  s_init: 精灵的设计（宽或高）
* @params:  width: <string>  ‘width’ || 'height'
* */
function getCurrW(init, s_init, width) {
    return getCreen()[width] / init * s_init
}

// 生成随机范围内的数
function randomFrom(lowerValue,upperValue)
{
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

// 随机排序

function shuffle(arr){
    var len = arr.length;
    for(var i = 0; i < len - 1; i++){
        var idx = Math.floor(Math.random() * (len - i));
        var temp = arr[idx];
        arr[idx] = arr[len - i - 1];
        arr[len - i -1] = temp;
    }
    return arr;
}

function getCreen() {
    var mybody = $('body')
    return {
        width: mybody.width(),
        height: mybody.height()
    }
}