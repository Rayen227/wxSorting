cc.Class({
    extends: cc.Component,

    properties: {
        type: 0,
        channel: 0,
        speed: 0,
        scr: '',
        rubishAtlas: cc.SpriteAtlas,
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
        var then = this;


        // this.Sprite = cc.Sprite;
        // this.Sprite.spriteFrame = this.rubishAtlas.getSpriteFrame('0_5');
        // console.log(this);
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
            if (touchEnd.x - touchStart.x > 0) {//向右移
                console.log("向右移");
                then.node.runAction(then.toRightAction());
            } else {
                console.log("向左移");
                then.node.runAction(then.toLeftAction());
            }
        });

    },

    setFallAction() {
        return cc.moveBy(1200 / this.speed, cc.v2(0, -1200));
    },

    toRightAction() {
        if (this.node.position.x >= this.x0 + 3 * this.xInte) return null;
        return cc.moveBy(0.2, cc.v2(187.5, 0)).easing(cc.easeCubicActionOut());
    },
    toLeftAction() {
        if (this.node.x <= this.x0) return null;
        return cc.moveBy(0.2, cc.v2(-187.5, 0)).easing(cc.easeCubicActionOut());
    },
    update() {

        if (this.node.position.y <= 175) {
            if (this.type == this.channel) {
                console.log("匹配成功");
            } else {
                console.log("匹配失败");
            }
            this.node.destroy();
        }

    }

    // update (dt) {},
});
