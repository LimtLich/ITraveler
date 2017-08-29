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
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          cover_img: tempFilePaths,
        })
      }
    })
  },
  valid: function () {
    var that = this
    var data = that.data
    if (data.title == '') {
      data.validMsg = '請輸入標題'
      return false
    } else if (data.place == '') {
      data.validMsg = '請選擇地址'
      return false
    } else if (data.cover_img === '/static/images/default.jpg') {
      data.validMsg = '請上傳封面圖片'
      return false
    } else {
      return true
    }
  },
  submitForm: function () {
    var that = this
    var sessionID = wx.getStorageSync('sessionID')
    if (sessionID) {
      if (that.valid()) {
        wx.showLoading({
          title: '加載中...',
          mask: false
        })
        wx.uploadFile({
          url: 'https://www.mingomin.com/service/public/upload/file', //服务地址
          filePath: that.data.cover_img[0],
          name: 'file',
          success: function (res) {
            var resData = JSON.parse(res.data)
            var data = that.data
            wx.request({
              url: 'https://www.mingomin.com/service/public/server/createTravel', //服务地址
              data: {
                title: data.title,
                place: data.place,
                date: data.date,
                cover_img: resData.id
              },
              header: {
                'content-type': 'application/json',
                'Cookie': 'sessionID=' + sessionID
              },
              success: function (res) {
                var travelList = []
                var travelListStorage = wx.getStorageSync('travelList')
                if (travelListStorage) {
                  travelListStorage.push({
                    guid: res.data,
                    title: data.title,
                    place: data.place,
                    date: data.date,
                    cover_img: resData.id,
                    imgPath: that.data.cover_img[0]
                  })
                  wx.setStorageSync('travelList', travelListStorage)
                } else {
                  travelList.push({
                    guid: res.data,
                    title: data.title,
                    place: data.place,
                    date: data.date,
                    cover_img: resData.id,
                    imgPath: that.data.cover_img[0]
                  })
                  wx.setStorageSync('travelList', travelList)
                }              
                wx.hideLoading()
                wx.redirectTo({
                  url: '../editTravel/editTravel?guid=' + res.data + ''
                })
              },
              fail: function (res) {
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  confirmText: '確認',
                  showCancel: false,
                  content: res,
                  success: function (res) { }
                })
              }
            })
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res,
              confirmText: '確認',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          confirmText: '確認',
          showCancel: false,
          content: this.data.validMsg,
          success: function (res) { }
        })
      }
    } else {
      wx.showModal({
        title: '錯誤',
        confirmText: 'Ok',
        showCancel: false,
        content: '請求超時',
        success: function (res) {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    wx.setNavigationBarTitle({
      title: '創建'
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
  }
})