Page({
  onLoad: function (options) {
    var sectionNumbers = wx.getStorageSync('sectionNumbers')
    var id = options.id
    this.setData({
      id: id,
    })
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/user_exam/' + id + '/answer_key',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          verbalScore: res.data.verbalScore,
          quantitativeScore: res.data.quantitativeScore
        })
      }
    })
  },
  bindContinueTap: function () {
    wx.redirectTo({
      url: 'mockExamResult?id=' + this.data.id,
    })
  },
})