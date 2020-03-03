var app = getApp();

//时间戳转换时间  
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + '.' + M + '.' + D)
} 
function toDate1(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + '-' + M + '-' + D)
} 
/**
 * 判断目标是否是函数
 * @param {mixed} val
 * @returns {boolean}
 */
function isFunction(val) {
  return typeof val === 'function';
}

function formatTime(number) {
  var date = new Date(number * 1000);  
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
    // [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function showModal(title, content, success){
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        success();
      } else if (res.cancel) {
        // fail();
        console.log('用户点击取消')
      }
    }
  })
}

function scopeuserInfo(success){
  wx.showModal({
    title: '',
    content: '需要权限才能继续',
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.switchTab({
          url: '../my/my'
        });
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
/**
 * 微信登录
 */
function login(successCallback) {
  wx.login({//login流程
    success: function (res) {//登录成功
      if (res.code) {
        getApp().globalData.code = res.code;
        successCallback();
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}
function getUserInfo(successCallback) {
  login(function () {
    wx.getUserInfo({//getUserInfo流程
      success: function (res2) {//获取userinfo成功
        var encryptedData = encodeURIComponent(res2.encryptedData);
        var iv = res2.iv;
        var signature = res2.signature;
        var rawData = res2.rawData;
        wx.request({
          url: app.globalData.url + 'customer/wx-login',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: app.globalData.code,
            encryptedData: encryptedData,
            signature: signature,
            iv: iv,
            rawData: rawData
          },
          success: function (res3) {
            wx.setStorage({ key: "userInfo", data: res.data.data });
            that.setData({
              hasUserInfo: true,
              userInfo: res.data.data
            });
            app.globalData.token = res.data.data.token;
            // app.globalData.userId = res.data.data.customer_id;
            // app.globalData.userPhoto = res.data.data.customer_header_picture;
            // app.globalData.userName = res.data.data.customer_name;
            // app.globalData.hasUserInfo = true;
            successCallback();
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  showModal: showModal,
  scopeuserInfo: scopeuserInfo,
  getUserInfo: getUserInfo,
  isFunction: isFunction,
  login: login,
  toDate: toDate,
  toDate1: toDate1
}
