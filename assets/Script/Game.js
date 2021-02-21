cc.Class({
    extends: cc.Component,

    properties: {
        //引用垃圾预制
        rubishPrefab: {
            default: null,
            type: cc.Prefab
        },
        //垃圾桶的引用
        bin: {
            default: null,
            type: cc.Node
        },
        rubishAtlas: cc.SpriteAtlas,
        gameOverTesting: true,

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        var then = this;
        //生成垃圾的速率(ms)
        this.rate = 1000;
        this.score = 0;
        this.playing = true;
        this.rubishX0 = 93.75;
        this.rubishY0 = 1200;
        this.rubishXInte = 187.5;

        this.rubishStack = new Array();

        //score组件
        this.scoreLabel = cc.find('Canvas/BaseView/Score').getComponent(cc.Label);

        // 初始为0分
        this.scoreLabel._string = "0";
        //生成垃圾
        this.spawnARubish();
        this.genarating = setInterval(function () {
            then.spawnARubish();
        }, this.rate);


    },
    gameOver() {

        if (this.gameOverTesting) return;

        //清除生成函数
        clearInterval(this.genarating);
        //暂停所有动作
        for (var i = 0; i < this.rubishStack.length; i++) {
            this.rubishStack[i].node.stopAllActions();
        }
    },

    //生成一个垃圾节点并添加至场景
    spawnARubish() {

        //生成节点
        var rubishNode = cc.instantiate(this.rubishPrefab);

        //获取Sprite组件
        var rubishSprite = rubishNode.children[0].getComponent(cc.Sprite);
        console.log(rubishSprite);
        //获取prefab组件
        var Rubish = rubishNode.getComponent("Rubish");

        //其他参数/变量
        var touchStart;
        var touchEnd;
        var then = this;

        //随机生成垃圾的参数
        Rubish.id = Math.floor(Math.random() * 10);
        Rubish.type = Math.floor(Math.random() * 4);
        Rubish.channel = Math.floor(Math.random() * 4);

        //垃圾其他参数初始化
        Rubish.speed = 200;
        Rubish.node.x = this.rubishX0 + Rubish.channel * this.rubishXInte;
        Rubish.node.y = this.rubishY0;

        //设置动画
        // Rubish.node.runAction(cc.moveBy(1200 / Rubish.speed, cc.v2(0, -1200)));
        rubishNode.runAction(cc.moveBy(1200 / Rubish.speed, cc.v2(0, -1200)));

        //注册事件
        // console.log(rubishNode);

        // Rubish.node.on(cc.Node.EventType.TOUCH_START, function (e) {//开始触摸
        //     console.log("Touch")
        //     touchStart = e.getLocation();
        // });
        rubishNode.on(cc.Node.EventType.TOUCH_START, function (e) {//开始触摸
            console.log("Touch");
            touchStart = e.getLocation();
        });

        function touchEndAction(e) {
            console.log(e);
            touchEnd = e.getLocation();
            if (touchEnd.x - touchStart.x > 0 && Rubish.channel != 3) {//向右移
                Rubish.channel++;
                Rubish.node.runAction(
                    cc.moveBy(0.2, cc.v2(187.5, 0)).easing(cc.easeCubicActionOut())
                );
            } else if (touchEnd.x - touchStart.x < 0 && Rubish.channel != 0) {//向左移
                Rubish.channel--;
                Rubish.node.runAction(
                    cc.moveBy(0.2, cc.v2(-187.5, 0)).easing(cc.easeCubicActionOut())
                );
            }
            // console.log("Current channel:", Rubish.channel);
        }
        Rubish.node.on(cc.Node.EventType.TOUCH_CANCEL, touchEndAction);
        Rubish.node.on(cc.Node.EventType.TOUCH_END, touchEndAction);


        Rubish.update = function () {
            if (Rubish.node.position.y <= 175) {
                if (Rubish.type == Rubish.channel) {
                    console.log("匹配成功");
                    then.score++;
                    then.scoreLabel.string = then.score.toString();
                } else {
                    console.log("匹配失败");
                    then.gameOver();
                }
                Rubish.node.destroy();
                Rubish = null;
                //出栈
                then.rubishStack.shift();
            }
        };

        //根据id设置图片资源
        rubishSprite.spriteFrame = this.rubishAtlas.getSpriteFrame(Rubish.type + '_' + Rubish.id);
        // console.log(Rubish.type + '_' + Rubish.id);

        this.node.addChild(rubishNode);
        //加入暂存栈
        this.rubishStack.push(Rubish);
        // this.rubishPool.put(Rubish);
        // console.log(Rubish.type, Rubish.channel);
    },

    update(dt) {
    },
});
