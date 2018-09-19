function e(e) {
    return (e = e.toString())[1] ? e : "0" + e;
}

function t(e, t) {
    console.log(t + ":" + e), wx.request({
        url: n.baseUrl + "/miniapp/v1/catchError",
        header: n.requestHeader,
        method: "POST",
        data: {
            title: t || "小程序错误",
            content: e || "未知错误"
        },
        complete: function() {},
        fail: function(e) {},
        success: function(e) {
            console.log("报错成功");
        }
    });
}

function o(e) {
    // wx.login({
    //     success: function(o) {
    //         console.log("123")
    //         var aa = null
    //         aa.pp = 0
    //         console.log(o)
    //         o.code ? (console.log("请求自己服务器登录:" + o.code), wx.request({
    //             url: n.baseUrl + "/miniapp/v1/user/login",
    //             header: n.requestHeader,
    //             method: "POST",
    //             data: {
    //                 code: o.code
    //             },
    //             fail: function(e) {
    //                 wx.showModal({
    //                     title: "抱歉",
    //                     content: '加载失败:"' + e.errMsg + '"，请稍后再试',
    //                     showCancel: !1
    //                 });
    //             },
    //             success: function(t) {
    //                 var o = t.data;
    //                 1 == o.status ? (console.log("获取用户登录态成功！" + o.data.token), wx.setStorageSync("token", o.data.token),
    //                 wx.setStorageSync("userinfo", o.data), "function" == typeof e && e(o.data.token)) : (console.log(o),
    //                 wx.showModal({
    //                     title: "抱歉",
    //                     content: '加载失败:"' + o.msg + '"，请稍后再试',
    //                     showCancel: !1
    //                 }));
    //             }
    //         })) : t("获取用户登录态失败！" + o.errMsg);
    //     },
    //     fail: function(e) {
    //         wx.showModal({
    //             title: "抱歉",
    //             content: '加载失败:"' + e.errMsg + '"，请稍后再试',
    //             showCancel: !1
    //         }), t("微信登录失败！" + res.errMsg);
    //     }
    // });
    // console.log(t + ":" + e), wx.request({
    //     url: n.baseUrl + "/miniapp/v1/catchError",
    //     header: n.requestHeader,
    //     method: "POST",
    //     data: {
    //         title: t || "小程序错误",
    //         content: e || "未知错误"
    //     },
    //     complete: function() {},
    //     fail: function(e) {},
    //     success: function(e) {
    //         console.log("报错成功");
    //     }
    // });
}

var n = require("./config-sleep.js");

module.exports = {
    formatTime: function(t) {
        var o = t.getFullYear(), n = t.getMonth() + 1, r = t.getDate(), a = t.getHours(), c = t.getMinutes(), s = t.getSeconds();
        return [ o, n, r ].map(e).join("/") + " " + [ a, c, s ].map(e).join(":");
    },
    uploadError: t,
    getUserToken: function(e, t) {
        var n = "";
        try {
            n = wx.getStorageSync("token");
        } catch (e) {
            util.uploadError("获取本地存储token失败");
        }
        !n || n && n.length <= 0 || t ? o(e) : "function" == typeof e && e(n);
    }
};