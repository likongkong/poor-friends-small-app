var qiniuUploader = require("../../utils/qiniuUploader.js");
var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();
Page({
  data: {
    imageLists: [],
    sexRadioItems: [{ id: 2, value: '小哥哥' }, { id: 3, value: '小姐姐' }, { id: 1, value: '保密' },],
    sex: null,
    faceData:null,
    backDta:null
  },
  onShow: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    this.setData({ userInfo: userInfo, date: userInfo.customer_birthday, locationAddress: userInfo.customer_address })
    if (userInfo.customer_sex != ''){
      for (var i = 0; i < this.data.sexRadioItems.length; i++){
        if (this.data.sexRadioItems[i].id == userInfo.customer_sex){
          this.data.sexRadioItems[i].checked = true
          this.setData({ sexRadioItems: this.data.sexRadioItems, sex: userInfo.customer_sex})
        }
      }
    }
    if (userInfo.customerRealAuth != ''){
      this.setData({ faceData: { name: userInfo.customerRealAuth.customer_real_auth_idcard_name, num: userInfo.customerRealAuth.customer_real_auth_idcard_num}, backData: 1, faceImg: userInfo.customerRealAuth.customer_real_auth_idcard_picture_front, backImg: userInfo.customerRealAuth.customer_real_auth_idcard_picture_back })
    }
  },
  //单选按钮
  radioChange: function (e) {
    var value = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.sexRadioItems.length; i++) {
      if (value.indexOf(this.data.sexRadioItems[i].id) !== -1) {
        changed['sexRadioItems[' + i + '].checked'] = true
      } else {
        changed['sexRadioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
    this.setData({ sex: value })
  },
  // 生日选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 地址选择
  chooseLocation: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'none',
                        duration: 1000
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.chooseLocation({
            success: (res)=> {
              this.setData({
                locationAddress: res.address
              })
            }
          })
        }
      }
    })
  },
  formSubmit(e){
    console.log(e)
  },
  //选择图片
  chooseWxImage: function (e) {
    var that = this;
    let side = e.currentTarget.dataset.side;
      wx.request({
        url: app.globalData.url + 'foster/get-qiniu-token',
        data: {},
        method: "GET",
        success: function (data) {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (file) {
              wx.showLoading({
                title: '上传中...',
              })
              var filePath = file.tempFilePaths[0];
              qiniuUploader.upload(filePath, (res) => {
                let img = res.imageURL;
                wx.downloadFile({
                  url: res.imageURL,
                  success(res) {
                    wx.getFileSystemManager().readFile({
                      filePath: res.tempFilePath, //选择图片返回的相对路径
                      encoding: 'base64', //编码格式
                      success: res => { //成功的回调
                        let cardAuthData = {
                          "image": res.data,
                          "configure": { "side": side }
                        }
                        wx.request({
                          url: 'https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json', 
                          method:'POST',
                          data: cardAuthData,
                          header: {
                            'Authorization': 'APPCODE 9eac44bd68274816a9c215f7f3ff2db5'
                          },
                          success(res) {
                            wx.hideLoading()
                            console.log(res, img)
                            if (res.statusCode != 463){
                              if (side == 'face') { that.setData({ faceData: res.data, faceImg: img }) }
                              if (side == 'back') { that.setData({ backData: res.data, backImg: img }) }
                            }else{
                              wx.showToast({
                                title: '请选择正确的身份证照片',
                                icon: 'none',
                                duration: 1000
                              })
                            }
                          }
                        })

                      }
                    })
                  },
                  fail: function (err) {
                    wx.hideLoading()
                    console.log(err)
                  }
                })

              }, (error) => {
                wx.hideLoading()
              }, {
                  region: 'NCN',
                  domain: 'http://img.poorfriends.com/',
                  uptoken: data.data.uptoken
                });
            }
          })
        }
      })
    
  },
  // 长按删除图片
  // longpress: function (e) {
  //   var that = this;
  //   var index = e.currentTarget.id - 1;
  //   var p = 0;
  //   wx.showModal({
  //     title: '',
  //     content: '确定要删除此照片吗？',
  //     success: function (res) {
  //       if (res.confirm) {
  //         for (var i = 0; i < that.data.imageLists.length; i++) {
  //           if (that.data.imageLists[i].imgId == e.currentTarget.id) {
  //             that.data.imageLists.splice(index, 1);
  //           }
  //         }
  //         for (var i = 0; i < that.data.imageLists.length; i++) {
  //           p = ++p;
  //           that.data.imageLists[i].imgId = p;
  //         }
  //         that.setData({
  //           lists: that.data.imageLists
  //         });
  //       }
  //     }
  //   })
  // }
  formSubmit(e){
    // console.log(e, this.data.faceData, this.data.backData)
    let faceData = this.data.faceData;
    let backData = this.data.backData;
    let userInfo = wx.getStorageSync('userInfo');
    let data = {
      "token": userInfo ? userInfo.token : '',
      "customer_nickname" : e.detail.value.nickname,
      "customer_sex" : this.data.sex,
      "customer_birthday" : e.detail.value.birthday,
      "customer_address" : e.detail.value.address,
      "customer_desc" : e.detail.value.introduce,
      "customerRealAuth" : {
          "customer_real_auth_idcard_picture_front":this.data.faceImg,
          "customer_real_auth_idcard_picture_back":this.data.backImg,
          "customer_real_auth_idcard_address":faceData.address,
          "customer_real_auth_idcard_name":faceData.name,
          "customer_real_auth_idcard_nationality":faceData.nationality,
          "customer_real_auth_idcard_num":faceData.num,
          "customer_real_auth_idcard_sex":faceData.sex,
          "customer_real_auth_idcard_birth":faceData.birth,
          "customer_real_auth_idcard_start_date":backData.start_date,
          "customer_real_auth_idcard_end_date":backData.end_date,
          "customer_real_auth_idcard_issue":backData.issue
        }
    }
    wx.request({
      url: app.globalData.url +'customer/modify',
      method: 'POST',
      data: JSON.stringify(data),
      header: {
        'Content-type': 'application/json'
      },
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function(){
          // userInfo.customer_desc = res.data.data.customer_desc;
          res.data.data.token = userInfo.token
          wx.setStorage({ key: "userInfo", data: res.data.data });
          wx.navigateBack({
            delta: 1
          })
        },1000)
      }
    })
    
  }
})