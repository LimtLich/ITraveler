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
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res)
            //发起网络请求
            var header = {}
            var sessionID = wx.getStorageSync('sessionID')
            if (sessionID) {
              console.log(sessionID)
              header = {
                'content-type': 'application/json',
                'Cookie': 'sessionID=' + sessionID
              }
            } else {
              header = {
                'content-type': 'application/json'
              }
            }
            wx.request({
              url: 'https://www.mingomin.com/service/public/server/login',
              data: {
                code: res.code
              },
              header: header,
              success: function (e) {
                if (!sessionID) {
                  wx.setStorageSync('sessionID', e.data)
                }
                wx.hideLoading()
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    })
  }
})
