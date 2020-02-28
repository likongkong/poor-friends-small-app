//logs.js
var amapFile = require('../../utils/amap-wx.js');
var qiniuUploader = require("../../utils/qiniuUploader.js");
var util = require('../../utils/util.js');
var request = require('../../utils/request.js');
var app = getApp();

Page({
  data: {
    lists:[],
    imageLists: [],
    is_loginBox: false,
    isSubmit: true,
    isDisclaimer: false,
    mask: false,
    sortRadioItems: [{ name: '10', value: '汪星人'},{ name: '20', value: '喵星人' },{ name: '30', value: '其他物种' },],
    sort:null,
    sexRadioItems: [{ name: '1', value: '小王子' }, { name: '2', value: '小公举' },{ name: '3', value: '未知' }],
    sex: null,
    jueyuRadioItems: [{ name: '10', value: '不详' }, { name: '20', value: '已绝育' }, { name: '30', value: '未绝育' }],
    jueyu: null,
    quchongRadioItems: [{ name: '10', value: '未知' }, { name: '20', value: '已驱虫' }, { name: '30', value: '未驱虫' }],
    quchong: null,
    laiyuanRadioItems: [{ name: '10', value: '家养' }, { name: '20', value: '救助站' }, { name: '30', value: '个人救助' }],
    laiyuan: null,
    yimiaoRadioItems: [{ name: '10', value: '不详' }, { name: '20', value: '已接种' }, { name: '30', value: '未接种' }],
    yimiao: null,
    actualityItems: [{ value: '领养前取得家人的同意' },{ value: '有防盗门、纱窗护网' },{ value: '不离不弃，有病就医，不虐待，不买卖' },{ value: '同城领养' },{ value: '按时打疫苗' },{ value: '文明养宠，出门牵绳，科学喂养' }],
    actuality: [],
    ageArray: [
      {name: '不详'},
      {name: '0-3个月'},
      {name: '4-6个月'},
      {name: '7-12个月'},
      { name: '1岁' },
      { name: '2岁' },
      { name: '3岁' },
      { name: '4岁' },
      { name: '5岁' },
      { name: '6岁' },
      { name: '7岁' },
      { name: '8岁' },
      { name: '9岁' },
      { name: '10岁'},
      { name: '11岁'},
      { name: '12岁' },
      { name: '13岁' },
      { name: '14岁' },
      { name: '15岁' },
      { name: '16岁' },
      { name: '17岁' },
      { name: '18岁' },
      { name: '19岁' },
      { name: '20岁'},
    ],
    current: 0,
    textareaMask:true,
    actualityVal:'请输入30字以内其他信息',
    describeVal:'请输入100字以内宠物的故事及宠物的信息',
    actualityVal1:'',
    describeVal1:''
  },
  onShow: function() {
  },
  //选择图片
  chooseWxImage: function (e) {
    var imageLists = this.data.imageLists;
    if (imageLists.length < 6) {
      var that = this;
      var data = {};
      wx.request({
        url: app.globalData.url + 'foster/get-qiniu-token',
        data: {},
        method: "GET",
        success: function (data) {
          wx.chooseImage({
            count: 6, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (file) {
              wx.showLoading({
                title: '上传中...',
              })
              let state = 0;
              console.log(file.tempFilePaths)
              for (var i = 0; i < file.tempFilePaths.length; i++) {
                qiniuUploader.upload(file.tempFilePaths[i], (res) => {
                  wx.hideLoading()
                  state++;
                  var newData = {
                    imgUrl: res.imageURL,
                    imgId: state
                  };
                  imageLists.push(newData);
                  that.setData({
                    lists: imageLists,
                  });
                }, (error) => {
                  wx.hideLoading()
                  // console.log('error: ' + error);
                }, {
                    region: 'NCN',
                    domain: 'http://img.poorfriends.com/',
                    uptoken: data.data.uptoken
                  });
              }
            }
          })
        }
      })
    } else {
      util.showModal('', '最多只能上传6张图片', function () { });
    }
  },
  // 长按删除图片
  longpress: function (e) {
    var that = this;
    var index = e.currentTarget.id - 1;
    var p = 0;
    wx.showModal({
      title: '',
      content: '确定要删除此照片吗？',
      success: function (res) {
        if (res.confirm) {
          for (var i = 0; i < that.data.imageLists.length; i++) {
            if (that.data.imageLists[i].imgId == e.currentTarget.id) {
              that.data.imageLists.splice(index, 1);
            }
          }
          for (var i = 0; i < that.data.imageLists.length; i++) {
            p = ++p;
            that.data.imageLists[i].imgId = p;
          }
          that.setData({
            lists: that.data.imageLists
          });
        }
      }
    })
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: '流浪动物之家-For.it',
      path: 'pages/createDetail/createDetail',
      imageUrl: '../../image/pagehomeshare.png'
    }
  },
  // 宠物年龄选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //单选按钮
  radioChange: function (e) {
    var name = e.currentTarget.dataset.name;
    var item = e.currentTarget.dataset.item;
    var value = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data[item].length; i++) {
      if (value.indexOf(this.data[item][i].name) !== -1) {
        changed['' + item + '[' + i + '].checked'] = true
      } else {
        changed['' + item + '[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
    this.setData({[name]: value})
  },
  //多选按钮
  checkboxChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.actualityItems.length; i++) {
      if (checked.indexOf(this.data.actualityItems[i].value) !== -1) {
        changed['actualityItems[' + i + '].checked'] = true
      } else {
        changed['actualityItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
    this.setData({actuality:checked})

  },

  //下一步
  nextFormSubmit(e) {
    let val = e.detail.value;
    if (this.data.imageLists.length == 0){
      wx.showToast({title: '请添加照片',icon: 'none',duration: 1500})
    } else if (this.data.sort == null){
      wx.showToast({ title: '请选择类别', icon: 'none', duration: 1500 })
    } else if (this.data.sex == null) {
      wx.showToast({ title: '请选择性别', icon: 'none', duration: 1500 })
    } else if (val.title == '') {
      wx.showToast({ title: '请输入标题', icon: 'none', duration: 1500 })
    } else if (val.name == '') {
      wx.showToast({ title: '请输入宠物名字', icon: 'none', duration: 1500 })
    } else if (val.age == '') {
      wx.showToast({ title: '请选择宠物年龄', icon: 'none', duration: 1500 })
    } else if (val.variety == '') {
      wx.showToast({ title: '请输入宠物品种', icon: 'none', duration: 1500 })
    } else if (this.data.jueyu == null) {
      wx.showToast({ title: '是否绝育', icon: 'none', duration: 1500 })
    } else if (this.data.quchong == null) {
      wx.showToast({ title: '是否驱虫', icon: 'none', duration: 1500 })
    } else if (this.data.laiyuan == null) {
      wx.showToast({ title: '请选择来源', icon: 'none', duration: 1500 })
    } else if (this.data.yimiao == null) {
      wx.showToast({ title: '是否接入疫苗', icon: 'none', duration: 1500 })
    }else{
      this.setData({ current: 1, title: val.title , petName: val.name, petAge: val.age, petVariety: val.variety })
    }
  },
  //上一步
  prev: function (e) {
    this.setData({current: 0})
  },
 
  // textarea遮罩层显示
  textareaMask(e){
    this.setData({textareaMask: !this.data.textareaMask})
    let ind = e.currentTarget.dataset.index;
    if (ind == 0){
      this.setData({
        actualityFocus: true
      })
    }else{
      this.setData({
        describeFocus: true
      })
    }
  },
  //获取textarea的value值
  bindinput(e){
    let ind = e.currentTarget.dataset.index;
    let val = e.detail.value;
    if (ind == 0) {
      console.log(val)
      this.setData({
        actualityVal: val != '' ? val :'请输入30字以内其他信息'
      })
    } else {
      this.setData({
        describeVal: val != '' ? val : '请输入100字以内宠物的故事及宠物的信息'
      })
    }
  },
  //textarea遮罩层显示
  bindblur() {
    this.setData({ textareaMask: true })
  },
  
  // disclaimer() {
  //   this.setData({
  //     mask: true
  //   })
  // },
  // isDisclaimer() {
  //   let isDisclaimer = this.data.isDisclaimer
  //   if (isDisclaimer) {
  //     this.setData({
  //       isDisclaimer: false
  //     })
  //   } else {
  //     this.setData({
  //       isDisclaimer: true
  //     })
  //   }
  // },
  // close() {
  //   this.setData({
  //     mask: false
  //   })
  // },
  // close1() {
  //   this.setData({
  //     mask: false,
  //     isDisclaimer: true
  //   })
  // },
  verification: function(e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    })
  },
  formSubmit: function(e) {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      that.setData({
        is_loginBox: true
      });
    } else {
      if (that.data.isSubmit == true) {
        that.setData({isSubmit: false});
        var imageLists = that.data.imageLists;
        var imgurl = [];
        for (var i = 0; i < imageLists.length; i++) {
          imgurl.push(imageLists[i].imgUrl);
        }
        var actuality = [];
        for (var i = 0; i < this.data.actuality.length; i++) {
          actuality.push(this.data.actuality[i]);
        }
        if (this.data.actuality == [] && this.data.actualityVal =='请输入30字以内其他信息') {
          wx.showToast({ title: '请选择领养要求', icon: 'none', duration: 1500 })
          that.setData({ isSubmit: true });
          return false;
        }
        if (this.data.describeVal == '请输入100字以内宠物的故事及宠物的信息') {
          wx.showToast({ title: '请填写宠物介绍', icon: 'none', duration: 1500 })
          that.setData({ isSubmit: true });
          return false;
        }
        if (e.detail.value.wxnumber == '') {
          wx.showToast({ title: '请填写微信号', icon: 'none', duration: 1500 })
          that.setData({ isSubmit: true });
          return false;
        }
        if (e.detail.value.phone == '' ) {
          wx.showToast({ title: '请填写手机号', icon: 'none', duration: 1500 })
          that.setData({ isSubmit: true });
          return false;
        }
        if (e.detail.value.phone != '') {
          var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
          if (!myreg.test(e.detail.value.phone)) {
            wx.showToast({ title: '请填写正确的手机号', icon: 'none', duration: 1500 })
            that.setData({ isSubmit: true });
            return false;
          }
        }
        if (e.detail.value.address == '') {
          wx.showToast({ title: '请选择地址', icon: 'none', duration: 1500 })
          that.setData({ isSubmit: true });
          return false;
        }
        
        var data = {};
          data.foster_title = that.data.title,
          data.foster_phone = e.detail.value.phone
          data.foster_wx_number = e.detail.value.wxnumber,
          data.foster_address = e.detail.value.address,
          data.family_id = that.data.sort,
          data.species_name = that.data.petVariety,
          data.foster_sex = that.data.sex,
          data.foster_age = that.data.petAge,
          data.foster_name = that.data.petName,
          data.adopt_require = that.data.actualityVal == '请输入30字以内其他信息' ? '' : that.data.actualityVal,
          data.adopt_require_detail = JSON.stringify(that.data.actuality),
          data.foster_introduce = that.data.describeVal == '请输入100字以内宠物的故事及宠物的信息' ? '' : that.data.describeVal,
          data.foster_photos = JSON.stringify(imgurl),
          data.foster_sterilizations = that.data.jueyu,
          data.foster_insect_repellent = that.data.quchong,
          data.foster_source = that.data.laiyuan,
          data.foster_vaccine = that.data.yimiao,
          data.token = userInfo.token
        request.requestData('foster/create', "POST", data, function(res) {
          that.data.imageLists = [];
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(function() {
            that.data.isSubmit = true;
            wx.switchTab({
              url: '../index/index'
            })
          }, 1500)
          setTimeout(function () {
            that.setData({
              current: 0,
              lists: that.data.imageLists,
              title: '',
              petName: '',
              index: '',
              petVariety: '',
              sortRadioItems: [{ name: '10', value: '汪星人' }, { name: '20', value: '喵星人' }, { name: '30', value: '其他物种' },],
              sort: null,
              sexRadioItems: [{ name: '1', value: '小王子' }, { name: '2', value: '小公举' }, { name: '3', value: '未知' }],
              sex: null,
              jueyuRadioItems: [{ name: '10', value: '不详' }, { name: '20', value: '已绝育' }, { name: '30', value: '未绝育' }],
              jueyu: null,
              quchongRadioItems: [{ name: '10', value: '未知' }, { name: '20', value: '已驱虫' }, { name: '30', value: '未驱虫' }],
              quchong: null,
              laiyuanRadioItems: [{ name: '10', value: '家养' }, { name: '20', value: '救助站' }, { name: '30', value: '个人救助' }],
              laiyuan: null,
              yimiaoRadioItems: [{ name: '10', value: '不详' }, { name: '20', value: '已接种' }, { name: '30', value: '未接种' }],
              yimiao: null,
              actualityItems: [{ value: '领养前取得家人的同意' }, { value: '有防盗门、纱窗护网' }, { value: '不离不弃，有病就医，不虐待，不买卖' }, { value: '同城领养' }, { value: '按时打疫苗' }, { value: '文明养宠，出门牵绳，科学喂养' }],
              actuality: [],
              actualityVal: '请输入30字以内其他信息',
              describeVal: '请输入100字以内宠物的故事及宠物的信息',
              wxnumber: '',
              phone: '',
              locationAddress: '',
              actualityVal1: '',
              describeVal1: ''
            });
          }, 2500)
          
        }, function() {
          that.setData({ isSubmit: true });
          wx.showToast({
            title: '发布失败，请重新发布',
            icon: 'none',
            duration: 1000
          })
        }, null)
      }
    }
  },
  // bindPickerChangeType: function(e) {
  //   var that = this;
  //   that.setData({
  //     typeArrayTxt: that.data.typeArray[e.detail.value]
  //   })
  // },
  // bindPickerChangeSex: function(e) {
  //   var that = this;
  //   that.setData({
  //     sexArrayTxt: that.data.sexArray[e.detail.value]
  //   })
  // },
  chooseLocation: function() {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function(data) {
                    console.log(data);
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'none',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
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
            success: function(res) {
              console.log(res)
              that.setData({
                locationAddress: res.address
              })
            }
          })
        }
      }
    })


  },
  
  //隐藏登录框
  chooseLoginHide: function(e) {
    var that = this;
    that.setData({
      is_loginBox: false
    });
  },
  // 微信登录
  onGotUserInfo: function(e) {
    var that = this;
    request.wxLogin(e, that, function() {
      console.log("登录成功")
      that.setData({
        is_loginBox: false
      });
      // var data = {};
      // data.id = that.data.id;
      // that.onLoad(data);
    })
  },
})