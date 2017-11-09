Page({
  onShow: function () {
    // //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var _code = res.code
        wx.request({
          url: 'https://weichen.bjtcsj.com/api/login',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            code: _code
          },
          method: 'POST',
          success: function (res) {
            wx.setStorageSync('tempTicket', res.data.tempTicket)
            var user = res.data.user
            if (res.data.isValidated) {
              wx.setStorageSync('tempTicket', res.data.ticket)
              wx.getLocation({
                type: 'wgs84',
                success: (res) => {
                  var latitude = res.latitude
                  var longitude = res.longitude
                  var ticket = wx.getStorageSync('tempTicket');
                  wx.request({
                    url: 'https://weichen.bjtcsj.com/api/myself',
                    data: {
                      longitude: longitude,
                      latitude: latitude
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'ticket': ticket
                    },
                    method: 'POST',
                    success: (res) => {
                    }
                  })
                }
              })
              if (user.examTime && user.expectedMark) {
                wx.reLaunch({
                  url: 'drill',
                })
              } else {
                wx.redirectTo({
                  url: 'about_me',
                })
              }
            }
            else {
              wx.redirectTo({
                url: 'verify',
              })
            }
          }
        })
      }
    })
  },
})