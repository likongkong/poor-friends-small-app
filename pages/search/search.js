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
    is_no_result: true,
    keywords:'',
    pull:true,
    Res: [],
    is_more:false
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      cityId: options.id
    })
  },
  toast: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },
  searchlist:function(e){
    var _this = this;
    _this.data.Res = [];
    var keywords = e.detail.value;
    var cityId = e.target.dataset.id;
    _this.data.keywords = e.detail.value;
    request.requestData('foster/search', "GET", {area_city_id: cityId,keywords: keywords,limit: 20,page: 1}, function (res) {
      console.log(res.data.data)
      if (res.data.data == '') {
        _this.setData({
          is_no_result: true
        })
      } else {
        _this.setData({
          is_no_result: false
        })
      }
      for (var i = 0; i < res.data.data.length; i++) {
        _this.data.Res.push(res.data.data[i])
      }
      _this.setData({
        dataList: _this.data.Res
      })
    }, function () {
      that.onLoad();
    }, null)
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.pull == true) {
      var data = {};
        data.area_city_id = app.globalData.cityId,
        data.keywords = that.data.keywords;
        data.limit = 20,
        data.page = ++page;
        request.requestData('foster/search', "GET", data, function (res) {
          if (res.data.data.length < 20) {
            that.data.pull = false;
            that.setData({
              is_more: true
            });
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
  fosterDetail: function (e) {
    app.globalData.directory = 'search';
    wx.navigateTo({
      url: '../noadopt/noadopt?id=' + e.currentTarget.dataset.id
    })
  }
})
