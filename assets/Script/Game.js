// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        }


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.binY = this.bin.y;
    },

    start() {

    },

    // update (dt) {},
});
