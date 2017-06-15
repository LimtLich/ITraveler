// pages/travelManagement/travelManagement.js
Page({
  data: {
    title: '',
    place: '',
    date: '',
    cover_img: '/static/images/default.jpg',
  },
  bindDateChange: function (e) {
    var that = this
    that.setData({
      date: e.detail.value
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
  submitForm: function () {
    console.log('in upload btn')
    var that = this
    wx.uploadFile({
      url: 'https://www.mingomin.com/service/public/upload/file', //仅为示例，非真实的接口地址
      filePath: that.data.cover_img[0],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        var data = res.data
        console.log('finish upload')
        //do something
      },
      fail: function (res) {
        console.log('fail:', res)
        //do something
      }
    })
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