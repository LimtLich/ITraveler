//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    animationData: {},
    travelInfo: {},
    showMask: false,
    showTextBox: false,
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
  addContent: function () {
    var that = this
    that.setData({
      showMask: true,
      showTextBox: true
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    this.animation = animation

    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      animation.opacity(1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  addPicture: function () {

  },
  confirmText: function () {
    var that = this
    that.setData({
      showMask: false,
      showTextBox: false
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.opacity(0).step()

    this.setData({
      animationData: animation.export()
    })
  },
  cancleText: function () {
    var that = this
    that.setData({
      showMask: false,
      showTextBox: false
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.opacity(0).step()

    this.setData({
      animationData: animation.export()
    })
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
  },
  onShow: function () {

  },
  // rotateAndScale: function () {
  //   // 旋转同时放大
  //   this.animation.rotate(45).scale(2, 2).step()
  //   this.setData({
  //     animationData: this.animation.export()
  //   })
  // },
  // rotateThenScale: function () {
  //   // 先旋转后放大
  //   this.animation.rotate(45).step()
  //   this.animation.scale(2, 2).step()
  //   this.setData({
  //     animationData: this.animation.export()
  //   })
  // },
  // rotateAndScaleThenTranslate: function () {
  //   // 先旋转同时放大，然后平移
  //   this.animation.rotate(45).scale(2, 2).step()
  //   this.animation.translate(100, 100).step({ duration: 1000 })
  //   this.setData({
  //     animationData: this.animation.export()
  //   })
  // }
})
