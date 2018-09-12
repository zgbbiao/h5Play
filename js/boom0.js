(function (win, myName) {
    win[myName] = Sprite.extend({
        init: function (name) {
          this._super(name)
            this.animsId = null
            this.speed = 1
        },
        //重新update
        update: function () {
            //最后一帧播放完毕后死亡
            // console.log(this.animsCtrl.isLastFrame())
            this._super()
            if(this.animsCtrl.isLastFrame())
            {
                this.canRemove = true
                this.owner.removeRObj(this);
            }
            // if (!this.animsId) {
            //     var self = this
            //     this.animsId = setTimeout(function () {
            //         self.removeAnim(self.name)
            //         self.owner.removeRObj(self);
            //         this.animsId = null
            //     }, 100)
            // }
        }
    })
    win[myName].ClassName = myName;
    //注册Ball类
    ClassFactory.regClass(win[myName].ClassName,win[myName]);
})(window, 'Boom0')