//logs.js
var util = require('../../utils/util.js');
var app = getApp();
var request = require('../../utils/request.js');
Page({
  data: {
    logs: [],
    pageHeight:0
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          pageHeight: res.windowHeight
        })
      }
    })
    that.setData({
      currentcityName: options.name
    })
    request.requestData('area/city-list', "POST", {}, function (res) {
      that.setData({
        dataList: res.data.data,
        currentcity: res.data.data.citys
      })
    }, function () {
      that.onLoad();
    }, null)
  },
  toast: function (e) {
    var cityId = e.target.id;
    var cityName = e.target.dataset.name;
    app.globalData.cityId = cityId;//设置全局变量
    app.globalData.cityName = cityName;//设置全局变量
    wx.switchTab({
      url: '../index/index',
      // success: function (e) {
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) return;
      //   page.onLoad();
      // }
    })
  },
  scrollToViewFn: function (e) {
    var _id = e.target.id;
    this.setData({
      toView: _id
    })
  },  
})
