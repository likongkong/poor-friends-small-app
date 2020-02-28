Page({
  data: {
    mark:0
  },
  onShow: function () {

  },
  btnSelect(e){
    let mark = this.data.mark;
    this.setData({ mark: e.currentTarget.dataset.mark})
  }
})