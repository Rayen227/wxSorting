cc.Class({
    extends: cc.Component,

    properties: {
        //引用垃圾预制
        rubishPrefab: {
            default: null,
            type: cc.Prefab
        },
        // rubishNode: {
        //     default: null,
        //     type: cc.Node
        // },
        //垃圾桶的引用
        bin: {
            default: null,
            type: cc.Node
        },
        rubishNode: {
            default: null,
            type: cc.Node
        }

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.binY = this.bin.y;
        // for (var i = 0; i < 50; i++) {
        //     console.log(Math.floor(Math.random() * 4));
        // }
        // console.log(this.rubishPrefab);
        // this.spawnNewRubish();
        this.spawnARubish();
    },
    spawnARubish() {

        // 使用给定的模板在场景中生成一个新节点
        var newRubish = cc.instantiate(this.rubishPrefab);
        // console.log(this.rubishPrefab);
        // console.log(newRubish.properties);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newRubish);
        // console.log(newRubish);

        //生成参数
        // var _x = 93.75;
        // var _y = 1200;
        // var randChannel = Math.floor(Math.random() * 4);
        // var randType = Math.floor(Math.random() * 4);

        // 为星星设置一个随机位置
        // newRubish.setPosition(_x, _y);
        // console.log(newRubish);
        // console.log(newRubish.type, newRubish.channel);
        // newRubish.setPosition(500, 1000);
        // newRubish.type = randType;
        // newRubish.channel = randChannel;
        // newRubish.__proto__.setType(randType);
        // newRubish.__proto__.setChannel(randChannel);
    }

    // update (dt) {},
});
