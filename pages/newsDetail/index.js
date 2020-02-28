var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var page = 1;
var ismore = false;
function list(that) {
  if (ismore == false) {
    var articleid = wx.getStorageSync('articleid');
    var userInfo = wx.getStorageSync('userInfo');
    
    request.requestData('article/detail', "GET", { id: articleid, page: page, limit: 10, token: userInfo.token}, function (data) {
      wx.hideLoading();
      if (data.data.data.dynamic.length == 0 && page!=1) {
        ismore = true;
        that.setData({
          nomore: true
        });
        return false;
      }
      if (data.data.data.article_type ==10){
        var article = data.data.data.article_content;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
      for (var i = 0; i < data.data.data.dynamic.length; i++) {
        data.data.data.dynamic[i].created_at = util.toDate1(data.data.data.dynamic[i].created_at);
        that.data.Res.push(data.data.data.dynamic[i]);
        that.data.info = data.data.data;
      }
      if (data.data.data.has_liked == true){
        that.setData({
          is_like: true
        });
      }
      that.data.likedcount = data.data.data.liked_count;
      that.setData({
        is_mask: false,
        data: data.data.data,
        commentList: that.data.Res,
        likedcount: data.data.data.liked_count
      });
    }, null, null)
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_mask:true,
    is_like:false,
    Res:[],
    name_focus: false,
    is_loginBox:false,
    commentVal:'',
    nomore: false,
    likedcount:'',
    info:'',
    followed:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    ismore = false;
    if (options.articleid){
      wx.setStorage({ key: "articleid", data: options.articleid });
    }
    wx.showLoading({
      title: '加载中',
    })
    list(that);
  },
  onShareAppMessage: function (res) {
    var that = this;
    var articleid = wx.getStorageSync('articleid');
    return {
      title: that.data.info.article_title,
      path: 'pages/newsDetail/index?articleid=' + articleid,
      imageUrl: that.data.info.cover_image.length == 0 ? '' : that.data.info.cover_image[0]
    }
  },
  onReachBottom: function () {
    var that = this;
    page = ++page;
    list(that);
  },
  bindAttention(e){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {};
    data.id = e.currentTarget.dataset.id;
    data.token = userInfo.token;
    data.customer_follow_type=20;
    request.requestData('customer/create-follow', "POST", data,(res)=> {
      wx.showToast({
        title: '关注成功',
        icon: 'success',
        duration: 1000
      })
      this.setData({
        followed: true
      })
    },null, null)
  },
  bindFocus: function () {
    this.setData({ name_focus: true});
  },
  bindLike:function(){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var articleid = wx.getStorageSync('articleid');
    if (userInfo) {
      // console.log(++that.data.likedcount)
      request.requestData('customer/create-liked', "post", { article_id: articleid, token: userInfo.token }, function (data) {
        console.log(data)
        that.setData({
          is_like: true,
          likedcount: ++that.data.likedcount
        });
      }, null, null)
    }else{
      that.setData({
        is_loginBox: true
      });
    }
  },
  bindSubmitComment:function(e){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var articleid = wx.getStorageSync('articleid');
    if (userInfo) {
      page = 1;
      ismore = false;
      that.data.Res = [];
      request.requestData('dynamic/create', "post", { id: articleid, token: userInfo.token, dynamic_type: 20, dynamic_content: e.detail.value}, function (data) {
        console.log(data)
        wx.showToast({
          title: '评论成功',
          icon: 'none',
          duration: 1000
        })
        that.setData({
          nomore: false,
          commentVal: ''
        });
        list(that);
      }, null, null)
    } else {
      that.setData({
        is_loginBox: true
      });
    } 
  },
  //隐藏登录框
  chooseLoginHide: function (e) {
    var that = this;
    that.setData({
      is_loginBox: false
    });
  },
  // 微信登录
  onGotUserInfo: function (e) {
    var that = this;
    request.wxLogin(e, that, function () {
      console.log("登录成功")
      that.setData({
        is_loginBox: false
      });
      var data = {};
      data.id = that.data.id;
      that.onLoad(data);
    })
  },
})