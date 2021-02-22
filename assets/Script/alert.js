

cc.Class({
    extends: cc.Component,

    properties: {
        rubish_sprite:cc.Sprite,
        mytip:cc.Label,
    },

    onLoad () {},

    okFunion(){
        this.node.active = false;
        console.log(cc.find('Canvas/BaseView'))
        cc.find('Canvas/BaseView').getComponent('Game').showRanks();
        cc.find('Canvas/BaseView').getComponent('Game').showrestartbtn();
    },
    setTip(str){
        this.mytip.string = str
    },
    start () {

    },
    // update (dt) {},
});
