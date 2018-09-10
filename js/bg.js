(function (win, myName) {
    win[myName] = Sprite.extend({
        //重新update
        update: function () {
            console.log(1);
        }
    })
    win[myName].ClassName = myName;
    //注册Ball类
    ClassFactory.regClass(win[myName].ClassName,win[myName]);
})(window, 'Bg')