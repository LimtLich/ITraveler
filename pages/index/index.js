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
      console.log(userInfo)
      that.setData({
        userInfo: userInfo
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res)
            //发起网络请求
            wx.request({
              url: 'https://www.mingomin.com/service/public/server/login',
              data: {
                code: res.code
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
