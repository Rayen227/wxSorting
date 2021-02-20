cc.Class({
    extends: cc.Component,

    properties: {
        type: 0,//垃圾的类型
        channel: 0,//垃圾现在所处的轨道
        speed: 0,
        id: 0,//垃圾的图片下标
        rubishAtlas: cc.SpriteAtlas,
        parent: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // v_0 = 200pix/s
        this.speed = 200;
        this.type = Math.floor(Math.random() * 4);
        this.channel = Math.floor(Math.random() * 4);
        this.node.runAction(this.setFallAction());
        this.x0 = 93.75;
        this.xInte = 187.5;
        this.y0 = 1200;
        this.game = cc.find('Canvas/BaseView').getComponent("Game");
        var then = this;
        console.log(this.game.scoreLabel);
        this.node.x = this.x0 + this.channel * this.xInte;
        this.node.y = this.y0;
        var touchStart;
        var touchEnd;
        //注册触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {//开始触摸
            touchStart = e.getLocation();
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {//触摸结束
            touchEnd = e.getLocation();
            if (touchEnd.x - touchStart.x > 0 && then.channel != 3) {//向右移
                console.log("向右移");
                then.channel++;
                then.node.runAction(then.toRightAction());
            } else if (touchEnd.x - touchStart.x < 0 && then.channel != 0) {
                console.log("向左移");
                then.channel--;
                then.node.runAction(then.toLeftAction());
            }
            console.log("Current channel:", then.channel);
        });

    },

    setFallAction() {
        return cc.moveBy(1200 / this.speed, cc.v2(0, -1200));
    },

    toRightAction() {
        return cc.moveBy(0.2, cc.v2(187.5, 0)).easing(cc.easeCubicActionOut());
    },
    toLeftAction() {
        return cc.moveBy(0.2, cc.v2(-187.5, 0)).easing(cc.easeCubicActionOut());
    },
    update() {

        if (this.node.position.y <= 175) {
            if (this.type == this.channel) {
                console.log("匹配成功");
                this.game.score++;
                this.game.scoreLabel.string = this.game.score.toString();
            } else {
                console.log("匹配失败");
            }
            this.node.destroy();
        }

    }

    // update (dt) {},
});
