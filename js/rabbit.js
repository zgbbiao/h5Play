(function (win, myName) {
    win[myName] = Sprite.extend({
        //状态0:正常 1:选中,准备拖动 2:拖动
        status: -1,
        //重新update
        update: function () {
            this._super()
            var so = this
            if (!StickGame.selObj) {
                StickGame.selObj = so
            }
            var sc = StickGame.sceneManager.getScene("main");
            //检测是否和其他精灵相交
            var cobj = sc.rObjs;
            var o = null,
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
        },
        //检测是否和其他精灵碰撞
        isCollide:function(pObj)
        {
            var backBuf = StickGame.backBuf;
            if (!backBuf) return false;
            backBuf.clearRect(0,0,this.owner.w,this.owner.h);
            var  x1 = this.x-this.w*0.5,
                y1 = this.y-this.h*0.5,
                x2 = this.x+this.w*0.5,
                y2 = this.y+this.h*0.5,
                x3 = pObj.x-pObj.w*0.5,
                y3 = pObj.y-pObj.h*0.5,
                x4 = pObj.x+pObj.w*0.5,
                y4 = pObj.y+pObj.h*0.5;
            //获取相交区域
            var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
            //如果没有相交则退出
            if(rc[0]>=rc[2]||rc[1]>=rc[3])
            {
                return false;
            }
            else
            {
                var gData1 = null,gData2 = null;
                backBuf.save();
                //绘制到后台缓冲中
                this.render(backBuf);
                backBuf.restore();
                //获取精灵在相交矩形像素数据
                gData1 = backBuf.getImageData(rc[0],rc[1],rc[2],rc[3]).data;
                //绘制目标精灵
                backBuf.clearRect(0,0,this.owner.w,this.owner.h);
                backBuf.save();
                pObj.render(backBuf);
                backBuf.restore();
                //获取目标精灵在相交矩形像素数据
                gData2 = backBuf.getImageData(rc[0],rc[1],rc[2],rc[3]).data;
                for(var i=3;i<gData1.length;i+=4)
                {
                    if(gData1[i]>0&&gData2[i]>0)return true;
                }
            }
        },
    })
    win[myName].ClassName = myName;
    //注册Ball类
    ClassFactory.regClass(win[myName].ClassName,win[myName]);
})(window, 'Rabbit')