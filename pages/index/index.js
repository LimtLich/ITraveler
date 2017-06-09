//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  CreateTravel: function () {
    wx.navigateTo({
      url: '../createTravel/createTravel'
    })
  },
  TravelManagement: function () {
    wx.navigateTo({
      url: '../travelManagement/travelManagement'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    wx.request({
      url: 'https://www.mingomin.com/service/public/server/test', //仅为示例，并非真实的接口地址
      data: {
        testObj:"tester"
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        console.log(res.data)
      }
    })
  }
})
