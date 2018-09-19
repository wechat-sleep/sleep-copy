var n = getApp(), t = require("../../utils/util.js");

Page({
    data: {
        innerAdsList: [],
        isNightMode: !1
    },
    onLoad: function(n) {
        var t = wx.getStorageSync("innerAdsList");
        t && t.length > 0 && this.setData({
            innerAdsList: t
        });
        var e = wx.getStorageSync("isNightMode");
        this.setData({
            isNightMode: e
        });
    },
    onReady: function() {},
    openMiniApp: function(e) {
        var o = e.currentTarget.dataset.appdata, a = null;
        try {
            a = JSON.parse(o.recommend_link), console.log(a);
        } catch (n) {
            t.uploadError(n.message, "app内页推荐JSON解析错误");
        }
        a.success = function(t) {
            console.log(t);
            var e = JSON.stringify([ {
                func_type: 15,
                func_id: o.recommend_id,
                func_count: 1
            } ]), a = n.globalData.requestHeader;
            wx.request({
                url: n.globalData.baseUrl + "/miniapp/v1/statics/func",
                header: a,
                method: "POST",
                data: {
                    statics_data: e
                },
                success: function(n) {
                    console.log("统计提交:", n.data);
                }
            });
        }, a.fail = function(n) {
            console.log(n), t.uploadError(n.errMsg, "app内页推荐唤起失败"), wx.showToast({
                title: "打开“" + o.recommend_title + "”失败",
                icon: "none",
                duration: 2e3
            });
        }, wx.navigateToMiniProgram(a);
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});