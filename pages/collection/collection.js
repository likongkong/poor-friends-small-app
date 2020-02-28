//logs.js
var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();

var page = 1;
function _get(url, data, success) {
  wx.request({
    url: url,
    data: data,
    success: function (res) {
      success(res);
    }
  })
}
Page({
  data: {
    id:'',
    is_no_data:true,
    pull: true,
    Res: [],
  },
  onLoad: function (options) {
    this.setData({ Res: [], is_no_data: true, pull: true})
    var that =this;
    that.data.id = options.id;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {};
    data.id = options.id;
    data.token = userInfo.token;
    data.limit = 20;
    data.page = 1;
    request.requestData('adopter/list', "GET", data, function (res) {
      if (res.data.data.length == 0) {
        that.setData({
          is_no_data: true
        })
      } else {
        that.setData({
          is_no_data: false
        })
      }
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].created_at = util.formatTime(res.data.data[i].created_at);
        that.data.Res.push(res.data.data[i])
      }
      that.setData({
        dataList: that.data.Res
      })
    }, null, null)
  },
  onReachBottom: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (that.data.pull == true) {
      var data = {};
        data.id = that.data.id,
        data.token = userInfo.token;
        data.limit = 20;
        data.page = ++page;
        request.requestData('adopter/list', "GET", data, function (res) {
          if (res.data.data.length < 20) {
            that.data.pull = false
          }
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.Res.push(res.data.data[i])
          }
          that.setData({
            dataList: that.data.Res
          })
        }, function () {
          that.onLoad();
        }, null)
    }
  },
  adopterChoice:function(e){
    wx.navigateTo({
      url: '../userinfo/index?id=' + e.currentTarget.dataset.id + '&url=' + e.currentTarget.dataset.url + '&fosterid=' + e.currentTarget.dataset.fosterid
    })
  }
})
