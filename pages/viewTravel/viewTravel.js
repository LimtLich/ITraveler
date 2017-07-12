//index.js
//获取应用实例
require('../../utils/date-format.js').dateformat()
var app = getApp()
Page({
  data: {
    cover_img: null,
    travelID: null,
    travelInfo: {},
    paragraphContent: [],
  },
  gotoEdit: function () {
    var that = this
    wx.navigateTo({
      url: '../editTravel/editTravel?guid=' + that.data.travelID + ''
    })
  },
  onLoad: function (option) {
    var that = this
    var data = that.data
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: 'Travel'
    })
    if (option.guid) {
      that.setData({
        travelID: option.guid
      })
      wx.request({
        url: 'https://www.mingomin.com/service/public/server/getTravelInfo', //服务地址
        data: {
          guid: option.guid,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var travel = res.data
          var travelDetails = travel.travel_details
          travel.date = new Date(travel.date).Format('yyyy-MM-dd')
          console.log('dateAfter:', travel.date)
          that.setData({
            cover_img: 'https://www.mingomin.com/service/public/upload/getAttachment?id=' + travel.cover_img,
            travelInfo: travel,
            paragraphContent: travelDetails
          })
          wx.hideLoading()
          console.log('data-travelInfo:', travel)
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
    } else {
      console.log('data not exit')
    }
  }
})
