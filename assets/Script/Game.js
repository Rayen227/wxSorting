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

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        var then = this;
        //生成垃圾的速率(ms)
        this.rate = 1000;
        this.score = 0;
        //score组件
        this.scoreLabel = cc.find('Canvas/BaseView/Score').getComponent(cc.Label);

        // 初始为0分
        this.scoreLabel._string = "0";
        //生成垃圾
        this.spawnARubish();
        setInterval(function () {
            then.spawnARubish();
        }, this.rate);


    },
    spawnARubish() {
        //生成节点
        var rubishNode = cc.instantiate(this.rubishPrefab);
        //获取Sprite组件
        var rubishSprite = rubishNode.getComponent(cc.Sprite);
        //获取prefab组件
        var Rubish = rubishNode.getComponent("Rubish");


        //随机生成垃圾资源所在id
        Rubish.id = Math.floor(Math.random() * 10);

        //根据id设置图片资源
        rubishSprite.spriteFrame = this.rubishAtlas.getSpriteFrame(Rubish.type + '_' + Rubish.id);


        this.node.addChild(rubishNode);
        console.log(Rubish.type, Rubish.channel);
    },

    update(dt) {
        // this.scoreLabel._string = this.score.toString();
        // console.log(this.score.toString());
        // console.log(this.score, this.scoreLabel._string);
    },
});
