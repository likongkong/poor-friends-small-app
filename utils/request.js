var util = require( 'util.js' );
var app = getApp();

/**
 * 网络请求方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @param successCallback {function} 成功回调函数
 * @param errorCallback {function} 失败回调函数
 * @param completeCallback {function} 完成回调函数
 * @returns {void}
 */
function requestData(url, method, data, successCallback, errorCallback, completeCallback) {
    wx.request({
      url: app.globalData.url + url,
        data: data,
        method: method,
        header: { 'content-type': 'application/x-www-form-urlencoded'},
        success: function( res ) {
            if (res.data.code == 10000 ){
              util.isFunction(successCallback) && successCallback(res);
            }else if (res.data.code == 21115 || res.data.code == 21116 || res.data.code == 21117){
              wx.removeStorageSync('userInfo')
            }else{
              wx.showModal({
                title: '',
                content: res.data.msg,
                showCancel: false, //不显示取消按钮
                confirmText: '确定'
              })
              util.isFunction(errorCallback) && errorCallback();
            }
            // wx.hideLoading()
        },
        error: function() {
          wx.hideLoading()
          util.isFunction( errorCallback ) && errorCallback();
        },
        complete: function() {
          util.isFunction( completeCallback ) && completeCallback();
        }
    });
}
//微信登录
function wxLogin(e, that, successCallback) {
  wx.showLoading({
    title: '登录中...',
  })
  if (e.detail.encryptedData != undefined) {
    util.login(function () {
      var encryptedData = encodeURIComponent(e.detail.encryptedData);
      var iv = e.detail.iv;
      var signature = e.detail.signature;
      var rawData = e.detail.rawData;
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
        success: function (res) {
          console.log(res.data.data)
          wx.hideLoading();
          wx.setStorage({ key: "userInfo", data:res.data.data });
          that.setData({
            hasUserInfo: true,
            userInfo: res.data.data
          });
          app.globalData.token = res.data.data.token;
          successCallback();
          // app.globalData.userId = res.data.data.customer_id;
          // app.globalData.userPhoto = res.data.data.customer_header_picture;
          // app.globalData.userName = res.data.data.customer_name;
          // app.globalData.hasUserInfo = true;
        }
      })
    });
  } else {
    wx.hideLoading();
  }
}
//判断是否登录
function isLogin(this_){
  // var mtoken = wx.getStorageSync('token');
  wx.checkSession({
    success:function(){
      if (this_.globalData.userInfo && this_.globalData.userInfo.nickName!=""){
        wx.authorize({
          scope: 'scope.userInfo',
          success:function(){
            loginF(this_, null);
          },
          fail:function(){

          }
        })
      } 
    },
    fail:function(){
      // getToken(this_,null);
      wx.clearStorageSync();
      loginF(this_,null);
    }
  })
}
//获取登录token
function getToken(this_, completeCallback){
  wx.login({
    success: result => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = result.code;
      wx.request({
        url: "https://beehive-api.sodudu.cn/member/create",
        data: { code: code },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (resu) {
          if (resu.data.code == 10000) {
            this_.globalData.token = resu.data.data.token;
            wx.clearStorageSync();
            wx.setStorageSync('token', resu.data.data.token);
            util.isFunction(completeCallback) && completeCallback(resu.data.data.token);
          }
        }
      })
    }
  })
}

module.exports = {
  requestData: requestData,
  isLogin: isLogin,
  getToken: getToken,
  wxLogin: wxLogin
};