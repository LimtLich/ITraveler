//index.js
//获取应用实例
require('../../utils/date-format.js').dateformat()
var app = getApp()
Page({
  data: {
    cover_img: null,
    travelID: null,
    animationData: {},
    travelInfo: {},
    paragraphContent: [],
    contentIndex: 0,
    textContent: null,
    currentType: null,
    showMask: false,
    showTextBox: false
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
  bindTextAreaBlur: function (e) {
    var that = this
    that.setData({
      textContent: e.detail.value,
    })
  },
  addContent: function (event) {
    var that = this
    var currenIndex = parseInt(event.currentTarget.dataset.index) + 1
    var currentType = event.currentTarget.dataset.type
    // regist show addContent box animation
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
    //edit mode,update current data
    if (currentType == 'edit') {
      var editIndex = parseInt(event.currentTarget.dataset.index)
      that.setData({
        textContent: that.data.paragraphContent[editIndex].value
      })
    }
    //show edit box & mark current index
    that.setData({
      showMask: true,
      showTextBox: true,
      contentIndex: currenIndex,
      currentType: currentType
    })
  },
  addPicture: function (event) {
    var that = this
    var editIndex = parseInt(event.currentTarget.dataset.index)
    var currenIndex = parseInt(event.currentTarget.dataset.index) + 1
    var currentType = event.currentTarget.dataset.type
    that.setData({
      contentIndex: currenIndex
    })
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths) {
          wx.showLoading({
            title: 'loading',
            mask: true
          })
          wx.uploadFile({
            url: 'https://www.mingomin.com/service/public/upload/file', //服务地址
            filePath: tempFilePaths[0],
            name: 'file',
            success: function (res) {
              var resData = JSON.parse(res.data)
              wx.hideLoading()
              if (currentType == 'edit') {
                that.data.paragraphContent[editIndex].value = resData.id
                that.setData({
                  paragraphContent: that.data.paragraphContent
                })
              } else if (currentType == 'add') {
                //update index
                if (that.data.paragraphContent.filter(e => e.index === that.data.contentIndex).length > 0) {
                  that.data.paragraphContent.filter(e => e.index >= that.data.contentIndex).map((c) => {
                    c.index = c.index + 1
                  })
                }
                that.data.paragraphContent.push({ travel_guid: that.data.travelID, index: that.data.contentIndex, key: 'image', value: resData.id })
                that.setData({
                  paragraphContent: that.data.paragraphContent.sort((a, b) => {
                    return a.index - b.index
                  })
                })
              } else {
                console.log('erro:', that.data.currentType)
              }
            }
          })
        }
      }
    })
  },
  confirmText: function () {
    var that = this
    var editIndex = that.data.contentIndex - 1
    that.setData({
      showMask: false,
      showTextBox: false
    })
    if (that.data.currentType == 'add') {
      if (that.data.textContent.trim()) {
        console.log('currentIndex:', that.data.contentIndex)
        if (that.data.paragraphContent.filter(e => e.index === that.data.contentIndex).length > 0) {
          that.data.paragraphContent.filter(e => e.index >= that.data.contentIndex).map((c) => {
            c.index = c.index + 1
          })
        }
        that.data.paragraphContent.push({ travel_guid: that.data.travelID, index: that.data.contentIndex, key: 'text', value: that.data.textContent })
        that.setData({
          paragraphContent: that.data.paragraphContent.sort((a, b) => {
            return a.index - b.index
          }),
          textContent: null
        })
      }
    } else if (that.data.currentType == 'edit') {
      if (that.data.textContent.trim()) {
        console.log(that.data.textContent)
        that.data.paragraphContent[editIndex].value = that.data.textContent
        that.setData({
          paragraphContent: that.data.paragraphContent,
          textContent: null
        })
      } else {
        that.data.paragraphContent.splice(editIndex, 1)
        that.setData({
          paragraphContent: that.data.paragraphContent,
          textContent: null
        })
        that.data.paragraphContent.filter(e => e.index >= editIndex).map((c) => {
          c.index = c.index - 1
        })
        console.log('delete')
      }
    } else {
      console.log('erro:', that.data.currentType)
    }
    //regist animation
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
      showTextBox: false,
      textContent: null
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
  deletePicture: function (event) {
    var that = this
    wx.showModal({
      title: 'Message',
      content: 'Sure to delete this image?',
      success: function (res) {
        if (res.confirm) {
          var Index = parseInt(event.currentTarget.dataset.index)
          that.data.paragraphContent.splice(Index, 1)
          that.setData({
            paragraphContent: that.data.paragraphContent,
            textContent: null
          })
          //update index
          that.data.paragraphContent.filter(e => e.index >= Index).map((c) => {
            c.index = c.index - 1
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  submitForm: function () {
    var that = this
    var sessionID = wx.getStorageSync('sessionID')
    console.log(that.data.paragraphContent)
    if (sessionID) {
      wx.showModal({
        title: 'Message',
        content: 'Sure to save this travel?',
        confirmText: 'Yes',
        cancelText: 'No',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'loading',
              mask: true
            })
            wx.request({
              url: 'https://www.mingomin.com/service/public/server/editTravel', //服务地址
              data: {
                travelID: that.data.travelID,
                travelInfo: that.data.travelInfo,
                paragraphContent: that.data.paragraphContent
              },
              header: {
                'content-type': 'application/json',
                'Cookie': 'sessionID=' + sessionID
              },
              success: function (res) {
                var result = res.data
                console.log('request result:', result)
                wx.hideLoading()
                wx.redirectTo({
                  url: '../travelManagement/travelManagement'
                })
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
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: 'Error',
        confirmText: 'Ok',
        showCancel: false,
        content: 'access timeout!',
        success: function (res) {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      })
    }
  },
  onLoad: function (option) {
    var that = this
    var data = that.data
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    wx.setNavigationBarTitle({
      title: 'EDIT'
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
