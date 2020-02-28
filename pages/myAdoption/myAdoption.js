var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();
Page({
  data: {
    dataList: [],
    page: 1,
    isLoad: true,
    isMore: false,
    isData: false,
    tabbarNum: 1
  },
  onLoad: function (options) {
    this.list(this.data.page);
  },
  bindTabbar(e) {
    this.setData({ tabbarNum: e.currentTarget.dataset.num, isMore: false, isLoad: true, isData: false, page: 1, dataList: [] })
    this.list(this.data.page);
  },
  onReachBottom() {
    if (this.data.isLoad == true) {
      let page = ++this.data.page
      this.list(this.data.page);
    }
  },
  list(page) {
    let userInfo = wx.getStorageSync('userInfo')
    let data = {};
    data.token = userInfo.token;
    data.limit = 10;
    data.page = page;
    data.status = this.data.tabbarNum;
    request.requestData('adopter/my-list', "GET", data, (res) => {
      console.log(res.data.data.length)
      if (res.data.data.length != 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          this.data.dataList.push(res.data.data[i])
        }
        this.setData({ dataList: this.data.dataList })
      } else {
        if (page == 1) {
          this.setData({ isData: true })
        } else {
          this.setData({ isLoad: false, isMore: true })
        }
      }
    }, null, null)
  },
  petDetail(e) {
    app.globalData.directory = 'index';
    wx.navigateTo({
      url: '../noadopt/noadopt?id=' + e.currentTarget.dataset.id
    })
  }
})