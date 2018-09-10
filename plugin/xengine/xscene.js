/*!
* xengine
* Copyright 2012 xiangfeng
* Released under the MIT license
* Please contact to xiangfenglf@163.com if you hava any question
* ��Ϸ������
*/
(function(win){
    //����������
    var _sceneEventListener = win.SceneEventListener = EventListener.extend({
        init:function(param)
        {
            //�������Ƿ���Ч
            this.enabled = true;
            param=param||{};
            this.onBeforeRender = param["beforeRender"]||this.onBeforeRender;
            this.onAfterRender = param["afterRender"]||this.onAfterRender;
        },
        //������Ⱦ����ǰ����
        onBeforeRender:function(scene){return true;},
        //������Ⱦ�����󴥷�
        onAfterRender:function(scene){return true;}
    });
    //������
    var _scene = win.Scene = Class.extend({
        init:function(arg)
        {
            arg = arg||{};
            //��������
            this.name = arg.name||("Unnamed_"+(++_scene.SID));
            //λ����Ϣ
            this.x = arg.x||0;
            this.y = arg.y||0;
            this.w = arg.w||320;
            this.h = arg.h||200;
            var parentDom = arg.el || document.body
            this.color = arg.color||"black";
            //��������
            this.holder = $("<div id='sc_"+this.name+"' style='position:absolute;overflow:hidden;left:0px;top:0px'></div>")
            //�󶨵�canvasԪ��,�Ժ�ľ��鶼�����canvas�Ͻ��л���
            this.cvs = $("<canvas id='cv_"+this.name+"' style='z-index:-1;position:absolute;left:0px;top:0px'></canvas>");
            this.ctx = this.cvs[0].getContext("2d");
            this.setPos();
            this.setSize();
            this.setColor(this.color);
            this.holder.append(this.cvs);
            $(parentDom).append(this.holder);
            //�������еļ�����
            this.listeners = [],
                //��¼���е���Ⱦ����
                this.rObjs = [];
            //��������Ⱦ���󣬱��ڸ������ƿ��ٲ��Ҷ���
            this.namedRObjs = {};
        },
        //������Ⱦ����
        createRObj:function(className,arg)
        {
            className = className||"RenderObj";
            var obj =  ClassFactory.newInstance(className,arg);
            this.addRObj(obj);
            return obj;
        },
        //��ӵ�rObjs��
        addRObj:function(renderObj)
        {
            renderObj.owner = this;
            this.rObjs.push(renderObj);
            this.namedRObjs[renderObj.name] = renderObj;
        },
        //ɾ������
        removeRObj:function(renderObj)
        {
            this.removeRObjByName(renderObj.name);
        },
        //�����������ö����Ƴ����
        removeRObjByName:function(name)
        {
            this.namedRObjs[name]&&(this.namedRObjs[name].canRemove=true||true);
        },
        //�Ƴ������ÿ��Ƴ���ǵĶ���
        removeAllCanRemove:function()
        {
            for(var i=0;i<this.rObjs.length;i++)
            {
                var o = this.rObjs[i];
                if(o.canRemove){
                    delete this.namedRObjs[o.name];
                    this.rObjs.splice(i,1);
                }
            }
        },
        //�������Ʋ��Ҷ���
        getRObjByName:function(name)
        {
            return this.namedRObjs[name];
        },
        //���������Ⱦ����
        clearRObj:function()
        {
            this.rObjs = [];
            this.namedRObjs = {};
        },
        //��Ӽ�����
        addListener:function(ln)
        {
            this.listeners.push(ln);
        },
        //��ռ������б�
        clearListener:function()
        {
            this.listeners.length = 0;
        },
        //���³���
        update:function()
        {
            var o = [];
            for(var i = 0;i<this.rObjs.length;i++)
            {
                this.rObjs[i].update();
            }
            this.removeAllCanRemove();
        },
        //ִ����Ⱦ
        render:function()
        {
            var ltns = this.listeners;
            //���������������Ⱦ
            this.clear();
            //ִ����Ⱦǰ������
            for(var i=0,len = ltns.length;i<len;i++)
            {
                ltns[i].enabled&&ltns[i].onBeforeRender(this);
            }
            //����
            this.sortRObj();
            this.renderRObj();
            //ִ����Ⱦ�������
            for(var i=0;i<len;i++)
            {
                ltns[i].enabled&&ltns[i].onAfterRender(this);
            }
        },
        //��Ⱦ���ж���
        renderRObj:function()
        {
            for(var i = 0,len = this.rObjs.length;i<len;i++)
            {

                this.ctx.save();
                this.rObjs[i].isVisible&&this.rObjs[i].render(this.ctx);
                this.ctx.restore();
            }
        },
        //��zIdx����������Ⱦ������Ⱦ������ԽСԽ����Ⱦ
        sortRObj:function()
        {
            this.rObjs.sort(function(o1,o2){
                return o1.zIdx-o2.zIdx;
            })
        },
        //����λ��
        setPos:function(x,y)
        {
            this.x = x||this.x;
            this.y = y||this.y;
            this.holder.css("left",this.x).css("top",this.y);
        },
        //���ô�С
        setSize:function(w,h)
        {
            this.w = w||this.w;
            this.h = h||this.h;
            this.holder.css("width",this.w).css("height",this.h);
            this.cvs.attr("width",this.w).attr("height",this.h);
        },
        //����canvas����
        setColor:function(color)
        {
            this.color = color||"black";
            this.holder.css("background-color",this.color);
        },
        //���canvas����
        clear:function()
        {
            this.ctx.clearRect(0,0,this.w,this.h);
        },
        //��ʾ
        show:function()
        {
            this.holder.show();
        },
        //����
        hide:function()
        {
            this.holder.hide();
        },
        fadeOut:function(time,fn)
        {
            this.holder.fadeOut(time,fn);
        },
        fadeIn:function(time,fn)
        {
            this.holder.fadeIn(time,fn);
        },
        //���ñ���,pattern:0(����),1(����),Ĭ��(ƽ��)
        setBGImg:function(imgURL,pattern)
        {
            this.holder.css("background-image","url("+imgURL+")");
            switch(pattern)
            {
                case 0:
                    this.holder.css("background-repeat","no-repeat");
                    this.holder.css("background-position","center");
                    break;
                case 1:
                    this.holder.css("background-size",this.w+"px "+this.h+"px ");
                    break;
            }
        },
        //������������Դ
        clean:function()
        {
            this.listeners = null;
            this.cvs.remove();
            this.holder.remove();
            this.cvs = this.holder = this.ctx = null;
        }
    });
    //��¼scene���
    _scene.SID = 0;
    _scene.ClassName = "Scene";
    //ע���ൽ�๤����
    ClassFactory.regClass(_scene.ClassName,_scene);
}(window))