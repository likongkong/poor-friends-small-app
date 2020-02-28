var util = require('../../utils/util');
var request = require('../../utils/request.js');
var app = getApp();
var page = 1;

Page({
  //事件处理函数
  data: {
    pull:true,
    family_id: '',
    dataAll : [],
    is_sy:false,
    url: 'foster/recommend-list',
    is_more:false,
    is_loginBox:false,
    num:0
  },
  onShow: function () {
    //默认城市
    if (app.globalData.cityId == ''){
      this.setData({
        loading: true,
        cityName: '全国',
        cityId: ''
      })
      let obj = { area_city_id: '', family_id: '', limit: 20, page: 1 };
      this.list('foster/recommend-list', obj); 
    }else{
      //选中的城市
      this.setData({
        loading: true,
        cityName: app.globalData.cityName,
        cityId: app.globalData.cityId
      })
      let obj = { area_city_id: app.globalData.cityId, family_id: '', limit: 20, page: 1 };
      this.list('foster/recommend-list', obj); 
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
  //上拉加载
  onReachBottom:function(){
    if (this.data.pull == true){
      wx.showLoading({
        title: '加载中',
      })
      var data = {};
        data.area_city_id = app.globalData.cityId,
        data.family_id = this.data.family_id;
        data.limit = 20,
        data.page = ++page;
      request.requestData(this.data.url, "GET", data, (res) => {
        wx.hideLoading()
        if (res.data.data.length < 20) {
          this.data.pull = false;
          this.setData({
            is_more: true
          });
        }
        for (var i = 0; i < res.data.data.length; i++) {
          this.data.dataAll.push(res.data.data[i])
        }
        this.setData({
          dataList: this.data.dataAll
        })
      }, null, null)
    }
  },
  goCity: function (e) {
    var cityName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../city/city?name=' + cityName
    })
  },
  goSearch:function(e){
    var cityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../search/search?id=' + cityId
    })
  },
  //全部
  recommendList: function (e) {
    this.setData({num: 0})
    var cityId = app.globalData.cityId
    let obj = { area_city_id: cityId, limit: 20, page: 1 };
    this.list('foster/recommend-list', obj); 
  },
  //汪星人
  dogList:function(e){
    this.setData({ num: 1 })
    this.data.family_id = 10;
    let cityId = app.globalData.cityId
    let obj = { area_city_id: cityId, family_id: 10, limit: 20, page: 1 };
    this.list('foster/family-list', obj); 
  },
  //喵星人
  catList: function (e) {
    this.setData({ num: 2 })
    this.data.family_id = 20;
    let cityId = app.globalData.cityId
    let obj = { area_city_id: cityId, family_id: 20, limit: 20, page: 1 };
    this.list('foster/family-list', obj); 
  },
  //其他
  otherList: function (e) {
    this.setData({ num: 3})
    this.data.family_id = 30;
    let cityId = app.globalData.cityId
    let obj = { area_city_id: cityId, family_id: 30, limit: 20, page: 1 };
    this.list('foster/family-list', obj); 
  },


  list(url, data) {
    wx.showLoading({
      title: '加载中',
    })
    page = 1;
    this.setData({ is_more: false, url: url, pull: true, dataAll:[]})
    request.requestData(url, "GET", data, (res) => {
      wx.hideLoading()
      let dataLen = res.data.data.length;
      if (dataLen == 0) {
        this.setData({ is_sy: true })
      } else {
        this.setData({ is_sy: false })                                                                                            
      }
      for (var i = 0; i < dataLen; i++) {
        this.data.dataAll.push(res.data.data[i])
      }
      this.setData({ dataList: this.data.dataAll })
    }, null, null)
  },
  
  //宠物详情
  petDetail:function(e){
    app.globalData.directory = 'index';
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      wx.navigateTo({
        url: '../noadopt/noadopt?id=' + e.currentTarget.dataset.id
      })
    }else{
      this.setData({
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
