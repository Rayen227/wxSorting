// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        rubishAtlas: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },
    rendering(type) {
        console.log(this.getComponent(cc.Sprite));
        console.log("rendering")
    },
    start() {

    },

    // update (dt) {},
});
