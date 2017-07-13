//index.js
//获取应用实例
require('../../utils/date-format.js').dateformat()
var app = getApp()
Page({
  data: {
    travelID: null,
    travelInfo: {}
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
      mask: false
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
          var index = 0

          var travel = res.data

          var travelStorage = wx.getStorageSync(travel.guid)

          if (travelStorage) {
            console.log('has Storage')
            that.setData({
              travelInfo: travelStorage
            })
            wx.hideLoading()
          } else {
            console.log('no Storage')
            console.log('travel:',travel)
            wx.downloadFile({
              url: 'https://www.mingomin.com/service/public/upload/getAttachment?id=' + travel.cover_img,
              success: function (res) {
                travel.date = new Date(travel.date).Format('yyyy-MM-dd')
                travel.imgPath = res.tempFilePath
                var DetailImage = travel.travel_details.filter(e => e.key == 'image')
                if (DetailImage.length > 0) {
                  console.log('have Imgdetail')
                  DetailImage.map((c) => {
                    index++;
                    wx.downloadFile({
                      url: 'https://www.mingomin.com/service/public/upload/getAttachment?id=' + c.value,
                      success: function (res) {
                        c.imgPath = res.tempFilePath
                        if (index == DetailImage.length) {
                          console.log('index:', index)
                          that.setData({
                            travelInfo: travel
                          })
                          wx.setStorageSync(travel.guid, travel)
                          wx.hideLoading()
                        }
                      },
                      fail: function (res) {
                        console.log('failed:', res)
                      }
                    })
                  })
                } else {
                  console.log('no Imgdetail')
                  that.setData({
                    travelInfo: travel
                  })
                  wx.setStorageSync(travel.guid, travel)
                  wx.hideLoading()
                }
              }
            })
          }
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
