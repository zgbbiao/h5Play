 /*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * 包围盒类
 */
(function(win){
   //包围盒抽象类   
   var _bBox = win.BBox = Class.extend({	
	   init:function(x,y)
	   {
		   //中心坐标
		   this.x = x;
		   this.y = y;
		   //颜色
		   this.c = "red";
	   },
       isCollide:function(bbox)
	   {
		   if(this.constructor.ClassName!=bbox.constructor.ClassName)
		   {
			   throw Error("Box Type mismatch! ");
		   }
		   else
		   {
			   return this.collided(bbox);
		   }
	   },
	   collided:function(bbox)
	   {
		   throw Error("This method must be override by child class!");
	   },
	   getType:function()
	   {
		   return this.constructor.ClassName;
	   },	   
       //显示包围盒
	   show:function(ctx)
	   {
		   throw Error("This method must be override by child class!");
	   }
   });
   //圆形包围盒
   var _RBBox = win.RBBox = BBox.extend({
	   //x,y为圆心坐标，r是半径
	   init:function(x,y,r)
	   {
		   this.r = r;
		   this._super(x,y);
	   },
	   collided:function(tBox)
	   {
         var dx = this.x-tBox.x,
			 dy = this.y-tBox.y,
			 dr = this.r+tBox.r;
         return dx*dx+dy*dy<dr*dr;
	   },
	   show:function(ctx)
	   {
		 ctx.beginPath();
	     ctx.strokeStyle =this.c;
		 ctx.lineWidth = 2;
    	 ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    	 ctx.stroke();
	   }
   });
   //矩形包围盒
   var _ABBox = win.ABBox = BBox.extend({
	   init:function(x,y,hw,hh)
	   {
		   this.hh = hh;
		   this.hw = hw;
		   this._super(x,y);
	   },
	   collided:function(tBox)
	   {
         var nx = this.x-this.hw,
			 ny = this.y-this.hh,
			 mx = this.x+this.hw,
			 my = this.y+this.hh,
			 nx1 = tBox.x-tBox.hw,
			 ny1 = tBox.y-tBox.hh,
			 mx1 = tBox.x+tBox.hw,
			 my1 = tBox.y+tBox.hh;
         if(nx>mx1||mx<nx1)return false;
         if(ny>my1||my<ny1)return false;
		 return true;
	   },
	   show:function(ctx)
	   {
         ctx.beginPath();
		 ctx.lineWidth = 2;
	     ctx.strokeStyle = this.c;
    	 ctx.strokeRect(this.x-this.hw,this.y-this.hh,this.hw*2,this.hh*2);
	   }
   }); 
   //凸多边形包围盒
   var _pBBox = win.PBBox = BBox.extend({
	   //x,y是多边形中心坐标,pArr是一个顶点数组，点的坐标采用相对中心点坐标，按顺时针存放各顶点
	   init:function(x,y,pArr)
	   {
		   this.pArr = pArr;
		   this._super(x,y);
	   },     
       //转换所有顶点坐标到绝对坐标系中
	   mapToWorld:function()
	   {
		  var p = [];
          for(var i=0,len = this.pArr.length;i<len-1;i+=2)
		  {
			  p.push(this.pArr[i]+this.x,this.pArr[i+1]+this.y);
		  }
		  return p;
	   },
       collided:function(tBox)
	   {		   
		   var p1 = this.mapToWorld(),
			   p2 = tBox.mapToWorld();
		   return MathUtil.isCollide(p1,p2);
	   },
	   show:function(ctx)
	   {
		   ctx.beginPath();
		   ctx.strokeStyle = this.c;
		   ctx.lineWidth = 2;
		   //移动到第一个点
		   ctx.moveTo(this.pArr[0]+this.x,this.pArr[1]+this.y);
		   for(var i=2,len=this.pArr.length;i<len-1;i+=2)
		   {            
			   ctx.lineTo(this.pArr[i]+this.x,this.pArr[i+1]+this.y);
		   }
		   ctx.closePath();
		   ctx.stroke();
	   }
   });

    //矩形包围盒
    var _PXBBox = win.PXBBox = BBox.extend({
        init:function(x,y)
        {
        	this.x = x
			this.y = y
            this._super(x,y);
        },
        show:function(ctx)
        {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.c;
            ctx.strokeRect(this.x-this.hw,this.y-this.hh,this.hw*2,this.hh*2);
        },
        //检测是否和其他精灵碰撞
        collided:function(pObj)
        {
        	if (!StickGame) return false;
            var backBuf = StickGame.backBuf;
            if (!backBuf) {
                var bC = document.createElement("canvas");
                bC.width = pObj.owner.w;
                bC.height = pObj.owner.h;
                StickGame.backBuf = bC.getContext("2d");
            }
            // 先进行AABB盒包围判断， 如果碰撞， 再进行像素碰撞判断
            backBuf.clearRect(0,0,this.owner.w,this.owner.h);
            var  x1 = this.x-this.w*0.5 > 0 ? this.x-this.w*0.5 : this.x,
                y1 = this.y-this.h*0.5,
                x2 = this.x+this.w*0.5,
                y2 = this.y+this.h*0.5,
                x3 = pObj.x-pObj.w*0.5,
                y3 = pObj.y-pObj.h*0.5,
                x4 = pObj.x+pObj.w*0.5,
                y4 = pObj.y+pObj.h*0.5;
            //获取相交区域
            var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
            // var dx = this.x-pObj.x,
            //     dy = this.y-pObj.y,
            //     dr = this.w/2+pObj.w/2;
            //如果没有相交则退出
            if(rc[0]>=rc[2]||rc[1]>=rc[3])
            {
                return false;
            }
            // if(dx * dx + dy * dy > dr * dr)
            // {
            //     return false;
            // }
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
    });
    _bBox.ClassName = "BBox";
   _RBBox.ClassName = "RBBox";
   _ABBox.ClassName = "ABBox";
    _pBBox.ClassName = "PBBox";
    _PXBBox.ClassName = "PXBBox";
   //注册类到类工厂中
   ClassFactory.regClass(_bBox.ClassName,_bBox);
   ClassFactory.regClass(_RBBox.ClassName,_RBBox);
   ClassFactory.regClass(_ABBox.ClassName,_ABBox);
    ClassFactory.regClass(_pBBox.ClassName,_pBBox);
    ClassFactory.regClass(_PXBBox.ClassName,_PXBBox);
}(window))