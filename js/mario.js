(function (win) {
    // 从引擎的Sprite继承
    win.Mario = Sprite.extend({
        update: function () {
           var w = this.owner.w,
               h = this.owner.h;
           // 边界设定
            if(this.x < 0 || this.x > w - 20) {
                this.dx = -this.dx;
                this.isXFlip = (this.dx < 0)
            }
            this._super()
        }
    })
    Mario.ClassName = 'Mario'
    ClassFactory.regClass(Mario.ClassName, Mario)
})(window)