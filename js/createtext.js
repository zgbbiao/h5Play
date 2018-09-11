(function (win, myName) {
    win[myName] = Sprite.extend({
        init: function (name) {
          this._super(name)
            this.birth = FrameState.currTime;
            this.life = 800,
            this.col = 'red'
            this.txt = ''
            this.size = 30
            this.x = 0
            this.y = 0
            this.tAlpha = 1.0;
            this.dy = -1;
        },
        //重新update
        update: function () {
            var h = this.owner.h
            // 如果游戏开始
            if (StickGame.state === 1) {
                // console.log('苹果正在掉落');
                //调用父类方法
                this._super();
                if(this.life>0)
                {
                    var d = FrameState.currTime-this.birth;
                    if(d>this.life)
                    {
                        this.owner.removeRObj(this);
                    }
                    else
                    {
                        this.tAlpha = (1.0-d/this.life);
                    }
                }
                this.moveStep();
            }
        },
        render: function(ctx){
            ctx.save();
            ctx.fillStyle = this.col;
            ctx.globalAlpha = this.tAlpha;
            ctx.font = "bold "+this.size+"px sans-serif";
            var txt = this.txt;
            var m = ctx.measureText(txt).width;
            ctx.fillText(this.txt,this.x-m*0.5,this.y);
            ctx.restore();
        }
    })
    win[myName].ClassName = myName;
    //注册Ball类
    ClassFactory.regClass(win[myName].ClassName,win[myName]);
})(window, 'Acoretext')