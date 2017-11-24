//app.js
App({
  onLaunch: function (){
    function getUserInfo(){
      wx.getUserInfo({
        success: res => {
          var users = res.userInfo;
          wx.setStorageSync('user', users)
        }
      })
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          getUserInfo()
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用用户信息，可以获取信息
              getUserInfo()
            },
            fail(){
              var users = {"nickName":null};
              wx.setStorageSync('user', users)
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
})