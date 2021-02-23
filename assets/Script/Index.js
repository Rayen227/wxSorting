// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        onePagePrefab: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var onePage = cc.instantiate(this.onePagePrefab);
        onePage.getComponent("OnePage").rendering(0);
    },

    start() {

    },

    // update (dt) {},
});
