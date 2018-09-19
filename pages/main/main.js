var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, i = require("../../utils/util.js"), e = getApp(), a = require("./recommend-data.js").recommend_data;

Page({
    data: {
        pannelHeight: 0,
        listHeight: 0,
        topViewHeight: 0,
        scrollTop: 0,
        diamondPaddingV: 0,
        isShowZZZ: !1,
        isNightMode: !1,
        isBigFont: !1,
        isPlaying: !1,
        currentMusicIdx: -1,
        musicUrlList: {},
        musicList: [],
        musicNewDict: {},
        noPlayOne: !0,
        img_control: "stop.png",
        anim_control: {},
        anim_sel: [],
        bg_color: "#fff",
        miniapp_audit: 0,
        local_audit: 0,
        timeArrowAnimStyle: "",
        showingTimeingPannel: !1,
        timeControlOffset: 176,
        timeControlBaseOffset: 76,
        animTimeControlSpot: {},
        anim_timeingPannel: {},
        anim_musicListPannel: {},
        anim_timeingContainer: {},
        anim_musicListScroll: {},
        timeingTipsText: "",
        remainTimeText: "10:00",
        isShowTips: !1,
        anim_playTips: {},
        anim_playTipsOverlay: {},
        hasNewUpdateIntro: !1,
        hasUpdateIntro: !1,
        isShowUpdateIntro: !1,
        updateNewIntroText: "",
        updateIntroText: "",
        anim_updateIntro: {},
        anim_updateIntroOverlay: {},
        isShowAiVoiceBottomTips: !1,
        isShowAiVoiceIntro: !1,
        isShowRecordPannel: !1,
        isVoiceRecording: !1,
        isVoiceRecordCountLast: !1,
        willToRecord: !1,
        voiceRecordCountLast: 3,
        isRecognising: !1,
        anim_AiVoiceIntro: {},
        anim_AiVoiceIntroOverlay: {},
        anim_AiVoiceBottomTips: {},
        anim_AiVoiceShowRecordPannel: {},
        isShowUpExtend: !1,
        anim_extendPannel: {},
        anim_extendPannelBtn: {},
        rankListHeight: 400,
        isShowRankView: !1,
        anim_IntroView: {},
        rank1: null,
        rank2: null,
        rank3: null,
        currentRankList: [],
        currentRankData: {},
        currentRankType: "",
        isShowRecommendView: !1,
        anim_RecommendView: {},
        recommendList: [],
        currentRecomendIdx: -1,
        currentRecomendMusic: {},
        recommendRemainTimeText: "30:00",
        recommendPassPercent: 0,
        adsList: [],
        showTopTipFlag: !1,
        topTipText: "",
        statisticsData: {},
        channel: "Default",
    },
    onShareAppMessage: function() {
        return {
            title: "细雨春风，伴你入眠",
            desc: "给你一个婴儿般的好睡眠",
            path: "pages/main/main" + (this.data.currentMusicIdx > -1 ? "?mid=" + this.data.currentMusic.id : "")
        };
    },
    onLoad: function(t) {
        wx.clearStorage();
        this.getMusicData();
        var n = this;
        this.animationControl = null, this.animationSel = [], this.bindMusicStatus(), this.hexColorDict = {
            "bg-blue": "#3fa8f4",
            "bg-red": "#ff7b5c",
            "bg-green": "#3dc48d",
            "bg-dark-blue": "#065784",
            "bg-pink": "#ed9ae6",
            "bg-purple": "#3B3354"
        };
        var o = 0;
        try {
            var s = wx.getSystemInfoSync(), r = s.windowWidth;
            this.winWidth = r;
            var c = s.windowHeight;
            this.platform = s.platform, this.system = s.system, console.log(this.platform), 
            o = Math.floor(c - (r / 750 * 410 + 24)) - 1;
        } catch (t) {
            console.log("获取系统信息失败"), i.uploadError("获取系统信息失败");
        }
        var u = Math.floor(o - r / 750 * 200) - 1;
        this.music_pannel_height = o, this.music_list_height = u;
        var m = (1080 - (105e3 / this.winWidth + 402) - 230) / 3, d = Math.floor(c - r / 750 * 437) - 1, l = !1;
        try {
            l = wx.getStorageSync("isOpenedTimeTipsAnim"), this.isOpenedTimeTipsAnim = l;
        } catch (t) {
            console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
        }
        var h = wx.getStorageSync("isNightMode");
        h = !!h;
        var g = wx.getStorageSync("isBigFont"), p = {
            pannelHeight: o,
            listHeight: u,
            diamondPaddingV: m,
            rankListHeight: d,
            isNightMode: h,
            isBigFont: g = !!g,
            local_audit: e.globalData.auditVer,
            timeArrowAnimStyle: l ? "" : "arrow_down 1.5s ease 1.5s infinite alternate",
            anim_sel: [],
            recommendList: a
        };
        this.setData(p);
        this.setData({
            timeControlOffset: 376
        }), this.resetTime(3), this.hidePlayTips(), this.hideUpdateIntro(), this.hideRankView(), 
        this.hideRecommendView(), this.hideAiVoiceIntro(), this.hideRecordPannel(), this.getMusicUrl(function(e, a) {
            n.startMusicStatistics();
            try {
                var o = wx.getStorageSync("lastMusicIdx");
                t.mid && (o = n.findMusicIdxWithMid(t.mid));
            } catch (t) {
                console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
            }
            (!o || o < 0 || o >= a.length) && (o = 0, wx.setStorageSync("lastMusicIdx", o));
            try {
                var s = a[o];
                s.ad_id && (s = a[0]), t.mid && wx.reportAnalytics("share_music_income", {
                    music_id: s.id,
                    music_name: s.musicdesc
                });
            } catch (t) {
                console.log("音乐获取异常"), i.uploadError("音乐获取异常");
            }
            var r = {
                currentMusic: s,
                currentMusicIdx: o,
                anim_sel: [],
            };
            n.setData(r), n.changeBg(), t.mid && n.playMusicInIdx(o), setTimeout(function() {
                var t = !0;
                try {
                    t = wx.getStorageSync("hasAiVoiceIntro"), t = 1 === parseInt(t);
                } catch (t) {
                    console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
                }
                t || (wx.setStorageSync("hasAiVoiceIntro", 1), n.setData({
                    isShowAiVoiceBottomTips: !0
                }), n.showAiVoiceIntro());
            }, 1e3), n.getUpdateIntro();
            var c = wx.getStorageSync("channel");
            c && c.length > 0 && n.setData({
                channel: c
            });
        }, !0);
    },
    onReady: function() {
        if (this.data.currentMusicIdx > -1) {
            var t = Math.floor(this.data.currentMusicIdx / 4), i = this.winWidth / 750 * 187 * t;
            this.setData({
                scrollTop: i
            });
        }
    },
    onShow: function() {
        var t = this;
        if (this.hidePageTime > 0) if (this.data.isShowRecommendView) {
            var i = this.hidePageRecommendRemainSec - (new Date().getTime() - this.hidePageTime) / 1e3;
            this.recommendRemainSec = i <= 0 ? 0 : Math.floor(i);
        } else {
            var e = this.hidePageRemainSec - (new Date().getTime() - this.hidePageTime) / 1e3;
            this.remainSec = e <= 0 ? 0 : Math.floor(e);
        }
        this.hidePageTime = -1, wx.getBackgroundAudioPlayerState({
            fail: function(i) {
                console.log(i), t.setData({
                    isPlaying: !1
                }), (t.remainSec <= 0 || t.recommendRemainSec <= 0) && t.timeoutCallBack();
            },
            complete: function() {
                console.log("音乐状态查询完成");
            },
            success: function(i) {
                1 == i.status ? (t.setData({
                    isPlaying: !0
                }), t.startTimer()) : t.remainSec <= 0 || t.recommendRemainSec <= 0 ? t.timeoutCallBack() : t.setData({
                    isPlaying: !1
                });
            }
        });
        var a = new Date().getHours();
        (a <= 4 || a >= 22) && t.setData({
            isShowZZZ: !0
        });
    },
    onHide: function() {
        this.data.miniapp_audit < e.globalData.auditVer ? this.pauseMusic() : this.data.isPlaying && (this.hidePageTime = new Date().getTime(), 
        this.hidePageRemainSec = this.remainSec, this.hidePageRecommendRemainSec = this.recommendRemainSec), 
        wx.removeStorageSync("channel");
    },
    onUnload: function() {
        this.pauseMusic();
    },
    //获取音乐数据
    getMusicData: function(t, a) {
        var n = this;
        try {
            this.currentRankList = wx.getStorageSync("currentRankList"), this.setData({
                currentRankList: this.currentRankList
            });
        } catch (t) {
            console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
        }
        if (this.currentRankList && !a) return console.log(this.currentRankList),
            void (t && "function" == typeof t && t(this.currentRankList));
        wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 1e4
        });
        var o = e.globalData.requestHeader;
        wx.request({
            url: e.globalData.baseUrl + "/miniapp/v1/music/rank",
            header: o,
            complete: function() {
                wx.hideToast();
            },
            fail: function(t) {
                wx.showModal({
                    title: "抱歉",
                    content: '加载失败:"' + t.errMsg + '"，请稍后再试',
                    showCancel: !1
                });
            },
            success: function(e) {
                var a = e.data;
                1 == a.status ? (console.log(a.data), this.musicRankOriginData= a.data,this.musicRankOriginData= a.data.rank_week, wx.setStorageSync("musicRankOriginData", this.musicRankOriginData),wx.setStorageSync("currentRankList", this.currentRankList),
                    n.setData({
                        currentRankList: this.currentRankList,
                        musicRankOriginData:this.musicRankOriginData
                    }), t && "function" == typeof t && t(this.currentRankList)) : (wx.showModal({
                    title: "抱歉",
                    content: a.msg,
                    showCancel: !1
                }), 3 != a.status && 4 != a.status || i.getUserToken(function() {}, !0));
                this.musicList=n.setMusicListUrl(a.data.rank_total),wx.setStorageSync("musicList", this.musicList),
                    n.setData({
                        musicList: this.musicList,
                        currentMusic: this.musicList[0],
                        currentMusicIdx: this.musicList[0].id,
                        currentMusicUrl: this.musicList[0].musicUrl,
                    })
                // console.log(this.currentRankData)
            }
        });
    },
    //根据id获取相应音乐url
    //To Do
    setMusicListUrl:function (a) {
        console.log("执行"+a.length)
        var n = this;
        a.forEach(function (c,i,arr) {
            c.musicUrl = "https://huawei.psy-1.com/music/recommend/StableSleep-ARVzlTWKHFyTaiPIOSw1.mp3"
        })
        return a
    },
    startMusicStatistics: function() {
        var t = this;
        setInterval(function() {
            t.sendMusicStatistics();
        }, 1e4);
    },
    sendMusicStatistics: function() {
        var t = this, i = this.data.statisticsData, a = [];
        if (Object.keys(i).forEach(function(t) {
            a.push(i[t]);
        }), a.length > 0) {
            var n = JSON.stringify(a), o = e.globalData.requestHeader;
            wx.request({
                url: e.globalData.baseUrl + "/miniapp/v1/statics",
                header: o,
                method: "POST",
                data: {
                    statics_data: n
                },
                success: function(i) {
                    console.log("统计提交:", i.data), t.setData({
                        statisticsData: {}
                    });
                }
            });
        }
    },
    changeBg: function() {
        var t = "#3fa8f4";
        try {
            t = this.hexColorDict["bg-" + this.data.currentMusic.color_miniapp];
        } catch (t) {
            console.log("音乐获取出错"), i.uploadError("音乐获取出错");
        }
        this.setData({
            bg_color: t,
            bg_color_class: this.data.currentMusic.color_miniapp
        });
        console.log("changeBg")
    },
    selectMusic: function(t) {
        console.log("selectMusic")
        // console.log(this.data.musicList.length);
        try {
            var i = this.data.musicNewDict;
            i[t.currentTarget.dataset.musicId] && (i[t.currentTarget.dataset.musicId] = !1, 
            this.setData({
                musicNewDict: i
            }), wx.setStorageSync("musicNewDict", i));
        } catch (t) {
            console.log(t);
        }
        var e = t.currentTarget.dataset.idx;
        // console.log("获取相应的idx")
        // console.log(e)
        console.log(this.data.currentMusicIdx)
        this.data.currentMusicIdx == e ? this.togglePlay() : this.playMusicInIdx(e);
    },
    playMusicInIdx: function(t) {
        console.log("playMusicInIdx")
        this.data.noPlayOne = !1;
        var e = this;
        try {
            var a = this.data.musicList[t];
            // console.log(a)
        } catch (t) {
            console.log("音乐获取异常"), i.uploadError("音乐获取异常");
        }
        // console.log(a)
        if (a) {
            var n = {};
            n.currentMusic = a, n.currentMusicIdx = t, wx.setStorageSync("lastMusicIdx", t), 
            this.setData(n), this.changeBg(), wx.canIUse("getBackgroundAudioManager") ? wx.getBackgroundAudioManager().stop() : wx.stopBackgroundAudio(), 
            e.playCurrentMusic();
        } else wx.showModal({
            title: "抱歉",
            content: "该音乐异常，请先欣赏其他音乐或稍后再试",
            showCancel: !1
        });
    },
    pauseMusic: function() {
        wx.canIUse("getBackgroundAudioManager") ? wx.getBackgroundAudioManager().pause() : wx.pauseBackgroundAudio();
    },
    playNextMusic: function() {
        var t, i;
        if (this.data.isShowRecommendView) {
            var e = {
                currentTarget: {
                    dataset: {
                        idx: t = (t = this.data.currentRecomendIdx + 1) <= this.data.recommendList.length - 1 ? t : 0
                    }
                }
            };
            this.togglePlayRecommend(e);
        } else {
            t = this.data.currentMusicIdx;
            do {
                t = (t += 1) <= this.data.musicList.length - 1 ? t : 0, i = this.data.musicList[t];
            } while (!(i && i.musicurl && i.musicurl.length > 0));
            this.playMusicInIdx(t);
        }
    },
    playPreMusic: function() {
        var t, i;
        if (this.data.isShowRecommendView) {
            var e = {
                currentTarget: {
                    dataset: {
                        idx: t = (t = this.data.currentRecomendIdx - 1) >= 0 ? t : this.data.recommendList.length - 1
                    }
                }
            };
            this.togglePlayRecommend(e);
        } else {
            t = this.data.currentMusicIdx;
            do {
                t = (t -= 1) >= 0 ? t : this.data.musicList.length - 1, i = this.data.musicList[t];
            } while (!(i && i.musicurl && i.musicurl.length > 0));
            this.playMusicInIdx(t);
        }
    },
    playCurrentMusic: function() {
        console.log("playCurrentMusic+first")
        console.log(this.data.isShowRecommendView)
        var t = this;
        if (this.data.isShowRecommendView) {
            console.log("if");
            if (wx.canIUse("getBackgroundAudioManager")) {
                var e = wx.getBackgroundAudioManager();
                e.title = this.data.currentRecomendMusic.recommend_name, e.coverImgUrl = this.data.currentRecomendMusic.recommend_bg, 
                e.src = this.data.currentRecomendMusic.recommend_music, e.play();
            } else wx.playBackgroundAudio({
                dataUrl: this.data.currentRecomendMusic.recommend_music,
                title: this.data.currentRecomendMusic.recommend_name,
                coverImgUrl: this.data.currentRecomendMusic.recommend_bg
            });
        } else {
            this.data.noPlayOne = !1;
            this.data.isPlaying = !0;
            var e = this;
            console.log(this.data.currentMusicIdx)
            try {
                var a = this.data.musicList[this.data.currentMusicIdx];
            } catch (t) {
                console.log("音乐获取异常"), i.uploadError("音乐获取异常");
            }
            if (a) {
                var n = {};
                n.currentMusic = a, n.currentMusicId = t, n.isPlaying = !0,n.remainSec= 600,wx.setStorageSync("lastMusicIdx", t),
                    this.setData(n), wx.playBackgroundAudio({
                    dataUrl: a.musicUrl,
                    title: a.title,
                });
                e.startTimer();
            } else wx.showModal({
                title: "抱歉",
                content: "该音乐异常，请先欣赏其他音乐或稍后再试",
                showCancel: !1
            });
        }
        //     t.getMusicUrl(function(e) {
        //     console.log("playCurrentMusic+getMusicUrl")
        //     var a = "";
        //     try {
        //         a = t.musicUrlList["music" + t.data.currentMusic.id];
        //     } catch (t) {
        //         console.log("歌曲路径获取失败"), i.uploadError("歌曲路径获取失败");
        //     }
        //     if (t.data.musicList[t.data.currentMusicIdx].needPay) return console.log("需要付费2"),
        //     clearInterval(t.timer), void t.showPlayTips();
        //     t.platform.indexOf("android") >= 0 && (console.log("安卓强制开启倒计时"), t.setData({
        //         isPlaying: !0
        //     }), t.startTimer());
        //     var n = t.data.statisticsData, o = n[t.data.currentMusic.id];
        //     if (o || (o = {
        //         func_type: t.data.currentMusic.func_type,
        //         music_id: t.data.currentMusic.id,
        //         music_count: 0
        //     }), o.music_count += 1, n[t.data.currentMusic.id] = o, t.setData({
        //         statisticsData: n
        //     }), wx.canIUse("getBackgroundAudioManager")) {
        //         var s = wx.getBackgroundAudioManager();
        //         s.title = t.data.currentMusic.musicdesc, s.coverImgUrl = "https://res.psy-1.com/miniapp/xiaoshuimian_logo_screen.png",
        //         s.src = a, s.play();
        //     } else if (wx.canIUse("getBackgroundAudioManager")) {
        //         var r = wx.getBackgroundAudioManager();
        //         r.title = t.data.currentMusic.musicdesc, r.coverImgUrl = "https://res.psy-1.com/miniapp/xiaoshuimian_logo_screen.png",
        //         r.src = a, r.play();
        //     } else wx.playBackgroundAudio({
        //         dataUrl: a,
        //         title: t.data.currentMusic.musicdesc,
        //         coverImgUrl: "https://res.psy-1.com/miniapp/xiaoshuimian_logo_screen.png"
        //     });
        // });
    },
    bindMusicStatus: function() {
        var t = this;
        if (wx.canIUse("getBackgroundAudioManager")) {
            var i = wx.getBackgroundAudioManager();
            i.onPlay(function() {
                console.log("监听音乐播放"), t.setData({
                    isPlaying: !0
                }), t.startTimer();
            }), i.onPause(function() {
                console.log("监听音乐暂停"), t.setData({
                    isPlaying: !1
                }), t.hidePageTime = -1, t.data.isShowRecommendView ? clearInterval(t.recommendTimer) : clearInterval(t.timer);
            }), i.onStop(function() {
                console.log("监听音乐停止"), t.setData({
                    isPlaying: !1
                });
                var i = t.hidePageTime > 0 ? (new Date().getTime() - t.hidePageTime) / 1e3 : 0;
                t.remainSec <= 0 || t.recommendRemainSec <= 0 || t.hidePageRemainSec - i <= 0 || t.hidePageRecommendRemainSec - i <= 0 || t.playCurrentMusic();
            }), i.onEnded(function() {
                console.log("监听音乐停止"), t.setData({
                    isPlaying: !1
                });
                var i = t.hidePageTime > 0 ? (new Date().getTime() - t.hidePageTime) / 1e3 : 0;
                t.remainSec <= 0 || t.recommendRemainSec <= 0 || t.hidePageRemainSec - i <= 0 || t.hidePageRecommendRemainSec - i <= 0 || t.playCurrentMusic();
            }), i.onTimeUpdate(function() {}), i.onWaiting(function() {}), i.onCanplay(function() {}), 
            i.onPrev(function() {
                console.log("上一首", new Date()), t.playPreMusic();
            }), i.onNext(function() {
                console.log("下一首", new Date()), t.playNextMusic();
            }), i.onError(function(t) {
                var i = t.errMsg;
                i = 1 == t.playerErrCode || 2 == t.playerErrCode || 3 == t.playerErrCode || 4 == t.playerErrCode || 5 == t.playerErrCode ? "这首歌还没准备好" : (6 == t.playerErrCode || 7 == t.playerErrCode || 8 == t.playerErrCode || t.playerErrCode, 
                "这首歌下载失败了"), wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: i,
                    success: function(t) {
                        t.confirm;
                    }
                });
            });
        } else wx.onBackgroundAudioPlay(function() {
            console.log("监听音乐播放"), t.setData({
                isPlaying: !0
            }), t.startTimer();
        }), wx.onBackgroundAudioPause(function() {
            console.log("监听音乐暂停"), t.setData({
                isPlaying: !1
            }), t.hidePageTime = -1, t.data.isShowRecommendView ? clearInterval(t.recommendTimer) : clearInterval(t.timer);
        }), wx.onBackgroundAudioStop(function() {
            console.log("监听音乐停止"), t.setData({
                isPlaying: !1
            });
            var i = t.hidePageTime > 0 ? (new Date().getTime() - t.hidePageTime) / 1e3 : 0;
            t.remainSec <= 0 || t.recommendRemainSec <= 0 || t.hidePageRemainSec - i <= 0 || t.hidePageRecommendRemainSec - i <= 0 || t.playCurrentMusic();
        });
    },
    togglePlay: function() {
        console.log("togglePlay")
        var t = this;
        this.getMusicUrl(function(i) {
            if (t.data.musicList[t.data.currentMusicIdx].needPay) console.log("需要付费"), t.showPlayTips(); else {
                if (t.data.showingTimeingPannel && t.data.isPlaying) return void t.hideTimeingPannel();
                var e = !t.data.isPlaying;
                e ? (t.playCurrentMusic(), t.data.showingTimeingPannel && t.hideTimeingPannel()) : t.pauseMusic(), 
                t.animationControl = wx.createAnimation({
                    duration: 300,
                    timingFunction: "ease"
                }), t.animationControl.scale(1.2, 1.2).opacity(.1).step(), t.setData({
                    anim_control: t.animationControl.export()
                }), setTimeout(function() {
                    t.animationControl.scale(1).opacity(1).step({
                        duration: 300
                    }), t.setData({
                        anim_control: t.animationControl.export(),
                        isPlaying: e
                    });
                }, 300);
            }
        });
    },
    flagMusicIsPay: function() {
        var t = this, a = this.data.musicList;
        a.length <= 0 || (a.forEach(function(e, a, n) {
            var o = "";
            try {
                o = t.musicUrlList["music" + e.id];
            } catch (t) {
                console.log("歌曲路径获取失败"), i.uploadError("歌曲路径获取失败");
            }
            !o || e.needcoin && o.length <= 0 ? e.needPay = !0 : e.needPay = !1;
        }), this.data.miniapp_audit < e.globalData.auditVer && (a = a.filter(function(t) {
            return !t.needPay;
        })), this.musicList = a, this.setData({
            musicList: a
        }));
    },
    getMusicUrl: function(n, o) {
        console.log("getMusicUrl")
        var s = this, r = 0;
        try {
            console.log("try")
            if (!this.musicUrlList || !this.musicList) {
                console.log(true)
                //this.musicUrlList = wx.getStorageSync("musicUrlList"), this.musicList = wx.getStorageSync("musicList");
                this.musicUrlList = wx.getStorageSync("musicList"), this.musicList = wx.getStorageSync("musicList");
                var c = wx.getStorageSync("musicNewDict"), u = wx.getStorageSync("miniapp_audit"), m = wx.getStorageSync("recommendList"), d = wx.getStorageSync("adsList");
                m = m && m.length > 0 ? m : a, this.setData({
                    miniapp_audit: u || 0,
                    musicUrlList: this.musicUrlList,
                    musicList: this.musicList,
                    musicNewDict: c,
                    recommendList: m,
                    adsList: d
                }), this.flagMusicIsPay();
            }
            r = wx.getStorageSync("musicUrlListTime");
            // console.log(wx.getStorageSync(s.musicUrlList))
        } catch (t) {
            console.log("获取本地存储失败"), i.uploadError("获取本地存储失败"), r = 0;
        }
        if (this.musicUrlList && this.musicList && (new Date() - r) / 1e3 < 3600 && !o) return this.flagMusicIsPay(),
            void (n && "function" == typeof n && n(this.musicUrlList, this.musicList));
        wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 1e3
        });
        var h = wx.getStorageSync("musicList")
        if (h.length > 0 && this.data.currentMusicIdx > -1){
            s.setData({
                musicList: h,
                musicUrlList: h
            })
        } else {
            wx.showModal({
                title: "抱歉",
                content: o.msg,
                showCancel: !1
             })
        }
        //     i.getUserToken(function(o) {
        //     var r = e.globalData.requestHeader;
        //     r.token = o, wx.request({
        //         url: e.globalData.baseUrl + "/miniapp/v1/music/simpleDetail",
        //         header: r,
        //         complete: function() {
        //             wx.hideToast();
        //         },
        //         fail: function(t) {
        //             wx.showModal({
        //                 title: "抱歉",
        //                 content: '加载失败:"' + t.errMsg + '"，请稍后再试',
        //                 showCancel: !1
        //             });
        //         },
        //         success: function(e) {
        //             var o = e.data;
        //             if (1 == o.status) {
        //                 for (var r = {}, c = 0; c < o.data.music_list.length; c++) {
        //                     var u = o.data.music_list[c];
        //                     u.resdesc && u.resdesc.length > 0 && (u.resdesc = u.resdesc.replace(/(,|，)/g, "\n")),
        //                         r["music" + u.id] = u.musicurl;
        //                 }
        //                 var m = {}, d = (wx.getStorageSync("musicList"), wx.getStorageSync("musicNewDict"));
        //                 "object" == (void 0 === d ? "undefined" : t(d)) ? o.data.music_list.forEach(function(t, i, e) {
        //                     m[t.id] = !0;
        //                 }) : (o.data.music_list.forEach(function(t, i, e) {
        //                     m[t.id] = !1;
        //                 }), d = {}), Object.assign(m, d);
        //                 var l = s.arrangeTopMusic(o.data.music_list || [], o.data.music_stream_ad || [], o.data.resource_recommend || []);
        //                 wx.setStorageSync("musicUrlListTime", new Date()), wx.setStorageSync("musicUrlList", r),
        //                     wx.setStorageSync("musicList", l), wx.setStorageSync("musicNewDict", m), wx.setStorageSync("miniapp_audit", o.data.miniapp_audit),
        //                     wx.setStorageSync("recommendList", o.data.recommend_list), wx.setStorageSync("adsList", o.data.music_stream_ad || []),
        //                     wx.setStorageSync("innerAdsList", o.data.resource_recommend || []);
        //                 var h = o.data.recommend_list;
        //                 h = h && h.length > 0 ? h : a, s.musicUrlList = r, s.musicList = l, s.setData({
        //                     miniapp_audit: o.data.miniapp_audit || 0,
        //                     musicUrlList: s.musicUrlList,
        //                     musicList: l,
        //                     musicNewDict: m,
        //                     recommendList: h,
        //                     adsList: o.data.music_stream_ad || []
        //                 }), s.flagMusicIsPay(), n && "function" == typeof n && n(s.musicUrlList, s.musicList);
        //             } else wx.showModal({
        //                 title: "抱歉",
        //                 content: o.msg,
        //                 showCancel: !1
        //             }), 3 != o.status && 4 != o.status || i.getUserToken(function() {}, !0);
        //         }
        //
        //
        //     });
        // });
        // wx.request({
        //     url: e.globalData.baseUrl + "/miniapp/v1/music/rank",
        //     header: o,
        //     complete: function() {
        //         wx.hideToast();
        //     },
        //     fail: function(t) {
        //         wx.showModal({
        //             title: "抱歉",
        //             content: '加载失败:"' + t.errMsg + '"，请稍后再试',
        //             showCancel: !1
        //         });
        //     },
        //     success: function(e) {
        //         var a = e.data;
        //         1 == a.status ? (console.log(a), n.musicRankOriginData = a.data, wx.setStorageSync("musicRankOriginData", n.musicRankOriginData),
        //             n.setData({
        //                 musicRankOriginData: n.musicRankOriginData
        //             }), t && "function" == typeof t && t(n.musicRankOriginData)) : (wx.showModal({
        //             title: "抱歉",
        //             content: a.msg,
        //             showCancel: !1
        //         }), 3 != a.status && 4 != a.status || i.getUserToken(function() {}, !0));
        //         console.log("test")
        //         console.log(e.data)
        //     }
        // });
    },
    //根据id获取相应音乐url
    //To Do
    setMusicListUrl:function (a) {
        console.log("执行"+a.length)
        var n = this;
        a.forEach(function (c,i,arr) {
            c.musicUrl = "https://huawei.psy-1.com/music/recommend/StableSleep-ARVzlTWKHFyTaiPIOSw1.mp3"
        })
        return a
    },
    showTimeingPannel: function() {
        this.isOpenedTimeTipsAnim || wx.setStorageSync("isOpenedTimeTipsAnim", !0);
        this.anim_timeingPannel = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_timeingPannel.opacity(1).step({
            duration: 1e3
        }), this.anim_timeingContainer = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_timeingContainer.opacity(0).step({
            duration: 1e3
        }), this.anim_musicListPannel = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_musicListPannel.height(750 * this.music_pannel_height / this.winWidth - 180 + "rpx").step({
            duration: 1e3
        }), this.anim_musicListScroll = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_musicListScroll.height(750 * this.music_list_height / this.winWidth - 180 + "rpx").step({
            duration: 1e3
        }), this.setData({
            timeArrowAnimStyle: "",
            showingTimeingPannel: !0,
            anim_timeingPannel: this.anim_timeingPannel.export(),
            anim_musicListPannel: this.anim_musicListPannel.export(),
            anim_timeingContainer: this.anim_timeingContainer.export(),
            anim_musicListScroll: this.anim_musicListScroll.export()
        });
    },
    hideTimeingPannel: function() {
        this.anim_timeingPannel = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_timeingPannel.opacity(0).step({
            duration: 1e3
        }), this.anim_timeingContainer = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_timeingContainer.opacity(.8).step({
            duration: 1e3
        }), this.anim_musicListPannel = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_musicListPannel.height(this.music_pannel_height).step({
            duration: 1e3
        }), this.anim_musicListScroll = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        }), this.anim_musicListScroll.height(this.music_list_height).step({
            duration: 1e3
        }), this.setData({
            showingTimeingPannel: !1,
            anim_timeingPannel: this.anim_timeingPannel.export(),
            anim_musicListPannel: this.anim_musicListPannel.export(),
            anim_timeingContainer: this.anim_timeingContainer.export(),
            anim_musicListScroll: this.anim_musicListScroll.export()
        });
    },
    toggleTimeingPannel: function() {
        this.data.showingTimeingPannel ? this.hideTimeingPannel() : this.showTimeingPannel();
    },
    timeTouchStart: function(t) {
        this.animTimeControlSpot = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.animTimeControlSpot.opacity(1).step({
            duration: 0
        }), this.setData({
            animTimeControlSpot: this.animTimeControlSpot.export()
        }), this.originTimeOffest = this.data.timeControlOffset, this.touchX = t.changedTouches[0].clientX;
    },
    timeTouchMove: function(t) {
        var i = 750 * (t.changedTouches[0].clientX - this.touchX) / this.winWidth, e = this.originTimeOffest + i;
        e = (e = e > 600 + this.data.timeControlBaseOffset ? 600 + this.data.timeControlBaseOffset : e) < this.data.timeControlBaseOffset ? this.data.timeControlBaseOffset : e, 
        this.setData({
            timeControlOffset: e
        });
    },
    timeTouchCancel: function(t) {
        this.setData({
            timeControlOffset: this.originTimeOffest
        });
    },
    timeTouchEnd: function(t) {
        this.handleLastTimePosition(t);
    },
    handleLastTimePosition: function(t) {
        var i = this, e = this.originTimeOffest + 750 * (t.changedTouches[0].clientX - this.touchX) / this.winWidth - this.data.timeControlBaseOffset, a = Math.floor(e / 100), n = (a = a >= 0 ? a : 0) + (e / 100 * 100 % 100 / 100 >= .5 ? 1 : 0), o = 100 * (n = n > 5 ? 5 : n) + this.data.timeControlBaseOffset;
        this.animTimeControlSpot = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), this.animTimeControlSpot.left(o + "rpx").step({
            duration: 500
        }), this.setData({
            animTimeControlSpot: this.animTimeControlSpot.export()
        }), setTimeout(function() {
            i.setData({
                timeControlOffset: o
            });
        }, 600), this.resetTime(n);
    },
    manualSelTimeType: function(t) {
        var i = this, e = t.currentTarget.dataset.tmtype;
        if (console.log(e), console.log(this.timeType), this.timeType != e) {
            var a = 100 * e + this.data.timeControlBaseOffset;
            this.animTimeControlSpot = wx.createAnimation({
                duration: 500,
                timingFunction: "ease"
            }), this.animTimeControlSpot.left(a + "rpx").step({
                duration: 500
            }), this.setData({
                animTimeControlSpot: this.animTimeControlSpot.export()
            }), setTimeout(function() {
                i.setData({
                    timeControlOffset: a
                });
            }, 600), this.resetTime(e);
        }
    },
    resetTime: function(t) {
        this.timeType = t, this.remainSec = 0;
        var i = [ 5, 10, 15, 30, 60, 999999 ][t], e = "";
        e = i >= 9999 ? "循环播放" : i + "分钟定时关闭", this.setData({
            timeingTipsText: e,
            remainTimeText: i >= 9999 ? "∞" : ((i + "").length > 1 ? i : "0" + i) + ":00"
        }), this.remainSec = 60 * i, this.data.isPlaying && this.startTimer();
    },
    startTimer: function() {
        var t = this;
        if (this.data.isShowRecommendView) clearInterval(this.recommendTimer), this.recommendTimer = setInterval(function() {
            if (t.recommendRemainSec > 0 && t.data.isPlaying) {
                t.recommendRemainSec -= 1;
                var i = Math.floor(t.recommendRemainSec / 60) + "";
                i = i.length > 1 ? i : "0" + i;
                var e = t.recommendRemainSec % 60 + "";
                e = e.length > 1 ? e : "0" + e;
                var a = 100 * (1 - t.recommendRemainSec / 1800);
                t.setData({
                    recommendRemainTimeText: i + ":" + e,
                    recommendPassPercent: a
                });
            } else t.recommendRemainSec <= 0 && t.timeoutCallBack();
        }, 1e3); else {
            if (clearInterval(this.timer), this.remainSec >= 599940) return void console.log("无限循环，不触发定时");
            this.timer = setInterval(function() {
                if (t.remainSec > 0 && t.data.isPlaying) {
                    t.remainSec -= 1;
                    var i = Math.floor(t.remainSec / 60) + "";
                    i = i.length > 1 ? i : "0" + i;
                    var e = t.remainSec % 60 + "";
                    e = e.length > 1 ? e : "0" + e, t.setData({
                        remainTimeText: i + ":" + e
                    });
                } else t.remainSec <= 0 && t.timeoutCallBack();
            }, 1e3);
        }
    },
    timeoutCallBack: function() {
        if (console.log("重置定时"), this.pauseMusic(), this.data.isShowRecommendView) this.recommendRemainSec = 1800, 
        this.setData({
            isPlaying: !1,
            remainTimeText: "30:00"
        }); else {
            var t = isNaN(this.timeType) ? 1 : this.timeType;
            this.resetTime(t), this.setData({
                isPlaying: !1,
                timeControlOffset: 100 * t + this.data.timeControlBaseOffset
            });
        }
    },
    showUpPlayTips: function() {
        var t = this;
        this.setData({
            isShowTips: !0
        }), setTimeout(function() {
            t.anim_playTips = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_playTips.translateY(0).opacity(1).step({
                duration: 800
            }), t.anim_playTipsOverlay = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_playTipsOverlay.opacity(1).step({
                duration: 800
            }), t.setData({
                anim_playTips: t.anim_playTips.export(),
                anim_playTipsOverlay: t.anim_playTipsOverlay.export()
            });
        }, 100);
    },
    showPlayTips: function() {
        var t = this, a = t.data.musicList[t.data.currentMusicIdx];
        a.needPay ? (wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 1e4
        }), i.getUserToken(function(n) {
            var o = e.globalData.requestHeader;
            o.token = n, wx.request({
                url: e.globalData.baseUrl + "/miniapp/v1/pay/payReady",
                header: o,
                data: {
                    func_mid: a.func_mid,
                    func_sid: a.id
                },
                complete: function() {
                    wx.hideToast();
                },
                fail: function(t) {
                    wx.showModal({
                        title: "抱歉",
                        content: '加载失败:"' + t.errMsg + '"，请稍后再试',
                        showCancel: !1
                    });
                },
                success: function(e) {
                    var a = e.data;
                    console.log(e), 1 == a.status ? (console.log(a), 1 == a.data.order.status ? t.getMusicUrl(function(i) {
                        t.playCurrentMusic();
                    }, !0) : (t.setData({
                        "currentMusic.price": a.data.price.price
                    }), t.showUpPlayTips())) : (wx.showModal({
                        title: "抱歉",
                        content: a.msg,
                        showCancel: !1
                    }), 3 != a.status && 4 != a.status || i.getUserToken(function() {}, !0));
                }
            });
        })) : this.showUpPlayTips();
    },
    hidePlayTips: function() {
        this.anim_playTips = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.anim_playTips.translateY(50).opacity(0).step({
            duration: 0
        }), this.anim_playTipsOverlay = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.anim_playTipsOverlay.opacity(0).step({
            duration: 0
        }), this.setData({
            isShowTips: !1,
            anim_playTips: this.anim_playTips.export(),
            anim_playTipsOverlay: this.anim_playTipsOverlay.export()
        });
    },
    showUpdateIntro: function() {
        this.hidePlayTips();
        var t = this;
        this.setData({
            isShowUpdateIntro: !0
        }), setTimeout(function() {
            t.anim_updateIntro = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_updateIntro.translateY(0).opacity(1).step({
                duration: 800
            }), t.anim_updateIntroOverlay = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_updateIntroOverlay.opacity(1).step({
                duration: 800
            }), t.setData({
                anim_updateIntro: t.anim_updateIntro.export(),
                anim_updateIntroOverlay: t.anim_updateIntroOverlay.export()
            });
        }, 100);
    },
    hideUpdateIntro: function() {
        this.anim_updateIntro = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.anim_updateIntro.translateY(50).opacity(0).step({
            duration: 0
        }), this.anim_updateIntroOverlay = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.anim_updateIntroOverlay.opacity(0).step({
            duration: 0
        }), this.setData({
            hasNewUpdateIntro: !1,
            isShowUpdateIntro: !1,
            anim_updateIntro: this.anim_updateIntro.export(),
            anim_updateIntroOverlay: this.anim_updateIntroOverlay.export()
        });
    },
    findMusicIdxWithMid: function(t) {
        for (var i = 0; i < this.data.musicList.length; i++) if (this.data.musicList[i].id == t) return i;
        return -1;
    },
    iWantYou: function(t) {
        if (!this.paying) {
            var a = this, n = t.currentTarget.dataset.music;
            this.musicUrlList["music" + n.id] && this.musicUrlList["music" + n.id].length > 0 ? console.log("已经有了啊") : (this.paying = !0, 
            wx.showToast({
                title: "加载中",
                icon: "loading",
                duration: 1e4
            }), i.getUserToken(function(t) {
                var o = e.globalData.requestHeader;
                o.token = t, wx.request({
                    url: e.globalData.baseUrl + "/miniapp/v1/pay/payReady",
                    header: o,
                    data: {
                        func_mid: n.func_mid,
                        func_sid: n.id
                    },
                    complete: function() {
                        wx.hideToast(), a.paying = !1;
                    },
                    fail: function(t) {
                        wx.showModal({
                            title: "抱歉",
                            content: '加载失败:"' + t.errMsg + '"，请稍后再试',
                            showCancel: !1
                        });
                    },
                    success: function(t) {
                        var e = t.data;
                        console.log(t), 1 == e.status ? (console.log(e), 1 == e.data.order.status ? a.getMusicUrl(function(t) {
                            a.hidePlayTips(), a.playCurrentMusic();
                        }, !0) : (a.setData({
                            "currentMusic.price": e.data.price.price
                        }), a.payForLove(e.data.pay_para))) : (wx.showModal({
                            title: "抱歉",
                            content: e.msg,
                            showCancel: !1
                        }), 3 != e.status && 4 != e.status || i.getUserToken(function() {}, !0));
                    }
                });
            }));
        }
    },
    payForLove: function(t) {
        var i = this;
        t.success = function(t) {
            console.log(t), i.getMusicUrl(function(t) {
                i.hidePlayTips(), i.playCurrentMusic();
            }, !0);
        }, t.fail = function(t) {
            console.log(t);
        }, wx.requestPayment(t);
    },
    getUpdateIntro: function() {
        var t = this;
        wx.request({
            url: e.globalData.baseUrl + "/miniapp/v1/notification",
            header: e.globalData.requestHeader,
            fail: function(t) {
                i.uploadError("获取更新信息失败");
            },
            success: function(a) {
                var n = a.data;
                if (1 == n.status) {
                    t.setData({
                        hasUpdateIntro: !0,
                        updateIntroText: n.data.value
                    });
                    var o;
                    try {
                        o = wx.getStorageSync("updateIntro");
                    } catch (t) {
                        console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
                    }
                    (!o || o.miniapp_update_version < n.data.miniapp_update_version) && (t.setData({
                        hasNewUpdateIntro: !0,
                        updateNewIntroText: n.data.miniapp_update
                    }), t.data.miniapp_audit >= e.globalData.auditVer && t.showUpdateIntro()), wx.setStorageSync("updateIntro", n.data);
                }
            }
        });
    },
    openExtendPannel: function() {
        var t = this;
        this.setData({
            isShowUpExtend: !0
        }), setTimeout(function() {
            t.anim_extendPannel = wx.createAnimation({
                duration: 400,
                timingFunction: "ease"
            }), t.anim_extendPannel.translateY(0).opacity(1).step({
                duration: 400
            }), t.anim_extendPannelBtn = wx.createAnimation({
                duration: 400,
                timingFunction: "ease"
            }), t.anim_extendPannelBtn.opacity(0).step({
                duration: 400
            }), t.setData({
                anim_extendPannel: t.anim_extendPannel.export(),
                anim_extendPannelBtn: t.anim_extendPannelBtn.export()
            });
        }, 100);
    },
    hideExtendPannel: function() {
        var t = this;
        t.anim_extendPannel = wx.createAnimation({
            duration: 400,
            timingFunction: "ease"
        }), t.anim_extendPannel.translateY(50).opacity(0).step({
            duration: 400
        }), t.anim_extendPannelBtn = wx.createAnimation({
            duration: 400,
            timingFunction: "ease"
        }), t.anim_extendPannelBtn.opacity(1).step({
            duration: 400
        }), t.setData({
            anim_extendPannel: t.anim_extendPannel.export(),
            anim_extendPannelBtn: t.anim_extendPannelBtn.export()
        }), setTimeout(function() {
            t.setData({
                isShowUpExtend: !1
            });
        }, 500);
    },
    topMusic: function() {
        try {
            var t = wx.getStorageSync("topArray") || [], e = wx.getStorageSync("topMusicArray") || [];
        } catch (t) {
            console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
        }
        var a = this.data.musicList[this.data.currentMusicIdx], n = a.id;
        (e = e.filter(function(t) {
            return t.id != n;
        })).unshift(a), wx.setStorageSync("topMusicArray", e), t = [];
        for (var o = 0; o < e.length; o++) t.push(e[o].id);
        wx.setStorageSync("topArray", t), wx.setStorageSync("topMusicArray", e);
        var s = this.arrangeTopMusic();
        this.musicList = s;
        0 == this.data.currentMusicIdx || this.data.currentMusicIdx;
        this.setData({
            musicList: s,
            currentMusicIdx: 0
        }), wx.setStorageSync("musicList", s), wx.setStorageSync("lastMusicIdx", 0), this.showTopTips("已成功置顶 " + a.musicdesc);
    },
    arrangeTopMusic: function(t, e, a) {
        try {
            var n = wx.getStorageSync("topArray") || [], o = wx.getStorageSync("topMusicArray") || [];
        } catch (t) {
            console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
        }
        var s = (t || this.data.musicList).filter(function(t) {
            return !n.includes(t.id);
        });
        if (s = o.concat(s), s = s.filter(function(t) {
            return !t.ad_id;
        }), (e = e || this.data.adsList) && e.length > 0) {
            var r = this.getAdAtPos(1, e);
            r && s.splice(3, 0, r);
            var c = this.getAdAtPos(2, e);
            c && s.splice(7, 0, c);
        }
        return (a = a || wx.getStorageSync("innerAdsList") || []) && a.length > 0 && s.splice(11, 0, {
            ad_id: -1,
            ad_name: "更多推荐",
            ad_cover_big: "/images/home_ad.png",
            ad_cover_white: "/images/home_ad.png",
            ad_cover_black: "/images/home_ad.png",
            ad_color: "blue"
        }), this.musicList = s, s;
    },
    getAdAtPos: function(t, i) {
        if ((i = i || this.data.adsList) && i.length > 0) for (var e = 0; e < i.length; e++) {
            var a = i[e];
            if (a.ad_row == t) return a;
        }
        return null;
    },
    getRankOriginData: function(t, a) {
        var n = this;
        try {
            this.musicRankOriginData = wx.getStorageSync("musicRankOriginData"), this.setData({
                musicRankOriginData: this.musicRankOriginData
            });
        } catch (t) {
            console.log("获取本地存储失败"), i.uploadError("获取本地存储失败");
        }
        if (this.musicRankOriginData && !a) return console.log(this.musicRankOriginData), 
        void (t && "function" == typeof t && t(this.musicRankOriginData));
        wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 1e4
        });
        var o = e.globalData.requestHeader;
        wx.request({
            url: e.globalData.baseUrl + "/miniapp/v1/music/rank",
            header: o,
            complete: function() {
                wx.hideToast();
            },
            fail: function(t) {
                wx.showModal({
                    title: "抱歉",
                    content: '加载失败:"' + t.errMsg + '"，请稍后再试',
                    showCancel: !1
                });
            },
            success: function(e) {
                var a = e.data;
                1 == a.status ? (console.log(a), n.musicRankOriginData = a.data, wx.setStorageSync("musicRankOriginData", n.musicRankOriginData), 
                n.setData({
                    musicRankOriginData: n.musicRankOriginData
                }), t && "function" == typeof t && t(n.musicRankOriginData)) : (wx.showModal({
                    title: "抱歉",
                    content: a.msg,
                    showCancel: !1
                }), 3 != a.status && 4 != a.status || i.getUserToken(function() {}, !0));
            }
        });
    },
    handleRankData: function(t, i) {
        var e = t[0], a = t[1], n = t[2], o = t.slice(3);
        this.setData({
            rank1: e,
            rank2: a,
            rank3: n,
            currentRankList: o,
            currentRankType: i
        });
    },
    selRankWeek: function() {
        var t = this;
        "week" != this.data.currentRankType && this.getRankOriginData(function(i) {
            t.handleRankData(i.rank_week, "week");
        });
    },
    selRankTotal: function() {
        var t = this;
        "total" != this.data.currentRankType && this.getRankOriginData(function(i) {
            t.handleRankData(i.rank_total, "total");
        });
    },
    selectRankMusic: function(t) {
        console.log("selectRankMusic")
        var i = this.findMusicIdxWithMid(t.currentTarget.dataset.musicId);
        if (!(i < 0)) {
            var e = {
                currentTarget: {
                    dataset: {
                        musicId: t.currentTarget.dataset.musicId,
                        idx: i
                    }
                }
            };
            this.selectMusic(e);
        }
        console.log(i)
    },
    showRankView: function() {
        console.log(this.data.currentRankList)
        var t = this;
        this.setData({
            isShowRankView: !0
        }), setTimeout(function() {
            t.anim_IntroView = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_IntroView.translateY(0).opacity(1).step({
                duration: 800
            }), t.setData({
                anim_IntroView: t.anim_IntroView.export()
            });
        }, 100);
        0 === this.currentRankList.length && this.getRankOriginData(function(i) {
            // console.log(i.rank_week)
            t.handleRankData(i.rank_week, "week");
        }, !0);
    },
    hideRankView: function() {
        var t = this;
        this.anim_IntroView = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), this.anim_IntroView.translateY(50).opacity(0).step({
            duration: 500
        }), this.setData({
            anim_IntroView: this.anim_IntroView.export()
        }), setTimeout(function() {
            t.setData({
                isShowRankView: !1
            });
        }, 500);
    },
    changeNightMode: function() {
        wx.setStorageSync("isNightMode", !this.data.isNightMode), this.setData({
            isNightMode: !this.data.isNightMode
        });
        this.hideExtendPannel()
    },
    changeBigFont: function() {
        wx.setStorageSync("isBigFont", !this.data.isBigFont), this.setData({
            isBigFont: !this.data.isBigFont
        });
        this.hideExtendPannel()
    },
    showTopTips: function(t) {
        var i = this;
        this.setData({
            showTopTipFlag: !0,
            topTipText: t
        }), clearTimeout(this.topTipsTimer), this.topTipsTimer = setTimeout(function() {
            i.hideTopTips();
        }, 2e3);
    },
    hideTopTips: function() {
        this.setData({
            showTopTipFlag: !1
        });
    },
    showAiVoiceIntro: function() {
        this.hidePlayTips();
        var t = this;
        this.setData({
            isShowAiVoiceIntro: !0
        }), setTimeout(function() {
            t.anim_AiVoiceIntro = wx.createAnimation({
                duration: 0,
                timingFunction: "ease"
            }), t.anim_AiVoiceIntro.translateY(0).opacity(1).step({
                duration: 0
            }), t.anim_AiVoiceIntroOverlay = wx.createAnimation({
                duration: 0,
                timingFunction: "ease"
            }), t.anim_AiVoiceIntroOverlay.opacity(1).step({
                duration: 0
            }), t.setData({
                anim_AiVoiceIntro: t.anim_AiVoiceIntro.export(),
                anim_AiVoiceIntroOverlay: t.anim_AiVoiceIntroOverlay.export()
            });
        }, 100);
    },
    hideAiVoiceIntro: function() {
        this.anim_AiVoiceIntro = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.anim_AiVoiceIntro.translateY(50).opacity(0).step({
            duration: 0
        }), this.anim_AiVoiceIntroOverlay = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        }), this.anim_AiVoiceIntroOverlay.opacity(0).step({
            duration: 0
        }), this.setData({
            isShowAiVoiceIntro: !1,
            anim_AiVoiceIntro: this.anim_AiVoiceIntro.export(),
            anim_AiVoiceIntroOverlay: this.anim_AiVoiceIntroOverlay.export()
        });
    },
    hideAiVoiceIntroAndBottomTips: function() {
        var t = this;
        this.hideAiVoiceIntro(), setTimeout(function() {
            t.hideAiVoiceBottomTips();
        }, 2e3);
    },
    hideAiVoiceBottomTips: function() {
        var t = this, i = this;
        i.anim_AiVoiceBottomTips = wx.createAnimation({
            duration: 400,
            timingFunction: "ease"
        }), i.anim_AiVoiceBottomTips.translateY(30).opacity(0).scale(.6).step({
            duration: 400
        }), i.setData({
            anim_AiVoiceBottomTips: i.anim_AiVoiceBottomTips.export()
        }), setTimeout(function() {
            t.setData({
                isShowAiVoiceBottomTips: !1
            });
        }, 400);
    },
    touchStartRegVoiceBtn: function(t) {
        var i = this;
        this.touchExtendPannelStartTime = new Date().getTime(), this.extendPannelTimer = setTimeout(function() {
            i.checkRecordAuthAndShow();
        }, 300);
    },
    touchEndRegVoiceBtn: function(t) {
        var i = this;
        this.data.isShowRecordPannel ? setTimeout(function() {
            i.aiVoiceRecordStop();
        }, 1e3) : !this.isAuthingRecord && new Date().getTime() - this.touchExtendPannelStartTime < 1e3 && (clearTimeout(this.extendPannelTimer), 
        this.extendPannelTimer = null);
    },
    touchStartExtendPannel: function(t) {
        var i = this;
        this.touchExtendPannelStartTime = new Date().getTime(), this.extendPannelTimer = setTimeout(function() {
            i.checkRecordAuthAndShow();
        }, 300);
    },
    touchEndExtendPannel: function(t) {
        var i = this;
        this.data.isShowRecordPannel ? setTimeout(function() {
            i.aiVoiceRecordStop();
        }, 1e3) : !this.isAuthingRecord && new Date().getTime() - this.touchExtendPannelStartTime < 1e3 && (clearTimeout(this.extendPannelTimer), 
        this.extendPannelTimer = null, this.openExtendPannel());
    },
    voiceRecordCount: function() {
        var t = this;
        if (3 === this.data.voiceRecordCountLast) this.setData({
            isVoiceRecordCountLast: !0
        }), console.log(this.data.voiceRecordCountLast), this.recordLastTimer = setTimeout(function() {
            var i = t.data.voiceRecordCountLast - 1;
            t.setData({
                voiceRecordCountLast: i
            }), t.recordLastTimer = setTimeout(function() {
                t.voiceRecordCount();
            }, 1e3);
        }, 1e3); else if (this.data.voiceRecordCountLast >= 1) {
            var i = this.data.voiceRecordCountLast - 1;
            this.setData({
                voiceRecordCountLast: i
            }), console.log(this.data.voiceRecordCountLast), this.recordLastTimer = setTimeout(function() {
                i > 0 ? t.voiceRecordCount() : t.aiVoiceRecordStop();
            }, 1e3);
        } else this.aiVoiceRecordStop();
    },
    aiVoiceRecord: function() {
        var t = this;
        this.pauseMusic(), this.setData({
            isVoiceRecording: !0,
            isVoiceRecordCountLast: !1,
            voiceRecordCountLast: 3
        }), setTimeout(function() {
            t.setData({
                willToRecord: !t.data.isVoiceRecording
            });
        }, 1e3);
        var a = this;
        this.recordLastTimer = setTimeout(function() {
            t.voiceRecordCount();
        }, 5e3), wx.startRecord({
            success: function(t) {
                var n = t.tempFilePath;
                console.log("tempFilePath: " + n), a.setData({
                    isRecognising: !0
                }), i.getUserToken(function(t) {
                    var o = e.globalData.requestHeader;
                    o.token = t, wx.uploadFile({
                        url: e.globalData.baseUrl + "/miniapp/v1/bot/speechToText",
                        filePath: n,
                        name: "voice",
                        header: o,
                        success: function(t) {
                            var e = -1;
                            try {
                                console.log(t);
                                var n = JSON.parse(t.data).data;
                                console.log(n.voice_text), console.log(n.music_match), console.log(n);
                                var o = n.music_match;
                                e = a.findMusicIdxWithMid(o);
                            } catch (t) {
                                console.log("智能语音识别失败"), i.uploadError("智能语音识别失败");
                            }
                            console.log("idx", e), e < 0 && (wx.showToast({
                                title: "未能找到音乐\n随机为您推荐",
                                image: "/images/JJ.png",
                                duration: 3e3
                            }), e = Math.floor(Math.random() * (a.musicList.length - 0) + 0), console.log("random idx", e));
                            var s = {
                                currentTarget: {
                                    dataset: {
                                        musicId: o,
                                        idx: e
                                    }
                                }
                            };
                            a.selectMusic(s), a.scrollToMusicIdx(e), a.hideRecordPannel();
                        },
                        fail: function(t) {
                            a.hideRecordPannel(), wx.showModal({
                                title: "提示",
                                content: t.errMsg,
                                showCancel: !1
                            });
                        },
                        complete: function() {
                            a.setData({
                                willToRecord: !1,
                                isRecognising: !1
                            });
                        }
                    });
                });
            },
            fail: function(t) {
                console.log("record", t), "startRecord:fail auth deny" != t.errMsg ? wx.showModal({
                    title: "提示",
                    content: t.errMsg,
                    showCancel: !1
                }) : wx.openSetting({
                    success: function(t) {}
                });
            },
            complete: function(t) {
                console.log("record complete", t), a.setData({
                    isVoiceRecording: !1,
                    isVoiceRecordCountLast: !1
                });
            }
        });
    },
    aiVoiceRecordStop: function() {
        clearTimeout(this.recordLastTimer), this.recordLastTimer = null, this.setData({
            isVoiceRecording: !1,
            isVoiceRecordCountLast: !1
        }), wx.stopRecord();
    },
    checkRecordAuthAndShow: function() {
        console.log("start check"), this.data.isShowAiVoiceBottomTips && this.hideAiVoiceBottomTips();
        var t = this;
        wx.canIUse("getSetting") ? (this.isAuthingRecord = !0, wx.getSetting({
            success: function(i) {
                i.authSetting["scope.record"] ? (console.log("已授权"), t.isAuthingRecord = !1, t.showRecordPannel()) : wx.authorize({
                    scope: "scope.record",
                    success: function() {
                        console.log("check success"), t.isAuthingRecord = !1;
                    },
                    fail: function() {
                        t.isAuthingRecord = !1, wx.showModal({
                            title: "提示",
                            content: "需要授权录音功能后才能使用智能语音功能。",
                            showCancel: !1
                        });
                    }
                });
            }
        })) : (t.isAuthingRecord = !1, wx.showModal({
            title: "提示",
            content: "当前版本微信不支持智能语音，请升级微信客户端后再试。",
            showCancel: !1
        }));
    },
    showRecordPannel: function() {
        var t = this;
        this.setData({
            isShowRecordPannel: !0
        }), this.data.isVoiceRecording || this.data.isRecognising || this.aiVoiceRecord(), 
        setTimeout(function() {
            t.anim_AiVoiceShowRecordPannel = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_AiVoiceShowRecordPannel.translateY(0).opacity(1).step({
                duration: 800
            }), t.setData({
                anim_AiVoiceShowRecordPannel: t.anim_AiVoiceShowRecordPannel.export()
            });
        }, 20);
    },
    colseRecordPannelWithError: function() {
        this.data.isVoiceRecording || this.data.isRecognising || this.hideRecordPannel();
    },
    hideRecordPannel: function() {
        var t = this;
        console.log("关闭录音pannel");
        this.anim_AiVoiceShowRecordPannel = wx.createAnimation({
            duration: 400,
            timingFunction: "ease"
        }), this.anim_AiVoiceShowRecordPannel.translateY(50).opacity(0).step({
            duration: 400
        }), this.setData({
            anim_AiVoiceShowRecordPannel: this.anim_AiVoiceShowRecordPannel.export()
        }), setTimeout(function() {
            t.setData({
                isShowRecordPannel: !1
            });
        }, 400);
    },
    scrollToMusicIdx: function(t) {
        if (t > -1) {
            var i = wx.getSystemInfoSync().windowWidth / 750 * 187 * Math.floor(t / 4);
            this.setData({
                scrollTop: i
            });
        }
    },
    showRecommendView: function() {
        this.pauseMusic();
        var t = this;
        this.setData({
            isShowRecommendView: !0
        }), setTimeout(function() {
            t.anim_RecommendView = wx.createAnimation({
                duration: 800,
                timingFunction: "ease"
            }), t.anim_RecommendView.translateY(0).opacity(1).step({
                duration: 800
            }), t.setData({
                anim_RecommendView: t.anim_RecommendView.export()
            });
        }, 100);
    },
    hideRecommendView: function() {
        this.pauseMusic();
        var t = this;
        this.anim_RecommendView = wx.createAnimation({
            duration: 500,
            timingFunction: "ease"
        }), this.anim_RecommendView.translateY(50).opacity(0).step({
            duration: 500
        }), this.setData({
            anim_RecommendView: this.anim_RecommendView.export()
        }), setTimeout(function() {
            t.setData({
                isShowRecommendView: !1
            });
        }, 500);
    },
    togglePlayRecommend: function(t) {
        var i = this, e = t.currentTarget.dataset.idx, a = this.data.recommendList[e], n = this.data.currentRecomendMusic.recommend_id !== a.recommend_id;
        this.setData({
            currentRecomendMusic: a,
            currentRecomendIdx: e
        }), n ? (this.recommendRemainSec = 1800, this.setData({
            recommendPassPercent: 0,
            recommendRemainTimeText: "30:00"
        }), i.playCurrentMusic()) : !i.data.isPlaying ? i.playCurrentMusic() : i.pauseMusic();
    },
    selectAd: function(t) {
        var a = t.currentTarget.dataset.appdata;
        console.log(a);
        var n = e.globalData.requestHeader;
        if (a.ad_id && a.ad_id > 0) {
            var o = null;
            try {
                o = JSON.parse(a.ad_link), console.log(o);
            } catch (t) {
                i.uploadError(t.message, "外部广告JSON解析错误");
            }
            o.success = function(t) {
                console.log(t);
                var i = JSON.stringify([ {
                    func_type: 14,
                    func_id: a.ad_id,
                    func_count: 1
                } ]);
                wx.request({
                    url: e.globalData.baseUrl + "/miniapp/v1/statics/func",
                    header: n,
                    method: "POST",
                    data: {
                        statics_data: i
                    },
                    success: function(t) {
                        console.log("统计提交:", t.data);
                    }
                });
            }, o.fail = function(t) {
                console.log(t), i.uploadError(t.errMsg, "外部广告唤起失败"), wx.showToast({
                    title: "打开“" + a.ad_name + "”失败",
                    icon: "none",
                    duration: 2e3
                });
            }, wx.navigateToMiniProgram(o);
        } else {
            var s = JSON.stringify([ {
                func_type: 14,
                func_id: a.ad_id,
                func_count: 1
            } ]);
            wx.request({
                url: e.globalData.baseUrl + "/miniapp/v1/statics/func",
                header: n,
                method: "POST",
                data: {
                    statics_data: s
                },
                success: function(t) {
                    console.log("统计提交:", t.data);
                }
            }), wx.navigateTo({
                url: "/pages/add/add"
            });
        }
    },
    feedback:function(){
        wx.navigateToMiniProgram({
            appId: 'wx8abaf00ee8c3202e',  /* 目标为吐个槽社区小程序AppID(固定) */
            extraData: {
                id: '29374',  /* 来源为吐个槽上申请的产品ID ，查看路径：tucao.qq.com ->产品管理->ID */
            }
        })
    }
});