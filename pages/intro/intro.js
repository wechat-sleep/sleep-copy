Page({
    data: {
        anim_gotoApp: {},
        swpNum: 0
    },
    onLoad: function(t) {},
    onReady: function() {
        wx.setStorageSync("lastIntroVer", getApp().globalData.introVer);
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    swpPageChange: function(t) {
        this.setData({
            swpNum: t.detail.current
        });
    },
    nextPage: function() {
        var t = this.data.swpNum + 1;
        t > 1 ? this.goToApp() : this.setData({
            swpNum: t
        });
    },
    prePage: function() {
        var t = this.data.swpNum - 1;
        this.setData({
            swpNum: t <= 0 ? 0 : t
        });
    },
    goToApp: function() {
        this.animGotoApp = wx.createAnimation({
            duration: 2e3,
            timingFunction: "ease"
        }), this.animGotoApp.scale(1.5).opacity(0).step({
            duration: 2e3
        }), this.setData({
            anim_gotoApp: this.animGotoApp.export()
        }), setTimeout(function() {
            wx.redirectTo({
                url: "/pages/main/main"
            });
        }, 1500);
    }
});