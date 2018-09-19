Page({
    data: {
        channel: "Default"
    },
    onLoad: function(n) {
        try {
            n.channel && n.channel.length > 0 && (this.setData({
                channel: n.channel
            }), wx.setStorageSync("channel", n.channel));
        } catch (n) {
            util.uploadError("渠道获取异常，权叔快去告诉花神");
        }
    },
    onReady: function() {
        setTimeout(function() {
            wx.redirectTo({
                url: "/pages/main/main"
            });
        }, 2e3);
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});