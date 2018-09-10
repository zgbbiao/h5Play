(function (win, myName) {
    win[myName] = Sprite.extend({
        init: function (name) {
            this._super(name)
        },
        //重新update
        update: function () {
            var h = this.owner.h
            // 如果游戏开始
            if (StickGame.state === 1) {
                // console.log('西瓜正在掉落');
                //调用父类方法
                this._super();
            }
        }
    })
    win[myName].ClassName = myName;
    //注册Ball类
    ClassFactory.regClass(win[myName].ClassName,win[myName]);
})(window, 'Watermelon')