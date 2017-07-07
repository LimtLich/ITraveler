Page({
  data: {
    travels: []
  },
  onLoad: function () {
    var that = this
    var data = that.data
    wx.setNavigationBarTitle({
      title: 'MY TRAVEL'
    })
    wx.request({
      url: 'https://www.mingomin.com/service/public/server/getTravels', //服务地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var result = res.data
        that.setData({
          travels: result
        })
        console.log(data.travels)
      },
      fail: function (res) {
        wx.showModal({
          title: 'erro',
          showCancel: false,
          content: res,
          success: function (res) { }
        })
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})