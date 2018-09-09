(function(win){
    var width = screen.width || 750
    var height = screen.height || 1334
	g = new Game()
	function initGame() {
    	var scm = g.sceneManager;
    	var sc = scm.createScene([{"x":0,"w":width,"h":height,"name":"Ball", 'el': $('.main').get(0)}])
        sc.setBGImg('./images/grame_bg.png')
        loadRes(sc)
	}

	function loadRes (sc) {
        console.log(sc)
        ResManager.loadRes('data/res.json', function () {
            console.log(arguments);
            initRenderObj(sc)
            morioRenderObj(sc)
            g.run(-1)
        }, function () {
            console.log(arguments);
        })
	}

	// 创建球
	function initRenderObj(sc) {
		for (var i = 0; i < 10; i++) {
			var obj = sc.createRObj(Ball.ClassName);
            // 设置随机位置
			obj.moveTo(i * (obj.owner.w / 10), MathUtil.randInt(0, 30))
			// 设置随机速度
			// obj.dx = MathUtil.randInt(1, 3)
			obj.dy = MathUtil.randInt(1, 3)
			obj.color = ColorUtil.rgb(MathUtil.randInt(255),MathUtil.randInt(255),MathUtil.randInt(255))
		}
    }

    function morioRenderObj (sc) {
		// 创建动画集合
        var anims = ResManager.getAnimationsByName("sprite","Mario");
		for (var i = 0; i< 10; i ++) {
            var mr = sc.createRObj(Mario.ClassName, ['mr'])
            mr.moveTo(i * (mr.owner.w / 10), MathUtil.randInt(0, 30))
			mr.dy = MathUtil.randInt(1,3);
            mr.setAnimSpeed(2 * Math.random())
			mr.w = mr.h = 64
			// 执行相关配置的动画
			mr.setAnims(anims, 'run')
		}
	}
    // 初始化游戏
    initGame()
}(window))