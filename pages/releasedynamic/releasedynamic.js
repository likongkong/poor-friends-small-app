//logs.js
var util = require('../../utils/util.js');
var qiniuUploader = require("../../utils/qiniuUploader.js");
var request = require('../../utils/request.js');
var app = getApp();
Page({
  data: {
    imageLists: [],
    id: ''
  },
  onLoad: function (options) {
    var that = this;
    that.data.id = options.id;
  },
  chooseWxImage: function (e) {
    var imageLists = this.data.imageLists;
    if (imageLists.length < 6) {
      var that = this;
      var data = {};
      wx.request({
        url: app.globalData.url+'foster/get-qiniu-token',
        data: {},
        success: function (data) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (file) {
              wx.showLoading({
                title: '加载中...',
              })
              var filePath = file.tempFilePaths[0];
              qiniuUploader.upload(filePath, (res) => {
                wx.hideLoading()
                var newData = { imgUrl: res.imageURL};
                imageLists.push(newData);
                that.setData({
                  lists: imageLists,
                });
              }, (error) => {
                wx.hideLoading()
                console.log('error: ' + error);
              }, {
                  region: 'NCN',
                  domain: 'http://img.poorfriends.com/',
                  uptoken: data.data.uptoken
                });
            }
          })
        }
      })
    } else {
      util.showModal('', '最多只能上传6张图片', function () { });
    }
  },
  formSubmit: function (e) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var imageLists = this.data.imageLists;
    var imgurl = [];
    for (var i = 0; i < imageLists.length; i++) {
      imgurl.push(imageLists[i].imgUrl);
    }
    // if (imgurl.length == 0) {
    //   util.showModal('', '请添加照片', function () { });
    //   return false;
    // }
    if (e.detail.value.content == '') {
      util.showModal('', '请填写内容', function () { });
      return false;
    }
    var data = {};
      data.id = that.data.id,
      data.dynamic_content = e.detail.value.content,
      data.dynamic_photos = JSON.stringify(imgurl),
      data.token = userInfo.token
      request.requestData('dynamic/create', "POST", data, function () {
        app.globalData.is_clickable = false;
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          app.globalData.is_clickable = true;
          let id = {
            id: that.data.id
          }
          var pages = getCurrentPages(),
              prevPage = pages[pages.length - 2]; //上一个页面（父页面）
          prevPage.onLoad(id)
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }, function () {
        that.onLoad();
      }, null)
  }
})
