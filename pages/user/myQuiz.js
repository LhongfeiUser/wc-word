// pages/user/myQuiz.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     page:1,
     size:8,
     discussQuestionList:[],
     nickName:null,
  },
  onLoad: function (options){
     this.setData({
       nickName:options.nickName,
     })
  },
  onShow: function () {
      var that=this;
      that.QuizGetData(that)
  },
  QuizGetData: function (that) {
    var ticket = wx.getStorageSync('tempTicket');
    var page = that.data.page,
        size = that.data.size;
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/my_questions',
      data: {
        page: page,
        size: size,
      },
      header: {
        'content-type': 'application/json',
        'ticket': ticket
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var ary = res.data.discussQuestionList;
        var createdTime = '';
        for (var i = 0; i < ary.length; i++) {
          var date1 = ary[i].createdTime.replace(/-|-/g, "/")
          var date3 = new Date(date1).getTime()
          var date2 = new Date().getTime()
          var date4 = (date2 - date3) / 1000;
          if (date4 < 60) {
            createdTime = "刚刚提问"
          }
          if (date4 >= 60) {
            createdTime = Math.floor(date4 / 60) + "分钟前提问"
          }
          if (date4 >= 3600) {
            createdTime = Math.floor(date4 / 3600) + "小时前提问"
          }
          if (date4 >= 86400) {
            createdTime = Math.floor(date4 / 86400) + "天前提问"
          }
          ary[i].createdTime = createdTime;
        }
        that.setData({
          discussQuestionList: ary,
        })
      }
    })
  },
  bindAskDetailsTap:function(e){
    wx.navigateTo({
      url: '../community/askDetails?id='+e.currentTarget.id,
    })
  }
})