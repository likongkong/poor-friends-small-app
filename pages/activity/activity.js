// pages/activity/activity.js
var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSign: false,  //详细说明
    iseExplain:false,  //详细说明
    iseStore:false,  //兑换商城
    isPage:true,
    is_loginBox: false
  },
  onShow(){
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (userInfo) {
      this.setData({ userInfo: userInfo, isPX: app.isPX, is_loginBox: false});
      this.signDetail();
    }else{
      this.setData({
        is_loginBox: true,
        isPage: false
      });
    }
  },
  onShareAppMessage: function (res) {
    return {
      title: '宠物星球每日签到有奖',
      path: 'pages/activity/activity'
    }
  },
  signDetail(){
    console.log(111)

    let data = {
      token: this.data.userInfo.token
    }
    wx.showLoading({
      title: '加载中...',
    })
    request.requestData('customer-signed/detail', "GET", data, (res) =>{
      this.setData({ detail: res.data.data})
      setTimeout(()=>{
        wx.hideLoading()
        this.setData({ isPage: false })
      },200)
    })
  },
  explain(){
    this.setData({iseExplain: true})
  },
  shangcheng() {
    this.setData({ iseStore: true })
  },
  signBtn(){
    let data = {
      token: this.data.userInfo.token
    }
    request.requestData('customer-signed/signed', "POST", data, (res) => {
      this.setData({ signSuccess: res.data.data, isSign: true })
      this.onShow();
    })
  },
  closeMask(){
    this.setData({ iseExplain: false, isSign: false, iseStore: false })
  },
  //隐藏登录框
  chooseLoginHide: function (e) {
    this.setData({
      is_loginBox: false
    });
  },
  // 微信登录
  onGotUserInfo: function (e) {
    var that = this;
    request.wxLogin(e, that, function () {
      that.setData({
        is_loginBox: false
      });
      that.onShow();
    })
  },
})