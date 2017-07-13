require('../../utils/date-format.js').dateformat()
Page({
  data: {
    travels: [null]
  },
  viewTravel: function (guid) {
    var guid = guid.currentTarget.dataset.guid
    wx.navigateTo({
      url: '../viewTravel/viewTravel?guid=' + guid + ''
    })
    console.log(guid)
  },
  gotoCreate: function () {
    wx.navigateTo({
      url: '../createTravel/createTravel'
    })
  },
  onLoad: function () {
    var that = this
    var data = that.data
    var sessionID = wx.getStorageSync('sessionID')
    wx.showLoading({
      title: 'loading',
      mask: false
    })
    wx.setNavigationBarTitle({
      title: 'MY TRAVEL'
    })
    wx.request({
      url: 'https://www.mingomin.com/service/public/server/getTravels', //服务地址
      header: {
        'content-type': 'application/json',
        'Cookie': 'sessionID=' + sessionID
      },
      success: function (res) {
        var result = res.data
        var index = 0
        var travelList = wx.getStorageSync('travelList')
        // result.map(e => e.date = new Date(e.date).Format('yyyy-MM-dd'))
        if (travelList) {
          console.log('travelList:',travelList)
          that.setData({
            travels: travelList
          })
          wx.hideLoading()
        } else {
          result.map((e) => {
            index++;
            e.date = new Date(e.date).Format('yyyy-MM-dd')
            wx.downloadFile({
              url: 'https://www.mingomin.com/service/public/upload/getAttachment?id=' + e.cover_img, //仅为示例，并非真实的资源
              success: function (res) {
                e.imgPath = res.tempFilePath
                if (index == result.length) {
                  console.log('currentResult:', result)
                  that.setData({
                    travels: result
                  })
                  wx.setStorageSync('travelList', result)
                  wx.hideLoading()
                }
              },
              fail: function (res) {
                console.log('failed:', res)
              }
            })
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