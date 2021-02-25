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
        heartPrefab: {
            default: null,
            type: cc.Prefab
        },
        rubishAtlas: cc.SpriteAtlas,
        iconsAtlas: cc.SpriteAtlas,
        gameOverTesting: true,
        wxSubContextView: cc.Node,       //主域视窗容器
        myAlert: cc.Prefab,
        restartbtn: cc.Node,

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 获取授权
        // this.initUserInfoButton();
        // this.visible = true;
        this.wxSubContextView.active = false;
        this.restartbtn.active = false;
        //生成垃圾的速率(ms)
        this.rate = 4000;
        this.score = 0;
        this.playing = true;
        this.rubishX0 = 93.75;
        this.rubishY0 = 1200;
        this.rubishXInte = 187.5;
        this.rubishStack = new Array();
        //score组件
        this.scoreNode = cc.find('Canvas/BaseView/Score');
        this.scoreLabel = this.scoreNode.getComponent(cc.Label);
        //垃圾桶节点数组
        this.Bins = cc.find('Canvas/BaseView/Bins').children;

        //开始游戏
        this.gameUp();


        var then = this;
        document.addEventListener("visibilitychange", function (e) {
            if (!then.playing)
                return;
            if (e.hidden || document.hidden) {
                clearInterval(then.genarating);
            } else {
                then.genarating = setInterval(then.producer, then.rate);
            }
        });

    },

    // visibilityChange(e) {

    // },

    gameUp() {

        for (var i = 0; i < this.rubishStack.length; i++) {
            if (this.rubishStack[i] && this.rubishStack[i].node)
                this.rubishStack[i].node.destroy();
        }
        this.rubishStack = [];

        this.scoreLabel.string = "0";
        this.score = 0;
        this.score = 69;
        //爱心
        this.hearts = [];
        //初始化爱心
        this.initHearts();
        //生成垃圾
        this.rubishesProducer();

    },

    gameOver() {

        if (this.gameOverTesting) return;
        this.playing = false;
        //清除垃圾生成器
        clearInterval(this.genarating);
        //暂停所有动作
        for (var i = 0; i < this.rubishStack.length; i++) {
            if (this.rubishStack[i] && this.rubishStack[i].node)
                this.rubishStack[i].node.stopAllActions();
        }
    },

    initHearts() {
        var heartCount = 3;
        for (var i = 0; i < heartCount; i++) {
            this.hearts[i] = cc.instantiate(this.heartPrefab);
            this.hearts[i].x = i * 75 + 250;
            this.hearts[i].y = 1275;
            this.node.addChild(this.hearts[i]);
        }
    },

    //垃圾生成函数
    rubishesProducer() {
        var then = this;
        var speed = 200;
        var preRate = 4000;
        this.spawnARubish(speed);

        this.producer = function producer() {
            //Speed is in range 200 to 400
            speed = 200 + then.getLevel() * 50;
            //Rate is in range 2000ms to 4000ms
            then.rate = 4000 - then.getLevel() * 1000;

            //加速
            if (preRate > then.rate) {

                preRate = then.rate;
                clearInterval(then.genarating);

                then.movingText(function () {
                    then.spawnARubish(speed);
                    then.genarating = setInterval(then.producer, then.rate);
                });
            } else {
                then.spawnARubish(speed);
            }

        }

        this.genarating = setInterval(this.producer, this.rate);
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
                    then.score++;
                    then.scoreLabel.string = then.score.toString();

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

                    then.scoreNode.color = new cc.color(
                        Math.floor(Math.random() * 150),
                        Math.floor(Math.random() * 150),
                        Math.floor(Math.random() * 150),
                    );

                } else {

                    then.heart--;

                    //播放动画
                    var wrongNode = new cc.Node;
                    wrongNode.addComponent(cc.Sprite);
                    wrongNode.getComponent(cc.Sprite).spriteFrame = then.iconsAtlas.getSpriteFrame('wrong');
                    wrongNode.x = Rubish.node.x;
                    wrongNode.y = Rubish.node.y;
                    then.node.addChild(wrongNode);

                    wrongNode.runAction(cc.sequence(
                        cc.fadeOut(0.5),
                        cc.callFunc(function () {
                            wrongNode.destroy();
                        }),
                    ));
                    wrongNode.runAction(cc.scaleTo(0.5, 1.2, 1.2));


                    if (then.hearts.length <= 1) {
                        then.gameOver();
                        then.createAlert(Rubish.id, Rubish.type);
                    }
                    var heart = then.hearts.pop();
                    if (heart)
                        heart.destroy();

                }



                Rubish.node.destroy();
                Rubish = null;
                //出栈
                then.rubishStack.shift();
            }
        };

        //根据id设置图片资源
        rubishSprite.spriteFrame = this.rubishAtlas.getSpriteFrame(Rubish.type + '_' + Rubish.id);


        cc.find('Canvas/BaseView/Rubishes').addChild(rubishNode);
        // this.node.addChild(rubishNode);
        //加入暂存栈
        this.rubishStack.push(Rubish);




    },

    //生成飘过的提示文本
    movingText(callBack) {
        var textNode = new cc.Node();
        textNode.addComponent(cc.Sprite);
        var textSprite = textNode.getComponent(cc.Sprite);
        textSprite.spriteFrame = this.iconsAtlas.getSpriteFrame("speedUp");
        textNode.x = 800;
        textNode.y = 1000;
        textNode.scaleX = 1.5;
        textNode.scaleY = 1.5;
        //移动
        textNode.runAction(
            cc.sequence(
                cc.moveBy(0.5, cc.v2(-textNode.x / 2, 0)),
                cc.moveBy(1, cc.v2(0, 0)),
                cc.moveBy(0.5, cc.v2(-550, 0)),
                cc.callFunc(callBack)
            )
        );

        this.node.addChild(textNode);
    },
    getLevel() {
        if (this.score < 10)
            return 0
        else if (this.score < 30)
            return 1;
        else if (this.score < 70)
            return 2;
        else
            return 3;
    },

    //弹出排行榜函数
    showRanks() {
        if (typeof wx === 'undefined') {
            return;
        }
        if (!this.wxSubContextView.active) {
            // 设置容器可见
            this.wxSubContextView.active = true;
            // 设置随机数(把这个当做玩家每局结算时的分数)
            //let score = Math.round(Math.random()*10);
            let score = this.score;
            // 发送结算分数到开放域
            wx.getOpenDataContext().postMessage({
                message: score
            });
        }
        else {
            // 设置容器不可见，即关闭排行榜，并让开放域清空排名信息
            this.wxSubContextView.active = false;
            wx.getOpenDataContext().postMessage({
                message: 'clear'
            });
        }
    },

    createAlert: function (id, type) {
        var node = cc.instantiate(this.myAlert);
        var spritename = type.toString() + '_' + id.toString();
        this.node.addChild(node);
        var myAlert = node.getComponent('alert')
        myAlert.rubish_sprite.spriteFrame = this.rubishAtlas.getSpriteFrame(spritename);
        var typename = ['干垃圾', '可回收物', '湿垃圾', "有害垃圾"];
        myAlert.mytip.string = typename[type];
        this.myAlert.active = true;
    },

    showrestartbtn() {
        this.restartbtn.active = true
    },
    restartFunction() {
        this.showRanks();
        this.restartbtn.active = false;
        this.gameUp();

    },
    returnIndex() {
        this.showRanks();
        this.restartbtn.active = false
        cc.director.loadScene("Index");
    }
});
