Page({
  onLoad: function (options) {
    var sectionNumbers = wx.getStorageSync('sectionNumbers')
    var id = options.id
    this.setData({
      id: id,
      sectionNumbers: sectionNumbers
    })
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/start_section',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          section: res.data.section,
          limitTime: Math.floor(res.data.section.limitTime/60)
        })
      }
    })
  },
  bindContinueTap: function () {
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/start_section',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.redirectTo({
          url: 'question?id=' + id + '&questionId=' + res.data.questionId,
        })
      }
    })
  }
})