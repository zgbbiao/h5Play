(function(win){
    var width = screen.width || 750
    var height = screen.height || 1334
	g = new Game()
	function initGame() {
    	var scm = g.sceneManager;
    	var sc = scm.createScene([{"x":0,"w":width,"h":height,"name":"title", 'el': $('.main').get(0)}])
        sc.setBGImg('./images/grame_bg.png')
        initRenderObj(sc)
        morioRenderObj(sc)
	}
	// ������
	function initRenderObj(sc) {
		for (var i = 0; i < 10; i++) {
			var obj = sc.createRObj(Ball.ClassName);
            // �������λ��
			obj.moveTo(i * (obj.owner.w / 10), MathUtil.randInt(0, 30))
			// ��������ٶ�
			// obj.dx = MathUtil.randInt(1, 3)
			obj.dy = MathUtil.randInt(1, 3)
			obj.color = ColorUtil.rgb(MathUtil.randInt(255),MathUtil.randInt(255),MathUtil.randInt(255))
		}
    }

    function morioRenderObj (sc) {
        var runFrames = new Frames('m_run', document.querySelector('#mr'))
        var jumpFrames = new Frames('m_jump', document.querySelector('#mr'))
        var crouchFrames = new Frames('m_crouch', document.querySelector('#mr'))
		// �ܲ���
		var arr = [1,2,3]
        arr.forEach(function (item, i) {
            runFrames.add(32 * i, 0, 32, 32)
        })

		// �����Ծ
        jumpFrames.add(0, 0, 32, 32)
        jumpFrames.add(32*6, 0, 32, 32)

		// ��Ӷ���֡
        crouchFrames.add(0, 0, 32, 32)
        crouchFrames.add(32*14, 0, 32, 32)

		// ������������
		var anims = new Animations()
        anims.add('run', runFrames, true)
        anims.add('jump', jumpFrames)
        anims.add('crouch', crouchFrames)

		for (var i = 0; i< 10; i ++) {
        	var mr = sc.createRObj(Mario.ClassName, ['mr'])
            mr.moveTo(i * (mr.owner.w / 10), MathUtil.randInt(0, 30))
			mr.dy = MathUtil.randInt(1,3);
        	mr.setAnimSpeed(2 * Math.random())
			mr.w = mr.h = 64
			mr.setAnims(anims, 'run')

		}
	}
    // ��ʼ����Ϸ
    initGame()
    g.run(-1)
}(window))