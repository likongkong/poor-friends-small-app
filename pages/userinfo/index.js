var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();

Page({
  data: {
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      url: options.url,
      fosterid: options.fosterid
    })
    var data = {};
    var sex = '';
    var live = '';
    var company = '';
    var userInfo = wx.getStorageSync('userInfo');
    data.id = options.id;
    data.token = userInfo.token;
    request.requestData('adopter/detail', "GET", data, function (res) {
      if (res.data.data.customer_sex == 1) {
        sex = '保密'
      } else if (res.data.data.customer_sex == 2) {
        sex = '男'
      } else if (res.data.data.customer_sex == 3) {
        sex = '女'
      }
      if (res.data.data.customer_live_environment == 10) {
        live = '产权房'
      } else if (res.data.data.customer_live_environment == 20) {
        live = '独立租房'
      } else if (res.data.data.customer_live_environment == 30) {
        live = '合租房'
      } else if (res.data.data.customer_live_environment == '') {
        live = false
      }
      if (res.data.data.customer_company == '') {
        company = false
      }
      that.setData({
        customer_name: res.data.data.customer_name,
        customer_real_name: res.data.data.customer_real_name,
        customer_sex: sex,
        customer_idcard_number: res.data.data.customer_idcard_number,
        customer_phone: res.data.data.customer_phone,
        customer_reside_address: res.data.data.customer_reside_address,
        customer_company: res.data.data.customer_company,
        customer_live_environment: live,
        is_selected: res.data.data.is_selected,
        id: res.data.data.id,
      })
    }, function () {
      that.onLoad();
    }, null)
  },
  choice:function(e){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var data = {};
    data.id = e.currentTarget.dataset.id;
    data.token = userInfo.token;
    request.requestData('adopter/choice', "POST", data, (res) => {
      wx.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(()=> {
        var data = {};
        data.id = this.data.fosterid;
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];
        page.onLoad(data);
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }, function () {
      that.onLoad();
    }, null)
  },
  refuse(e) {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {};
    data.id = e.currentTarget.dataset.id;
    data.token = userInfo.token;
    request.requestData('adopter/refund', "POST", data, (res) => {
      wx.showToast({
        title: '已拒绝',
        icon: 'none',
        duration: 1000
      })
      setTimeout(() =>  {
        var data = {};
        data.id = this.data.fosterid;
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];
        page.onLoad(data);
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }, null, null)}
  
})