// pages/contactUs/contactUs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 一键复制事件
  copyBtn: function (e) {
    let appid = e.currentTarget.dataset.appid;
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: appid,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  }
})