require('../../utils/date-format.js').dateformat()
Page({
  data: {
    travels: []
  },
  viewTravel:function(guid){
    var guid = guid.currentTarget.dataset.guid
    wx.navigateTo({
      url: '../viewTravel/viewTravel?guid=' + guid + ''
    })  
    console.log(guid)
  },
  onLoad: function () {
    var that = this
    var data = that.data
    var sessionID = wx.getStorageSync('sessionID')
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: 'MY TRAVEL'
    })
    wx.request({
      url: 'https://www.mingomin.com/service/public/server/getTravels', //服务地址
      header: {
        'content-type': 'application/json',
        'Cookie': 'sessionID=' + sessionID
      },
      success: function (res) {
        var result = res.data
        result.map(e => e.date = new Date(e.date).Format('yyyy-MM-dd'))
        that.setData({
          travels: result
        })
        wx.hideLoading()
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