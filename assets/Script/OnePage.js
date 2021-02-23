cc.Class({
    extends: cc.Component,

    properties: {
        rubishAtlas: cc.SpriteAtlas,
        rubishPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    //��Ⱦ��ҳ
    rendering(type) {
        var N = 10;
        // for (var i = 0; i < 10; i++) {
        //     var name = type + "_" + i;
        //     var rubishNode = new cc.Node(name);
        //     this.node.addChild(rubishNode);
        //     // var rubishNode = cc.Node;
        //     // console.log(rubishNode);
        //     rubishNode.addComponent(cc.Sprite);
        //     var rubishSprite = rubishNode.getComponent(cc.Sprite);
        //     rubishSprite.spriteFrame = this.rubishAtlas.getSpriteFrame(name);
        //     rubishNode.x = 100;
        //     rubishNode.y = 1000;

        //     console.log(rubishSprite);
        // }
        var name = "0_0";
        var rubishNode = new cc.Node(name);
        this.node.addChild(rubishNode);
        // var rubishNode = cc.Node;
        // console.log(rubishNode);
        rubishNode.addComponent(cc.Sprite);
        var rubishSprite = rubishNode.getComponent(cc.Sprite);
        rubishSprite.spriteFrame = this.rubishAtlas.getSpriteFrame(name);
        rubishNode.x = 100;
        rubishNode.y = 1000;
        console.log(rubishNode);

        // console.log(sprite);
    },
    start() {

    },

    // update (dt) {},
});
