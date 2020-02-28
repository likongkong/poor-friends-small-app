//logs.js
var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();
var addressidArr = [];

Page({
  data: {
    photo:'',
    wxNumber:'',
    id:'',
    followed:false,
    is_login: true,
    is_loginBox:false,
    notAdopt:false,
    contact:false,
    swiperIndex: 0,
    focus:false,
    parentId:0,
    placeholder:'评论',
    dynamic:[],
    page:1,
    is_more: false,
    is_load: true,
    contactMask:false
  },
  onLoad: function (options) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    var isPX = wx.getStorageSync('isPX');
    if (userInfo) {
      that.setData({ is_login: false, isPX: isPX})
    }
    that.data.id = options.id;
    var data = {};
    data.id = options.id;
    data.page = this.data.page;
    data.token = userInfo ? userInfo.token:'';
    data.limit = 100;
    request.requestData('foster/foster-detail', "GET", data, function (res) {
      var addressidObj = {};
      addressidObj.province_id = res.data.data.area_province_id;
      addressidObj.city_id = res.data.data.area_city_id;
      addressidObj.region_id = res.data.data.area_region_id;
      addressidArr.push(addressidObj);
      that.setData({
        addressid: addressidArr
      })
      if (res.data.data.is_followed == 1) {
        that.setData({
          followed: true
        })
      }
      // 详情显示状态 detailType＝（1：I Want You）（2：已预定）（3：查看意向领养人名单）（4：Thank You For Loving Me）（5：发布它的最新动态）
      //是否领养
      if (res.data.data.is_adopted == 1) {
        // if (userInfo.customer_id != res.data.data.adopted_customer_id) {
        that.setData({
          detailType: 4
        })
        // } else {
        //   that.setData({
        //     detailType: 5
        //   })
        // }
      } else {
        //是不是送养人
        if (res.data.data.customer_id == userInfo.customer_id) {
          that.setData({
            detailType: 3
          })
        } else {
          //是不是已预定
          if (res.data.data.is_advance == 1) {
            that.data.photo = res.data.data.foster_phone;
            that.data.wxNumber = res.data.data.foster_wx_number;
            that.setData({
              detailType: 2
            })
          } else {
            that.data.photo = res.data.data.foster_phone;
            that.data.wxNumber = res.data.data.foster_wx_number;
            that.setData({
              detailType: 1
            })
          }
        }
      }
      for (var i = 0; i < res.data.data.dynamic.length; i++) {
        res.data.data.dynamic[i].created_at = util.formatTime(res.data.data.dynamic[i].created_at);
        // that.data.dynamic.push(res.data.data.dynamic[i])
      }
      that.setData({
        dataInfo: res.data.data,
        dynamic: that.data.dynamic,
        imgUrls: res.data.data.foster_photos,
        id: options.id
      })

      // wx.setNavigationBarTitle({
      //   title: res.data.data.foster_title
      // })
    }, function () {
      that.onLoad();
    }, null)
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.tel //需要拨打的电话号码
    })
  },
  // 上拉加载
  // onReachBottom: function () {
  //   if (this.data.is_load == true) {
  //     let page = ++this.data.page;
  //     var userInfo = wx.getStorageSync('userInfo');
  //     var data = {};
  //     data.id = this.data.id;
  //     data.page = page;
  //     data.token = userInfo ? userInfo.token : '';
  //     request.requestData('foster/foster-detail', "GET", data, (res)=> {
  //       if (res.data.data.dynamic.length != 0) {
  //         for (var i = 0; i < res.data.data.dynamic.length; i++) {
  //           res.data.data.dynamic[i].created_at = util.formatTime(res.data.data.dynamic[i].created_at);
  //           this.data.dynamic.push(res.data.data.dynamic[i])
  //         }
  //         this.setData({
  //           dynamic: this.data.dynamic,
  //         })
  //       } else {
  //         this.setData({ is_load: false, is_more: true })
  //       }
  //     })
  //   }
  // },
  //轮播滑动时，获取当前的轮播id
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.dataInfo.foster_title,
      path: 'pages/noadopt/noadopt?id=' + that.data.id,
      imageUrl: that.data.dataInfo.foster_title_photo
    }
  },
  contactBtn(){
    let dataInfo = this.data.dataInfo
    if(dataInfo.is_adopted == 1 ||  dataInfo.is_advance == 1){
      this.setData({contact: true});
    }else{
      this.setData({ notAdopt: true});
    }
  },
  close(){
    this.setData({ notAdopt: false, contact: false });
  },
  makePhoneCall(){
    let dataInfo = this.data.dataInfo
    wx.makePhoneCall({
      phoneNumber: dataInfo.foster_phone // 仅为示例，并非真实的电话号码
    })
  },
  userInfo:function(){
    this.setData({contactMask:true})
  },
  close(){
    this.setData({ contactMask: false })
  },
  wantYou: function (){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.navigateTo({
        url: '../adduserinfo/index?id=' + that.data.id + '&addressid=' + JSON.stringify(addressidArr)
      })
    } else {
      that.setData({
        is_loginBox: true
      });
    }
  },
  adopterList:function(){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.navigateTo({
        url: '../collection/collection?id=' + that.data.id
      })
    } else {
      that.setData({
        is_loginBox: true
      });
    }
  },
  collection: function (e) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      var data = {};
      data.id = e.currentTarget.dataset.id;
      data.token = userInfo.token;
      request.requestData('customer/create-follow', "POST", data, function (res) {
        wx.showToast({
          title: '关注成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000)
        that.setData({
          followed: true
        })
        var data = {};
        data.id = that.data.id;
        that.onLoad(data);
      }, function () {
        var data = {};
        data.id = that.data.id;
        that.onLoad(data);
      }, null)
    } else {
      that.setData({
        is_loginBox: true
      });
    }
  },
  releaseDetail:function(){
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.navigateTo({
        url: '../releasedynamic/releasedynamic?id=' + that.data.id
      })
    } else {
      that.setData({
        is_loginBox: true
      });
    }
  },
  
  bindblur(){
    console.log(111)
    this.setData({ focus: false, placeholder: '评论'})
  },

  comment(e){
    var userInfo = wx.getStorageSync('userInfo');
    var data = {};
    data.id = e.target.dataset.id,
    data.dynamic_parent_id = this.data.parentId,
    data.dynamic_content = e.detail.value,
    data.token = userInfo.token
    request.requestData('dynamic/create', "POST", data,  () => {
      wx.showToast({
        title: '评论成功',
        icon: 'none',
        duration: 1000
      })
      this.setData({ parentId: 0 });
      var data = {};
      data.id = this.data.id;
      this.onLoad(data);
    },null, null)
  },


  writeBack(e) {
    this.setData({ focus: true, parentId: e.currentTarget.dataset.customerid, placeholder:e.currentTarget.dataset.name})
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
      var data={};
      data.id = that.data.id;
      that.onLoad(data);
    })
  },
})
