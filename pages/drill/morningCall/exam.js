Page({

  data: {
    exam: null,
    continue:null
  },

  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id: id
    })
  },
  onShow: function () {
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/exam/' + id + '',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        var exam = res.data.exam
        wx.setStorageSync("sectionNumbers", exam.sectionNumbers)
        that.setData({
          exam: res.data.exam,
          userExamList: res.data.userExamList,
          continue: res.data.continue
        })
      }
    })
  },
  //进入结果页
  bindReciteTap: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'mockExamResult?id=' + id,
    })
  },
  //开始考试
  bindStartExamTap: function (e) {
    var id = this.data.id
    var that = this;
    var ticket = wx.getStorageSync('tempTicket')
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/exam/' + id + '/start',
      data: {},
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'POST',
      success: function (res) {
        wx.navigateTo({
          url: 'start_exam?id='+res.data.userExam.id,
        })
      }
    })
  },
  //继续考试
  bindContinueExamTap: function (e) {
    if (this.data.continue.currentPage =='start_exam'){
      wx.navigateTo({
        url: 'start_exam?id=' + this.data.continue.id,
      })
    } else
    if (this.data.continue.currentPage == 'start_section') {
      wx.navigateTo({
        url: 'start_section?id=' + this.data.continue.id,
      })
    } else {
      wx.navigateTo({
        url: 'question?id=' + this.data.continue.id + '&questionId=' + this.data.continue.currentPage,
      })
    }
  }
})