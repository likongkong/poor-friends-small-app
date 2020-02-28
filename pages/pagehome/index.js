var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();

Page({
  data: {
    num:10,
    page:1,
    dataList: [],
    is_more:false,
    is_data:false,
    is_load:true,
    is_loginBox:false,
    swiperIndex: 0
  },
  onLoad(){
    wx.showLoading({title: '加载中'})
    request.requestData('article/roll-pictures', "GET", {}, (res)=> {
      this.setData({
        slideimage: res.data.data
      });
      wx.hideLoading()
    }, null, null)
    this.list(this.data.page)
  },
  // 分享
  onShareAppMessage: function (res) {
    return {
      title: '流浪动物之家-For.it',
      path: 'pages/pagehome/index?',
      imageUrl: '../../image/pagehomeshare.png'
    }
  },
  //tab切换
  bindtabbar: function (e) {
    this.setData({ num: e.currentTarget.dataset.num, is_more: false, is_load: true, is_data: false, page: 1, dataList: [] })
    this.list(this.data.page);
  },
  // 上拉加载
  onReachBottom: function () {
    if (this.data.is_load == true) {
      let page = ++this.data.page
      this.list(this.data.page);
    }
  },
  list(page){
    let data = {};
    data.limit = 10;
    data.page = page;
    data.article_classify = this.data.num;
    request.requestData('article/list', "GET", data, (res) => {
      console.log(res.data.data.length)
      if (res.data.data.length != 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].created_at = util.toDate(res.data.data[i].created_at);
          this.data.dataList.push(res.data.data[i])
        }
        this.setData({ dataList: this.data.dataList })
      } else {
        if (page == 1) {
          this.setData({ is_data: true })
        } else {
          this.setData({ is_load: false, is_more: true })
        }
      }
    })
  },
  
  // 跳转详情页
  newsDetail(e){
    wx.setStorage({ key: "articleid", data: e.currentTarget.dataset.id});
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo){
      wx.navigateTo({url: '/pages/newsDetail/index'})
    } else {
      this.setData({is_loginBox: true})
    }   
  },

  //隐藏登录框
  chooseLoginHide(e) {this.setData({is_loginBox: false})},
  // 微信登录
  onGotUserInfo(e) {
    request.wxLogin(e, this, ()=> {
      this.setData({is_loginBox: false});
    })
  }
})