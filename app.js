var aldstat = require("../sleep-copy/utils/ald-stat.js")
var o = require("../sleep-copy/utils/util.js"), n = require("../sleep-copy/utils/config-sleep.js");

App({
    onLaunch: function() {
        o.getUserToken(function(o) {
            console.log("app.js获取成功:" + o);
        });
    },
    getUserInfo: function(o) {
        var n = this;
        this.globalData.userInfo ? "function" == typeof o && o(this.globalData.userInfo) : wx.login({
            success: function() {
                wx.getUserInfo({
                    success: function(s) {
                        n.globalData.userInfo = s.userInfo, "function" == typeof o && o(n.globalData.userInfo);
                    }
                });
            }
        });
    },
    globalData: n
});
