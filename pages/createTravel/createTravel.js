// pages/travelManagement/travelManagement.js
Page({
  data: {
    title: '',
    place: '',
    date: '',
    cover_img: '/static/images/default.jpg',
    validMsg: '',
  },
  bindDateChange: function (e) {
    var that = this
    that.setData({
      date: e.detail.value
    })
  },
  bindTitle: function (e) {
    var that = this
    that.setData({
      title: e.detail.value
    })
  },
  bindPlace: function (e) {
    var that = this
    that.setData({
      place: e.detail.value
    })
  },
  uploadImage: function () {
    var that = this
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          cover_img: tempFilePaths,
        })
        console.log(tempFilePaths)
      }
    })
  },
  valid: function () {
    var that = this
    var data = that.data
    if (data.title == '') {
      data.validMsg = '未设定游记标题'
      return false
    } else if (data.place == '') {
      data.validMsg = '未设定游记地点'
      return false
    } else if (data.cover_img === '/static/images/default.jpg') {
      data.validMsg = '未设定游记封面'
      return false
    } else {
      return true
    }
  },
  submitForm: function () {
    var that = this
    if (that.valid()) {
      wx.showLoading({
        title: '提交中',
        mask: true
      })
      wx.uploadFile({
        url: 'https://www.mingomin.com/service/public/upload/file', //服务地址
        filePath: that.data.cover_img[0],
        name: 'file',
        success: function (res) {
          var data = that.data
          wx.request({
            url: 'https://www.mingomin.com/service/public/server/createTravel', //仅为示例，并非真实的接口地址
            data: {
              title: data.title,
              place: data.place,
              date: data.date
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res)
              console.log(res.data)
              wx.hideLoading()
              wx.navigateTo({
                url: '../index/index'
              })
            }
          })
        },
        fail: function (res) {
          wx.hideLoading()
          console.log('fail:', res)
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: this.data.validMsg,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.setNavigationBarTitle({
      title: '创建游记'
    })
    //初始化日期
    var year = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    var day = new Date().getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    that.setData({
      // date: new Date().toLocaleDateString().replace(/\//g, '-')
      date: year + '-' + month + '-' + day
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