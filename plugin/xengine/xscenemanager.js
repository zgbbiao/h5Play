 /*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * ��Ϸ����������
 */
(function(win){
   //����������   
   var _sceneman = win.SceneManager = Class.extend({
	   init:function(param)
	   {
          //��������ʽ����,���ڿ���ͨ�����ƻ�ȡ
		  this.namedScenes = {};
		  //�Զ�ջ��ʽ�������г���������Ԫ��Ϊջ��
		  this.scenes = [];		  
	   },
       //�����µĳ���,ͨ�������Ͳ�������,��Ϊscene�������Լ�������,��Ҫע�����arg�Ǳ���Ҫ��������ʽ
	   createScene:function(sceneClass,args){ 			 
         var sc = null;		 
		 if(arguments.length == 1)
		 {
             sc =  ClassFactory.newInstance("Scene",arguments[0]);  
		 }
		 else{
			 sceneClass = sceneClass||"Scene"; 
             sc =  ClassFactory.newInstance(sceneClass,args);
		 }
           this.push(sc);
		 return sc;
	   }, 
       //����������
	   sortSceneIdx:function()
	   {
		   for(var i=0,len=this.scenes.length;i<len;i++)
		   {
			   var sc = this.scenes[i];
			   sc.holder.css("z-index",i);
		   }
	   },
       //ѹ��scene����
       push:function(scene)
	   {
		   if(!this.getScene(scene.name))
		   {
			   this.scenes.push(scene);
			   this.namedScenes[scene.name] = scene;
			   this.sortSceneIdx();
		   }		  
	   },
       //�Ƴ���������
	   pop:function()
	   {
		  var sc = this.scenes.pop();
          if(sc!=null)
		  {
             sc.clean();			 
			 delete this.namedScenes[sc.name]; 
		     this.sortSceneIdx();
		  }		 
	   }, 
	   //ɾ������
	   remove:function(name)
       {
		  var sc = this.getScene(name);
          if(sc!=null)
		  {
             sc.clean();		
			 delete this.namedScenes[name]; 
			 ArrayUtil.removeFn(this.scenes,function(s){
				 return s.name===name;
			 })
		     this.sortSceneIdx();
		  }		  
	   },
	   //��������λ��
       swap:function(from,to)
	   {
		 if(from>=0&&from<=this.scenes.length-1
			&&to>=0&&to<=this.scenes.length-1)
		 {
             var sc = this.scenes[from];
			 this.scenes[from] = this.scenes[to];
			 this.scenes[to] = sc;
			 this.sortSceneIdx();
		 }         
	   },
	   //��ȡĳ������������
	   getIdx:function(scene)
	   {		  
		   return scene.holder.css("z-index");		
	   },
	   //��ĳ�������ƶ������
	   bringToTop:function(scene)
	   {
         var idx = this.getIdx(scene);
		 if(idx!=this.scenes.length-1)
		 {
			 this.scenes.splice(idx,1);
			 this.scenes[this.scenes.length] = scene;	
			 this.sortSceneIdx();
		 }		 
	   },
	   //��ĳ�������ƶ�����ײ�
	   bringToLast:function(scene)
	   {
		 var idx = this.getIdx(scene);
		 if(idx!=0)
		 {
			 this.scenes.splice(idx,1);
			 this.scenes.splice(0,0,scene);
			 this.sortSceneIdx();
		 }		 
	   },
       //��������
       back:function(scene)
       {
		 var idx = this.getIdx(scene);
		 if(idx>0)
		 {
			 this.swap(idx,idx-1);
		 }		 
	   },
       //����ǰ��
       forward:function(scene)
       {
         var idx = this.getIdx(scene);
		 if(idx<this.scenes.length)
		 {			 
			 this.swap(idx,idx+1);
		 }		 
	   },
       //�������ƻ�ȡ����
	   getScene:function(name)
	   {
		 return this.namedScenes[name];
	   }, 
       //��ȡ��ǰ����,��������Ϊ��ǰ����
	   getCurrentScene:function()
       {
		  return this.scenes[this.scenes.length-1];
	   }, 
	   //������г���
	   clearAll:function()
       {
         for(var i in this.scenes)
		 {
           this.scenes[i].clean(); 
		 }
		 this.namedScenes = {};
		 this.scenes = [];
	   }
   });
}(window))