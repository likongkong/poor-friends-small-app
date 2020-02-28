App({
  // https://api.poorfriends.com/v1/
  globalData: {
    url:'https://dev-api.poorfriends.com/v1/',
    cityId: '',
    cityName: '',
    token: '',
    userId: '',
    userName:'',
    userPhoto:'',
    code:'',
    hasUserInfo: false,
    is_clickable: true,
    directory:'',
    // imageView:'?imageView2/1/w/400/h/400/q/75|imageslim' //七牛指定宽高缩略裁剪
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log("resMODEL", res)
        let model = res.model
        this.windowHeight = res.windowHeight
        this.isPX = (model.indexOf("iPhone X") != -1 || model == "iPhone XR<iPhone11,8>" || model == "iPhone XS Max<iPhone11,4>" || model == "iPhone XS Max<iPhone11,6>" || model == "iPhone XS<iPhone11,2>") ? true : false
        wx.setStorage({ key: "isPX", data: this.isPX });
      }
    })
  }
})
