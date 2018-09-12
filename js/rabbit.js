(function (win, myName) {
    win[myName] = Sprite.extend({
        //状态0:正常 1:选中,准备拖动 2:拖动
        status: -1,
        // 记录上传碰撞的名字，
        preBarrierName: null,
        collidId: null,
        //重新update
        update: function () {
            this._super()
            if (this.x < -this.w * this.scaleX /6 ) {
                this.x = -this.w * this.scaleX /6
            }
            if (this.x > this.owner.w - this.w * this.scaleX /2 ) {
                this.x = this.owner.w - this.w * this.scaleX /2
            }
            if (this.y > this.owner.h - this.h * this.scaleY ) {
                this.y = this.owner.h - this.h * this.scaleY
            }
            if (this.y <  10) {
                this.y = 10
            }
            var so = this
            if (!StickGame.selObj) {
                StickGame.selObj = so
            }
            var self = this;
            var sc = StickGame.sceneManager.getScene("main");
            if (!this.collidId) {
                this.collidId = setTimeout( function() {
                    clearTimeout(self.collidId)
                    self.collidId = null
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
                            so.owner.removeRObj(o)
                            // 统计分数
                            if (self.preBarrierName != o.name) {
                                for (var key in StickGame.cfg) {
                                    var cfg = StickGame.cfg[key]
                                    if (typeof cfg === 'object' && (cfg.score || cfg.score == 0)) {
                                        if (o.name.indexOf(key) !== -1) {
                                            cfg.score && (StickGame.score += cfg.score)
                                            cfg.hp && (StickGame.hp += cfg.hp)
                                            break;
                                        }
                                    }
                                }
                            }
                            self.preBarrierName = o.name
                            console.log("发生碰撞")
                            var myScore = StickGame.cfg[o.initName] && StickGame.cfg[o.initName].score || 0
                            if (myScore > 0) {
                                StickGame.createScore(o.x,o.y,{"txt": '+' + myScore,"col":"#ffc11c","f_size":34,"l_time":1000});
                                // if (o.initName === 'stone') {
                                StickGame.createBoom(o.x, o.y)
                                // }
                            }
                            return false
                        }
                    }
                }, 20.6)
            }
        },
        //检测是否和其他精灵碰撞
        isCollide:function(pObj)
        {
            var backBuf = StickGame.backBuf;
            if (!backBuf) return false;
            // 先进行AABB盒包围判断， 如果碰撞， 再进行像素碰撞判断
            backBuf.clearRect(0,0,this.owner.w,this.owner.h);
            // var  x1 = this.x-this.w*0.5,
            //     y1 = this.y-this.h*0.5,
            //     x2 = this.x+this.w*0.5,
            //     y2 = this.y+this.h*0.5,
            //     x3 = pObj.x-pObj.w*0.5,
            //     y3 = pObj.y-pObj.h*0.5,
            //     x4 = pObj.x+pObj.w*0.5,
            //     y4 = pObj.y+pObj.h*0.5;
            var  x1 = this.x-this.w*0.5 > 0 ? this.x-this.w*0.5 : this.x,
                y1 = this.y-this.h*0.5,
                x2 = this.x+this.w*0.5,
                y2 = this.y+this.h*0.5,
                x3 = pObj.x-pObj.w*0.5,
                y3 = pObj.y-pObj.h*0.5,
                x4 = pObj.x+pObj.w*0.5,
                y4 = pObj.y+pObj.h*0.5;
            //获取相交区域
            // var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
            var dx = this.x-pObj.x,
                dy = this.y-pObj.y,
                dr = this.w/2+pObj.w/2;
            //如果没有相交则退出
            // if(rc[0]>=rc[2]||rc[1]>=rc[3])
            // {
            //     return false;
            // }
            if(dx * dx + dy * dy > dr * dr)
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
                var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
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