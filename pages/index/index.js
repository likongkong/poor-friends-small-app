var util = require('../../utils/util');
var request = require('../../utils/request.js');
var app = getApp();

Page({
  //事件处理函数
  data: {
    imgUrls: ["http://img.poorfriends.com/tmp%2Fwxc42334dfe0acfa72.o6zAJswifTs5kKtTjj-xfk-re0PI.QghGWKqEgVfMef000fd9fcfb928c9f6c4c0c320f1c18.jpg", "http://img.poorfriends.com/tmp%2Fwxc42334dfe0acfa72.o6zAJswifTs5kKtTjj-xfk-re0PI.QghGWKqEgVfMef000fd9fcfb928c9f6c4c0c320f1c18.jpg","http://img.poorfriends.com/tmp%2Fwxc42334dfe0acfa72.o6zAJswifTs5kKtTjj-xfk-re0PI.QghGWKqEgVfMef000fd9fcfb928c9f6c4c0c320f1c18.jpg"
    ],
    tabnum: 0
  },
  onShow: function () {
    
  },
  //推荐列表切换
  btnTab(e){
    this.setData({tabnum: e.currentTarget.dataset.tabnum})
  },
  //导航跳转
  goto(e){
    console.log(e.currentTarget.dataset.url)
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  }
  
  
  
 



})
