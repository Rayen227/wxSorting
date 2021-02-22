cc.Class({
    extends: cc.Component,

    properties: {
        //引用垃圾预制
        rubishPrefab: {
            default: null,
            type: cc.Prefab
        },
        //引用泡泡破裂帧动画预制
        burstPrefab: {
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


        //生成垃圾的速率(ms)
        this.rate = 2000;
        this.score = 0;
        this.playing = true;
        this.rubishX0 = 93.75;
        this.rubishY0 = 1200;
        this.rubishXInte = 187.5;

        this.rubishStack = new Array();

        //score组件
        this.scoreLabel = cc.find('Canvas/BaseView/Score').getComponent(cc.Label);
        //垃圾桶节点数组
        this.Bins = cc.find('Canvas/BaseView/Bins').children;
        // 初始化分数
        this.scoreLabel._string = "0";

        //生成垃圾

        this.rubishesProducer();



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

    //垃圾生成函数
    rubishesProducer() {
        var then = this;
        var speed = 200;
        var preRate = 5000;
        this.spawnARubish(speed);



        this.genarating = setInterval(producer, this.rate);

        function producer() {
            //Speed is in range 200 to 400
            speed = 200 + then.getLevel() * 50;
            //Rate is in range 1000ms to 4000ms
            then.rate = 2000 - then.getLevel() * 500;

            // console.log(preRate, then.rate);
            if (preRate > then.rate) {
                preRate = then.rate;
                clearInterval(then.genarating);
                then.genarating = setInterval(producer, then.rate);
            }

            then.spawnARubish(speed);
        }
    },

    //生成一个垃圾节点并添加至场景
    spawnARubish(speed) {

        //生成节点
        var rubishNode = cc.instantiate(this.rubishPrefab);

        //获取Sprite组件
        var rubishSprite = rubishNode.children[0].getComponent(cc.Sprite);
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
        Rubish.speed = speed ? speed : 200;
        Rubish.node.x = this.rubishX0 + Rubish.channel * this.rubishXInte;
        Rubish.node.y = this.rubishY0;

        //设置动画
        rubishNode.runAction(cc.moveBy(1200 / Rubish.speed, cc.v2(0, -1200)));

        //注册事件

        Rubish.node.on(cc.Node.EventType.TOUCH_START, function (e) {//开始触摸
            touchStart = e.getLocation();
        });

        //移动至节点外，需要判断具体移动到哪一格
        Rubish.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            touchEnd = e.getLocation();
            var touchMove = touchEnd.x - touchStart.x;

            if (touchMove >= 421.875) {//右移3格
                Rubish.channel += 3;
            }
            else if (touchMove >= 275.625) {//右移2格
                Rubish.channel += 2;
            }
            else if (touchMove > 0) {//右移1格
                Rubish.channel++;
            }
            else if (-touchMove >= 421.875) {//左移3格
                Rubish.channel -= 3;
            }
            else if (-touchMove >= 275.625) {//左移2格
                Rubish.channel -= 2;
            }
            else if (touchMove < 0) {//左移1格
                Rubish.channel--;
            }

            if (Rubish.channel > 3)
                Rubish.channel = 3;
            else if (Rubish.channel < 0)
                Rubish.channel = 0;


            Rubish.node.runAction(
                cc.moveBy(
                    0.2,
                    cc.v2(
                        then.Bins[Rubish.channel].x - Rubish.node.x,
                        0
                    )
                ).easing(cc.easeCubicActionOut())

            );

        });
        //节点内移动，只移动则一格
        Rubish.node.on(cc.Node.EventType.TOUCH_END, function touchEndAction(e) {
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
        });


        Rubish.update = function () {
            if (Rubish.node.position.y <= 175) {
                if (Rubish.type == Rubish.channel) {
                    console.log("匹配成功");
                    then.score++;
                    // then.score += 10;
                    then.scoreLabel.string = then.score.toString();
                } else {
                    console.log("匹配失败");
                    then.gameOver();
                }

                //播放动画
                var burstNode = cc.instantiate(then.burstPrefab);
                var burstAnim = burstNode.getComponent(cc.Animation);
                burstAnim.play("Burst");
                burstNode.x = Rubish.node.x;
                burstNode.y = Rubish.node.y;
                burstNode.scaleX = 1.5;
                burstNode.scaleY = 1.5;

                burstAnim.on('finished', function () {
                    burstNode.destroy();
                    burstNode = null;
                });
                then.node.addChild(burstNode);

                Rubish.node.destroy();
                Rubish = null;
                //出栈
                then.rubishStack.shift();
            }
        };

        //根据id设置图片资源
        rubishSprite.spriteFrame = this.rubishAtlas.getSpriteFrame(Rubish.type + '_' + Rubish.id);

        this.node.addChild(rubishNode);
        //加入暂存栈
        this.rubishStack.push(Rubish);


        console.log(Rubish.type);


    },

    //分数逻辑函数
    scoreAction() {
    },

    getLevel() {
        if (this.score < 10)
            return 0
        if (this.score < 30)
            return 1;
        else
            return 2;
    }
});
