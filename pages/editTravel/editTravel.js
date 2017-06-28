//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    travelInfo: {},
  },
  bindDateChange: function (e) {
    var that = this
    that.setData({
      'travelInfo.date': e.detail.value
    })
  },
  bindTitle: function (e) {
    var that = this
    that.setData({
      'travelInfo.title': e.detail.value
    })
  },
  bindPlace: function (e) {
    var that = this
    that.setData({
      'travelInfo.place': e.detail.value
    })
  },
  submitForm: function () {
    var that = this
    console.log(that.data.travelInfo)
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
          var result = res.data
          that.setData({
            travelInfo: {
              title: result.title,
              place: result.place,
              cover_img: 'https://www.mingomin.com/service/public/upload/getAttachment?id=' + result.cover_img,
              date: result.date
            }
          })
          console.log(data.travelInfo)
        },
        fail: function (res) {
          wx.showModal({
            title: '错误',
            showCancel: false,
            content: res,
            success: function (res) { }
          })
        }
      })
    } else {
      console.log('data not exit')
    }
  },
  onUnload: function () {
    wx.redirectTo({
      url: '../travelManagement/travelManagement'
    })
  }
})
