Page({
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  bindContinueTap: function (){
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/start_exam',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: 'start_section?id=' + id,
        })
      }
    })
  }
})