//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    title: 'title',
  },
  onLoad: function (option) {
    console.log('onload option:', option)
    var that = this
    var data = that.data
    if (option.guid) {
      wx.request({
        url: 'https://www.mingomin.com/service/public/server/getTravelInfo', //服务地址
        data: {
          guid: option.guid,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          console.log(res.data)
        }
      })
    } else {
      console.log('data not exit')
    }
  },
  onUnload: function () {
    wx.navigateBack({
      delta: 99
    })
  }
})
