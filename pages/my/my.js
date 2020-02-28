//logs.js
var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();

Page({
  data: {
    is_loginBox: false
  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      console.log('已登录')
      this.setData({ userInfo: userInfo, hasUserInfo: true });
    }else{
      console.log('未登录')
    }
  },
  //页面跳转
  toPage(e){
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.navigateTo({
        url: "../" + e.currentTarget.dataset.url
      })
    }else{
      this.setData({ is_loginBox: true })
    }
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: '流浪动物之家-For.it',
      path: 'pages/index/index',
      imageUrl: '../../image/pagehomeshare.png'
    }
  },
  //隐藏登录框
  chooseLoginHide(e) {this.setData({is_loginBox: false})},
  // 微信登录
  onGotUserInfo (e) {
    var that = this;
    request.wxLogin(e, that, ()=> {
      console.log("登录成功")
      this.setData({
        is_loginBox: false
      });
    })
  },
})
