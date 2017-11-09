Page({
  data: {
    showModalStatus: true,
    tempTicket:null,
    mobile:null,
    code:null,
    nickName:null,
    sendDisabled:false,
    sendContent:"发送",
    btnDisabled:true,
    focus: true
  },
 
  hideModal: function (e) {
    var that=this;   
    var mobile=that.data.mobile
    var code=that.data.code
    var tempTicket = wx.getStorageSync('tempTicket');
    var user=wx.getStorageSync('user')
    var nickName=user.nickName
    var headImgUrl = user.avatarUrl
    console.log(user)
    
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/validate',
      data: {
        mobile: mobile,
        code: code,
        nickname: nickName,
        headImgUrl: headImgUrl
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'tempTicket': tempTicket
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
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
          wx.redirectTo({
            url: 'about_me',
          })
        } else {
          wx.showModal({
            title: "出错了",
            content: res.data.message,
            showCancel: false
          })
        }
      },
    })   
  },
  //发送短信
  bindSendTap:function(e){
    var that = this
    var tempTicket = wx.getStorageSync('tempTicket')
    wx.request({
      url:'https://weichen.bjtcsj.com/api/send_code',
      data:{
        mobile: this.data.mobile
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'tempTicket':tempTicket
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code==200){
          timing(that,60)
          function timing(that, left) {
            if (left == 1){
              that.setData({
                sendDisabled: false,
                sendContent:"发送"
              });
            } else {
              setTimeout(function () {
                that.setData({
                  sendContent: left - 1
                });
                timing(that, left - 1);
              }, 1000)
            }
            
          };
          that.setData({
            sendDisabled: true,
            btnDisabled: false,
            sendContent: 60
          });
        } else {
          wx.showModal({
            title: "出错了",
            content: res.data.message,
            showCancel: false
          })
        }
      }
    })
  },

  bindMobile:function(e){
    this.setData({
      mobile:e.detail.value
    })
  },
  bindCode:function (e) {
    this.setData({
      code: e.detail.value
    })
  }
})
