/*
 * 挡板球游戏
 */
(function(win){
    var _stickGame = Game.extend({
        //记录碰撞物体
        cObjs:[],
        //配置
        cfg:null,
        //小球对象
        rabbit:null,
        //游戏状态  -1 结束：  0 暂停，  1 开始
        state:-1,
        // 是否被选中， 如果不是， 一直检测， 否则不检测
        isSelectSprict: false,
        //后台canvas
        backBuf:null,
        // 创建的总物体(z坠落物)数量
        goodsNum: 0,
        // 是否开始拖动？
        isTouch: false,
        // 得分
        score: 0,
        // 生命值
        hp: 100,
        // 是否循环创建精灵
        isLoop: false,
        // 记录倒计时句柄
        downTimeId: null,
        //初始化游戏
        init:function()
        {
            //获取场景管理器
            this._super();
            var scm = this.sceneManager;
            //创建场景
            var x = 0
            var width = getCreen().width
            var height = getCreen().height
            //开始场景
            var tSC = scm.createScene([{"x":x,"w":width,"h":height,"name":"title", el: document.querySelector(".main")}]);
            //游戏场景
            var mSC = scm.createScene([{"color":"gray","x":x,"w":width,"h":height,"name":"main", el: document.querySelector(".main")}]);
            this.mSC = mSC
            //创建后台canvas
            var bC = document.createElement("canvas");
            bC.width = mSC.w;
            bC.height = mSC.h;
            this.backBuf = bC.getContext("2d");
            //结束场景
            var eSC = scm.createScene([{"x":x,"w":width,"h":height,"name":"end", el: document.querySelector(".main")}]);
            //初始化所有场景
            this.initTSC(tSC);
            this.initMSC(mSC);
            this.initESC(eSC);
            this.initListener();
            this.showScene("title");
            //加载资源
            this.loadRes();
            var self = this;
            $(".btn-start").click(function () {
                //开始飞奔
                $('.grame_bg').hide()
                self.countDown(function () {
                    self.isTouch = true
                    self.grameStart()
                })
            })
            $(".grame_btn-argin").click(function () {
                self.reset()
                self.showMain()
                $(".btn-start").click()
            })
            $(".grame_btn-back").click(function () {
                self.reset()
                self.showMain()
            })
            $(".grame_btn-getprize").click(function () {
                self.reset()
                self.showMain()
                $(".grame-pop-myprize").show()
            })
            $('.grame_pop_close').click(function () {
                self.reset()
                self.showMain()
                $(this).parents('.z-model').css('display', 'none')
            })
        },
        reset: function () {
            var scm = this.sceneManager;
            this.cObjs = []
            this.goodsNum = 0
            this.score = 0
            this.hp = 100
            $(".grame-pop-defeated").hide()
            $(".grame-pop-success").hide()
            $(".header-down").hide()
            $(".grame-pop-myprize").hide()
            $(".grame-pop-sort").hide()
            $(".grame-pop-myprize").hide()
            $(".grame-pop-rule").hide()
            this.state = -1
            $("#pTxt").text("Loading:"+0+"%");
            $("#pBar").width(0 + '%');
            this.mSC.clearRObj()
            this.isLoop = false
            scm.getScene('main').clear()
            this.isTouch = false
        },
        countDown: function (callback) {
            var slef = this;
            this.state = 1
            $('.grame-count-down').show()
            var count = this.cfg.config.importTime
            $('.grame-count-down-num').html(count)
            var countDownId = setInterval(function () {
                $('.grame-count-down-num').html(--count)
                if (count<=0) {
                    clearInterval(countDownId)
                    countDownId = null
                    $('.grame-count-down').hide()
                    callback && callback()
                }
            }, 1000)
        },
        grameStart: function () {
            var self = this
            var sc = this.sceneManager.getScene("main");
            var screenWidth = getCreen().width
            self.run(30);
            $(".header-down").css('display', 'block')
            var downCount = this.cfg.config.time
            $('.down-second').html(downCount + 'S')
            this.downTimeId = setInterval(function () {
                downCount--
                $('.down-second').html(downCount + 'S')
                if (downCount <= 0) {
                    self.grameStop()
                    self.survival()
                    downCount = 0
                }
            }, 1000)
            self.isLoop = true
            function loop() {
                self.batchCreateSprit(function (arr, arr2) {
                    arr.forEach(function (item, i) {
                        self.goodsNum++
                        var popx = randomFrom(self.cfg.config.jiange.x1, self.cfg.config.jiange.x2)
                        var popy = randomFrom(self.cfg.config.jiange.y1, self.cfg.config.jiange.y2)
                        self.createSprit(sc, arr2[item].name, screenWidth/4 * item + popx + (self.cfg[arr2[item].name].w/4) + self.cfg.config.skewSite.x , 0 + popy + self.cfg.config.skewSite.y, function (st) {
                            st.dy = MathUtil.randInt(self.cfg.config.dy[0], self.cfg.config.dy[1]);
                            st.dx = MathUtil.randInt(self.cfg.config.dx[0], self.cfg.config.dx[1]);
                        })
                    })
                })
                if (self.isLoop) {
                    setTimeout(function () {
                        loop()
                    }, self.cfg.config.createTime)
                }
            }
            loop()
        },
        grameStop: function () {
          var self = this
            self.stop()
            self.hp = -1
            clearInterval(self.downTimeId)
            self.isLoop = false
        },
        // 挑战失败
        grameFailed: function () {
            var self = this;
            $('.grame-pop-defeated').show().find('.grame-pop-score').html(self.score)
        },
        grameSuccess: function () {
            var self = this;
            $('.grame-pop-success').show().find('.grame-pop-score').html(self.score)
        },
        // 生命值判断
        survival: function () {
            var self = this
            // 处理死亡结束
            if (self.hp <= 0) {
                self.grameStop()
                // 通关
                if (self.score >= self.cfg.config.score) {
                    self.grameSuccess()
                    return false
                } else {
                    self.grameFailed()
                }

                return false
            }
        },
        //显示场景
        showScene:function(name)
        {
            var sc = this.sceneManager.getScene(name);
            this.sceneManager.bringToTop(sc);
        },
        //初始化title场景，添加加载进度条和提示
        initTSC:function(sc)
        {
            //创建UI,创建加载进度条
            var pBar = $("<div id='pCBar' class='my-progress-box'></div>");
            pBar.append("<div id='pBar' class='my-progress-width'></div>");
            sc.holder.append("<div id='pTxt' class='my-progress-text'>Loading...</div>");
            sc.holder.append(pBar);
        },
        //初始化main场景
        initMSC:function(sc)
        {
            //创建UI
            // sc.holder.append("<div id='pLifeTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:10px'>Life:0</div>");
            // sc.holder.append("<div id='pLevTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:150px'>Level:1</div>");
            // sc.holder.append("<div id='pScTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:290px'>Score:000</div>");
        },
        //初始化结束场景
        initESC:function(sc)
        {
            //创建UI
            sc.holder.append("<div id='pEndTxt' style='text-align:center;font-size:35px;position:absolute;border-radius:3px;color:white;left:50px;top:245px;height:10px;width:300px;'>Game Over</div>");
        },
        //增加游戏监听器
        initListener:function()
        {
            var self = this;
            //增加监听器
            var ltn = new AppEventListener({
                "afterRender":function(){
                    // 处理得分
                    $(".getprize-num").html(self.score)
                    if (self.cfg.config.scale.bili * self.score > 0) {
                        // 修改 从设置比例扩大 修改为修改图片的宽度  start
                       var sx =  self.selObj.initScaleX + (self.cfg.config.scale.bili * self.score / self.cfg.config.scale.num)
                        var sy =  self.selObj.initScaleY + (self.cfg.config.scale.bili * self.score / self.cfg.config.scale.num)
                        if (!self.selObj.initW) {
                            self.selObj.initW = self.selObj.w
                        }
                        if (!self.selObj.initH) {
                            self.selObj.initH = self.selObj.h
                        }
                        self.selObj.w = (sx + 1 ) * self.selObj.initW
                        self.selObj.h = (sy + 1 ) * self.selObj.initH
                        // 修改 从设置比例扩大 修改为修改图片的宽度  end
                    }
                    self.survival()
                }

            });
            this.addListener(ltn);
        },
        //加载资源
        loadRes:function()
        {
            var self = this,
                scm = this.sceneManager,
                sc = scm.getScene("main");
            ResManager.loadRes("data/res.json",function(){
                    //加载游戏配置文件
                    ResUtil.loadFile("data/gamecfg.json",null,function(data){
                        self.cfg = data;
                        // 显示主画面
                        self.showMain();
                    });
                },
                function(total,cur){
                    //渲染进度条
                    var pro = (cur/total)*100|0;
                    $("#pTxt").text("Loading:"+pro+"%");
                    $("#pBar").width(pro + '%');
                });
        },
        //显示游戏主画面
        showMain:function(callback)
        {
            var self = this
            this.loadCfg(function () {
                self.showScene("main");
                $('.grame_bg').show()
                callback && typeof callback === 'function' && callback()
            });
        },
        //显示成功结束
        showSuccess:function()
        {
            $("#pEndTxt").text("Mission Complete!");
            this.showScene("end");
        },
        //显示Gameover
        showGameover:function()
        {
            $("#pEndTxt").text("Game Over!");
            this.showScene("end");
        },
        //从配置加载游戏
        loadCfg:function(callback)
        {
            var sc = this.sceneManager.getScene("main");
            this.mSC.setBGImg(this.cfg.bg.src)
            var slef = this;
            slef.state = 1
            this.createSprit(sc, 'rabbit', 300, 0, function (st) {
                st.moveTo(getCreen().width/2 - st.w / 2, getCreen().height / 2 - st.h / 2)
                callback && callback()
            })
        },
        batchCreateSprit: function ( callback) {
            var self = this
          /*
          *  整理：
          *  生成两个数组
          *  位置组：  随机生成四个位置， 1 ， 2， 3， 4   四个值不能重复，  但不一定按照顺序排列，   数组第一项Y轴最小， 最后一下Y轴最大
          *  物品组：
          *  事先定义一个数组， 里面包含（西瓜，苹果，橘子，石头，月饼）
          *  然后随机一个数字（最大为数组的长度， 最小为0）， 根据这个随机的数组拿出里面的值，并按照顺序放到位置组内 由位置组渲染
          * */
          var initSite = [0, 1, 2, 3]
          var siteArr = [] // 位置组
          var goodsArr = [] //物品组

            function addGoods (num, obj) {
                for (var i = 0; i < num; i++) {
                    goodsArr.push(obj)
                }
            }

            addGoods(self.cfg.watermelon.share, {
                name: 'watermelon',
                zhName: '西瓜'
            })
            addGoods(self.cfg.apply.share, {
                name: 'apply',
                zhName: '苹果'
            })
            addGoods(self.cfg.stone.share, {
                name: 'stone',
                zhName: '石头'
            })
            addGoods(self.cfg.wuren.share, {
                name: 'wuren',
                zhName: '月饼'
            })
            addGoods(self.cfg.orange.share, {
                name: 'orange',
                zhName: '橘子'
            })
            goodsArr = shuffle(goodsArr)
            // var initSite2 = [].concat(initSite)  // 复制位置组
            // var arr = [] // 结果位置组
            // // 随机拿出初始化位置的数组
            // initSite.forEach(function (item, i) {
            //     var index = Math.floor(Math.random() * initSite2.length)
            //     var siteNum = initSite2[index]
            //     initSite2.splice(index, 1)
            //     arr.push(siteNum)
            // })
            //
            // var goodsArr2 = [].concat(goodsArr)
            // var arr2 = [] // 结果物品组
            // // 随机拿出初始化物品的数组
            // goodsArr.forEach(function (item, i) {
            //     var index = Math.floor(Math.random() * goodsArr2.length)
            //     var siteNum = goodsArr2[index]
            //     goodsArr2.splice(index, 1)
            //     arr2.push(siteNum)
            // })
            // console.log(arr2)
            callback && callback(initSite, goodsArr.slice(0, 4))
        },
        /*
        * @desc: 绘制精灵
        * @params: sc  场景
        * @params: sprit: 精灵名称
        * @params: initx: 初始位置
        * @params: inity: 初始位置
        * @params: callback  回调函数
        * */
        createSprit: function(sc, sprit, initx, inity, callback) {
            var UpperSprit = sprit.substring(0,1).toUpperCase()+sprit.substring(1);
            var cfg = this.cfg[sprit]
            // 按在生成的数量进行名称叠加， 防止名称一致导致只删除最后的物品；
            var initSpritName = sprit
            if (sprit !== 'rabbit') {
                sprit = sprit + this.goodsNum
            }
            var st = sc.createRObj(win[UpperSprit].ClassName, [sprit])
            var obj = setSlaceWH({
                initW: this.cfg.bg.w,
                initH: this.cfg.bg.h,
                s_initW: cfg.w,
                s_initH: cfg.h
            })
            st.initName = initSpritName
            st.w = cfg.w
            st.h = cfg.h
            var scaleXNum = 1
            var scaleYNum = 1
            scaleXNum = cfg.scaleX || scaleXNum
            scaleYNum = cfg.scaleY || scaleYNum
            st.scaleX = obj.biliW * scaleXNum
            st.scaleY = obj.biliH * scaleYNum
            st.initScaleX = obj.biliW * scaleXNum
            st.initScaleY = obj.biliH * scaleYNum
            st.moveTo(initx, inity)
            callback && callback(st)
            var anims = ResManager.getAnimationsByName(cfg.resName, cfg.fName)
            st.setAnims(anims)
            this.mysprit = typeof this.mysprit === 'object' ? this.mysprit : {}
            this.mysprit[sprit] = st
            this.cObjs.push(st)
        },
        //创建分数文本
        createScore:function(x,y,param)
        {
            var p = PubUtil.merge(param,{"x":x,"y":y,"txt":0,"col":"red","f_size":30,"l_time":800});
            var sc = this.sceneManager.getScene("main");
            var sprit = 'acoretext'
            var UpperSprit = sprit.substring(0,1).toUpperCase()+sprit.substring(1);
            var tObj = sc.createRObj(win[UpperSprit].ClassName);
            tObj.birth = FrameState.currTime;
            tObj.life = p.l_time;
            tObj.col = p.col;
            tObj.txt = p.txt;
            tObj.size = p.f_size;
            tObj.x = x;
            tObj.y = y;
            tObj.tAlpha = 1.0;
            tObj.dy = -1;
        },
        //创建爆炸精灵
        createBoom:function(x,y,callback)
        {
            var self = this
            var sc = this.sceneManager.getScene("main");
            this.createSprit(sc, 'boom0', 0, 0, function (st) {
                st.moveTo(x, y)
                callback && callback()
            })
        },
    });
    //定义全局StickGame
    win.StickGame = new _stickGame();
    function addEvent() {
        var _self = StickGame;

        function getMoveScrpit () {
            //获取游戏窗口坐标
            var sc = _self.sceneManager.getScene("main");
            var gx = sc.x,
                gy = sc.y,
                mx = Mouse.gX(),
                my = Mouse.gY();
            _self.selObj = _self.selObj || null;
            //转换鼠标坐标到游戏窗口坐标系
            var cd = MathUtil.mapSToCoord(mx,my,gx,gy);
            var cobj = sc.rObjs;
            // 修改--  修改验证规则
            var o = _self.selObj;
            var www = o.w * (o.scaleX > 1 ? o.scaleX : 1)
            var hhh = o.h * (o.scaleY > 1 ? o.scaleX : 1)
                if(MathUtil.pInRect(cd[0],cd[1],o.x-www*0.5,o.y-hhh*0.5,www,hhh))
                {
                    _self.selObj.c = 'red'
                    _self.isSelectSprict = true
                    _self.selObj.ox = _self.selObj.x;
                    _self.selObj.oy = _self.selObj.y;
                    _self.selObj.status = 1;
                }

        }

        //定义鼠标事件
        Mouse.sDLG("down",function(e){
            if (_self.state === 1 && _self.isTouch) {
                getMoveScrpit()
            }
        })
        Mouse.sDLG("move",function(e){
            var sc = _self.sceneManager.getScene("main");
            if(_self.selObj!=null&&_self.selObj.status==1)
            {

                var so = _self.selObj;
                if (_self.selObj && _self.selObj.name !== 'rabbit') {
                    getMoveScrpit()
                    return false
                }
                // if (!_self.isSelectSprict) {
                //     getMoveScrpit()
                // }
                //  修改 --- 进行边界判断， 还未渲染前先进行更改数据， 不然在物体超出屏幕后会被销毁掉
                var gx = Mouse.gXOff(), gy = Mouse.gYOff(), movex, movey
                movex = _self.selObj.ox + gx
                movey = _self.selObj.oy + gy
                if ( movex < -10) {
                    movex = -10
                }
                if (movex > _self.selObj.owner.w) {
                    movex = _self.selObj.owner.w
                }
                if ( movey < -10) {
                    movey = -10
                }
                if (movey > _self.selObj.owner.h) {
                    movey = _self.selObj.owner.h
                }

                _self.selObj.moveTo(movex, movey);
            }
        })
        Mouse.sDLG("up",function(e){
            if(_self.selObj!=null)
            {
                _self.selObj.status = 0;
                _self.selObj.c = 'yellow'
            }
            _self.isSelectSprict = false
        });
    }
    addEvent()
}(window))