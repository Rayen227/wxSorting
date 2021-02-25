
cc.Class({
    extends: cc.Component,

    properties: {
        wxSubContextView: cc.Node,
        onePagePrefab: cc.Prefab,
        startbtn: cc.Node,
        showbanksbtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initUserInfoButton();
        this.startbtn.active = false;
        this.wxSubContextView.active = false;


        this.AnimationON();
    },

    //播放动画
    AnimationON() {
        var ring = cc.find('Canvas/BaseView/showrankbtn/Ring');
        var duration = 4;
        ring.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(duration / 2, 3, 3),
            cc.scaleTo(duration / 2, 1, 1),
        )));
        ring.runAction(cc.repeatForever(cc.sequence(
            cc.fadeIn(duration / 2),
            cc.fadeOut(duration / 2),
        )));
    },

    startGame() {
        this.wxSubContextView.active = false;
        if (typeof wx !== "undefined") {
            wx.getOpenDataContext().postMessage({
                message: 'clear'
            });
        }

        cc.director.loadScene("MainView");
    },

    initUserInfoButton() {
        const _this = this
        // 微信授权，此代码来自Cocos官方
        if (typeof wx === 'undefined') {
            return;
        }

        window.wx.getSetting({
            success(res) {
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                    _this.startbtn.active = true
                } else {
                    console.log("用户未授权");
                    let systemInfo = wx.getSystemInfoSync();
                    let width = systemInfo.windowWidth;
                    let height = systemInfo.windowHeight;
                    let button = wx.createUserInfoButton({
                        type: 'text',
                        text: '点击授权',
                        style: {
                            left: 115,
                            top: 550,
                            width: 150,
                            height: 50,
                            lineHeight: 50,
                            backgroundColor: '#00B26A',
                            color: '#FFFFFF ',
                            textAlign: 'center',
                            fontSize: 20,
                            borderRadius: 5
                        }
                    });

                    button.onTap((res) => {
                        if (res.userInfo) {
                            // 可以在这里获取当前玩家的个人信息，如头像、微信名等。
                            console.log('授权成功！');
                            _this.startbtn.active = true
                            // setTimeout(function () {
                            //     cc.director.loadScene("MainView");
                            //   }, 1000);
                        }
                        else {
                            console.log('授权失败！');
                        }
                        button.hide();
                        button.destroy();
                    });
                }
            }
        });
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
            let score = -1;
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
    start() {

    },

    // update (dt) {},
});
