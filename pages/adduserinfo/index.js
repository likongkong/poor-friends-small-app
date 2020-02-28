var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();
var addressId = '';
var userId = '';
Page({
  data: {
    sexArray: ['男', '女','保密'],
    typeArray: ['产权房', '独立租房','合租房']
  },
  onLoad: function (options) {
    userId = options.id;
    addressId = JSON.parse(options.addressid);
  },
  bindPickerChangeSex: function (e) {
    var that = this;
    that.setData({
      sexArrayTxt: that.data.sexArray[e.detail.value]
    })
  },
  bindPickerChangeType: function (e) {
    var that = this;
    that.setData({
      typeArrayTxt: that.data.typeArray[e.detail.value]
    })
  },
  checkboxChange: function (e) {
    console.log(e)
  },
  formSubmit: function (e) {
    var that = this;
    var sex = '';
    var housetype = '';
    var userInfo = wx.getStorageSync('userInfo');
    if (e.detail.value.name == '') {
      util.showModal('', '请添加您的姓名', function () { });
      return false;
    }
    if (e.detail.value.sex == '') {
      util.showModal('', '请选择您的性别', function () { });
      return false;
    }else{
      if (e.detail.value.sex == '男') {
        sex = 2;
      } else if (e.detail.value.sex == '女') {
        sex = 3;
      } else {
        sex = 1;
      }
    }
    if (e.detail.value.idcard == '') {
      util.showModal('', '请填写您的身份证号码', function () { });
      return false;
    }else{
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
      if (!reg.test(e.detail.value.idcard)) {
        util.showModal('', '请填写正确的身份证号码', function () { });
        return false;
      }
    }
    if (e.detail.value.phone == '') {
      util.showModal('', '请填写您的手机号码', function () { });
      return false;
    } else {
      var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!reg.test(e.detail.value.phone)) {
        util.showModal('', '请填写正确的手机号码', function () { });
        return false;
      }
    }
    if (e.detail.value.address == '') {
      util.showModal('', '请填写您的居住地址', function () { });
      return false;
    }
    if (e.detail.value.housetype != '') {
      if (e.detail.value.housetype == '产权房') {
        housetype = 10;
      } else if (e.detail.value.housetype == '独立租房') {
        housetype = 20;
      } else {
        housetype = 30;
      }
    }
    var data = {};
    data.id = userId;
    data.token = userInfo.token;
    data.customer_real_name = e.detail.value.name;
    data.customer_sex = sex;
    data.customer_idcard_number = e.detail.value.idcard;
    data.customer_phone = e.detail.value.phone;
    data.customer_reside_province_id = addressId[0].province_id;
    data.customer_reside_city_id = addressId[0].city_id;
    data.customer_reside_region_id = addressId[0].region_id;
    data.customer_reside_address = e.detail.value.address;
    data.customer_company = e.detail.value.work;
    data.customer_live_environment = housetype;
    data.msg_form_id = e.detail.formId;
    request.requestData('foster/want-you', "POST", data, function (res) {
      wx.showToast({
        title: '预约领养成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        var data = {};
        data.id = userId;
        var pages = getCurrentPages();
        var page = pages[pages.length - 2];
        page.onLoad(data);
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
    }, function(){
      that.onLoad();
    }, null)
  }
})