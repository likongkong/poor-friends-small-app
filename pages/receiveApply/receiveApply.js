var util = require('../../utils/util');
var request = require('../../utils/request.js');
var app = getApp();
Page({

  data: {
    page: 1,
    currentTab:1,
    isLoad: true,
    isMore: false,
    isData: false,
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({ token: userInfo.token, dataList: []})
    this.list(this.data.page)
  },
  swichNav: function (e) {
    let cur = e.currentTarget.dataset.current;
    this.setData({ currentTab: cur, dataList: [], isMore: false, isLoad: true, isData: false, page: 1})
    this.list(this.data.page)
  },
  onReachBottom() {
    if (this.data.isLoad == true) {
      let page = ++this.data.page
      this.list(this.data.page);
    }
  },
  list(page) {
    let data = {
      status: this.data.currentTab,
      token: this.data.token,
      page: page,
      limit:10
    }
    request.requestData('adopter/receive-list', "GET", data, (res) => {
      if (res.data.data.length != 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].created_at = util.toDate1(res.data.data[i].created_at)
          this.data.dataList.push(res.data.data[i])
        }
        console.log(1)
        this.setData({ dataList: this.data.dataList })
      }else{
        if (page == 1) {
          this.setData({ isData: true })
        } else {
          this.setData({ isLoad: false, isMore: true })
        }
      }
    }, null, null)
  },
  //查看用户资料
  checkInformation(e){
    wx.navigateTo({
      url: '../userinfo/index?id=' + e.currentTarget.dataset.id + '&url=' + e.currentTarget.dataset.url
    })
  },
  choice: function (e) {
    var userInfo = wx.getStorageSync('userInfo');
    var data = {};
    data.id = e.currentTarget.dataset.id;
    data.token = userInfo.token;
    request.requestData('adopter/choice', "POST", data, (res)=> {
      wx.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 1000
      })
      this.onShow();
    }, null, null)
  },
  refuse(e){
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
    }, null, null)
  },
  petDetail(e) {
    app.globalData.directory = 'index';
    wx.navigateTo({
      url: '../noadopt/noadopt?id=' + e.currentTarget.dataset.id
    })
  }
})