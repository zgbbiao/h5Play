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
                // console.log('苹果正在掉落');
                //调用父类方法
                this._super();
                this.collide()
            }
        },
        collide: function () {
            var so = StickGame.selObj
            var sc = StickGame.sceneManager.getScene("main");
            //检测是否和其他精灵相交
            var cobj = [StickGame.selObj]
            var o = this
                io = null;
            var x1 = so.x-so.w*0.5,
                y1 = so.y-so.h*0.5,
                x2 = so.x+so.w*0.5,
                y2 = so.y+so.h*0.5,
                x3,y3,x4,y4;
            for(var i=0;i<cobj.length;i++)
            {
                o = cobj[i];
                if(o.name!=so.name)
                {
                    x3 = o.x-o.w*0.5;
                    y3 = o.y-o.h*0.5;
                    x4 = o.x+o.w*0.5;
                    y4 = o.y+o.h*0.5;
                    if(MathUtil.isInRect(x1,y1,x2,y2,x3,y3,x4,y4))
                    {
                        io = o;
                    }
                }
                if(o!=so&& so &&so.isCollide(o))
                {
                    console.log(sc.rObjs)
                    // so.owner.removeRObj(o)
                    console.log("发生碰撞")
                    return false
                }
            }
            if(io!=null)
            {
                // //获取相交区域
                // var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
                // //绘制相交区域到另一个canvas中
                // var ctx = dRect.getContext("2d");
                // var sctx = sc.cvs[0];
                // var w = rc[2]-rc[0],
                //     h = rc[3]-rc[1];
                // if(w>0&&h>0)
                // {
                //     ctx.clearRect(0,0,200,200);
                //     ctx.drawImage(sctx,rc[0],rc[1],w,h,(200-4*w)*0.5,(200-4*h)*0.5,4*w,4*h);
                // }
            }
        }
    })
    win[myName].ClassName = myName;
    //注册Ball类
    ClassFactory.regClass(win[myName].ClassName,win[myName]);
})(window, 'Apply')