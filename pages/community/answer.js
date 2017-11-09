// pages/community/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:'',
    id:null,
  },
  onLoad: function (options){
      this.setData({
        id:options.id
      })
  },
  bindDescribeTap:function(e){
     this.setData({
      answer:e.detail.value
     })
  },
  bindSubmitTap: function () {
    var ticket = wx.getStorageSync('tempTicket');
    var answer=this.data.answer,
        id=this.data.id;
    wx.request({
      url: 'https://weichen.bjtcsj.com/api/discuss/answer',
      data: {
        answer: answer,
        questionId: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'ticket': ticket,
      },
      method: 'POST',
      success: function (res) {
        wx.navigateBack();
      }
    })
  },
})